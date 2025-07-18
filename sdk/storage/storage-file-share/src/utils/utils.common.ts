// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { AbortSignalLike } from "@azure/abort-controller";
import type { HttpHeaders } from "@azure/core-rest-pipeline";
import { createHttpHeaders } from "@azure/core-rest-pipeline";
import type {
  ListFilesAndDirectoriesSegmentResponse as ListFilesAndDirectoriesSegmentResponseInternal,
  ListHandlesResponse as ListHandlesResponseInternal,
  SharePermission,
  StringEncoded,
} from "../generated/src/models/index.js";
import type {
  DirectoryItem,
  FileItem,
  HandleItem,
  ListFilesAndDirectoriesSegmentResponse,
  ListHandlesResponse,
} from "../generatedModels.js";
import type { HttpAuthorization, NfsFileMode, PosixRolePermissions } from "../models.js";
import { HeaderConstants, PathStylePorts, URLConstants } from "./constants.js";
import { isNodeLike } from "@azure/core-util";
import type { HttpHeadersLike, WebResourceLike } from "@azure/core-http-compat";

/**
 * Reserved URL characters must be properly escaped for Storage services like Blob or File.
 *
 * ## URL encode and escape strategy for JS SDKs
 *
 * When customers pass a URL string into XXXClient classes constructor, the URL string may already be URL encoded or not.
 * But before sending to Azure Storage server, the URL must be encoded. However, it's hard for a SDK to guess whether the URL
 * string has been encoded or not. We have 2 potential strategies, and chose strategy two for the XXXClient constructors.
 *
 * ### Strategy One: Assume the customer URL string is not encoded, and always encode URL string in SDK.
 *
 * This is what legacy V2 SDK does, simple and works for most of the cases.
 * - When customer URL string is "http://account.blob.core.windows.net/con/b:",
 *   SDK will encode it to "http://account.blob.core.windows.net/con/b%3A" and send to server. A blob named "b:" will be created.
 * - When customer URL string is "http://account.blob.core.windows.net/con/b%3A",
 *   SDK will encode it to "http://account.blob.core.windows.net/con/b%253A" and send to server. A blob named "b%3A" will be created.
 *
 * But this strategy will make it not possible to create a blob with "?" in it's name. Because when customer URL string is
 * "http://account.blob.core.windows.net/con/blob?name", the "?name" will be treated as URL paramter instead of blob name.
 * If customer URL string is "http://account.blob.core.windows.net/con/blob%3Fname", a blob named "blob%3Fname" will be created.
 * V2 SDK doesn't have this issue because it doesn't allow customer pass in a full URL, it accepts a separate blob name and encodeURIComponent for it.
 * We cannot accept a SDK cannot create a blob name with "?". So we implement strategy two:
 *
 * ### Strategy Two: SDK doesn't assume the URL has been encoded or not. It will just escape the special characters.
 *
 * This is what V10 Blob Go SDK does. It accepts a URL type in Go, and call url.EscapedPath() to escape the special chars unescaped.
 * - When customer URL string is "http://account.blob.core.windows.net/con/b:",
 *   SDK will escape ":" like "http://account.blob.core.windows.net/con/b%3A" and send to server. A blob named "b:" will be created.
 * - When customer URL string is "http://account.blob.core.windows.net/con/b%3A",
 *   There is no special characters, so send "http://account.blob.core.windows.net/con/b%3A" to server. A blob named "b:" will be created.
 * - When customer URL string is "http://account.blob.core.windows.net/con/b%253A",
 *   There is no special characters, so send "http://account.blob.core.windows.net/con/b%253A" to server. A blob named "b%3A" will be created.
 *
 * This strategy gives us flexibility to create with any special characters. But "%" will be treated as a special characters, if the URL string
 * is not encoded, there shouldn't a "%" in the URL string, otherwise the URL is not a valid URL.
 * If customer needs to create a blob with "%" in it's blob name, use "%25" insead of "%". Just like above 3rd sample.
 * And following URL strings are invalid:
 * - "http://account.blob.core.windows.net/con/b%"
 * - "http://account.blob.core.windows.net/con/b%2"
 * - "http://account.blob.core.windows.net/con/b%G"
 *
 * Another special character is "?", use "%2F" to represent a blob name with "?" in a URL string.
 *
 * ### Strategy for containerName, blobName or other specific XXXName parameters in methods such as `ContainerClient.getBlobClient(blobName)`
 *
 * We will apply strategy one, and call encodeURIComponent for these parameters like blobName. Because what customers passes in is a plain name instead of a URL.
 *
 * @see https://learn.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata
 * @see https://learn.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata
 *
 * @param url -
 */
export function escapeURLPath(url: string): string {
  const urlParsed = new URL(url);

  let path = urlParsed.pathname;
  path = path || "/";

  path = escape(path);
  urlParsed.pathname = path;

  return urlParsed.toString();
}

export interface ConnectionString {
  kind: "AccountConnString" | "SASConnString";
  url: string;
  accountName: string;
  accountKey?: any;
  accountSas?: string;
}

function getValueInConnString(
  connectionString: string,
  argument:
    | "FileEndpoint"
    | "AccountName"
    | "AccountKey"
    | "DefaultEndpointsProtocol"
    | "EndpointSuffix"
    | "SharedAccessSignature",
): string {
  const elements = connectionString.split(";");
  for (const element of elements) {
    if (element.trim().startsWith(argument)) {
      return element.trim().match(argument + "=(.*)")![1];
    }
  }
  return "";
}

/**
 * Extracts the parts of an Azure Storage account connection string.
 *
 * @param connectionString - Connection string.
 * @returns String key value pairs of the storage account's url and credentials.
 */
export function extractConnectionStringParts(connectionString: string): ConnectionString {
  // Matching FileEndpoint in the Account connection string
  let fileEndpoint = getValueInConnString(connectionString, "FileEndpoint");
  // Slicing off '/' at the end if exists
  // (The methods that use `extractConnectionStringParts` expect the url to not have `/` at the end)
  fileEndpoint = fileEndpoint.endsWith("/") ? fileEndpoint.slice(0, -1) : fileEndpoint;

  if (
    connectionString.search("DefaultEndpointsProtocol=") !== -1 &&
    connectionString.search("AccountKey=") !== -1
  ) {
    // Account connection string

    let defaultEndpointsProtocol = "";
    let accountName = "";
    let accountKey = Buffer.from("accountKey", "base64");
    let endpointSuffix = "";

    // Get account name and key
    accountName = getValueInConnString(connectionString, "AccountName");
    accountKey = Buffer.from(getValueInConnString(connectionString, "AccountKey"), "base64");

    if (!fileEndpoint) {
      // FileEndpoint is not present in the Account connection string
      // Can be obtained from `${defaultEndpointsProtocol}://${accountName}.file.${endpointSuffix}`

      defaultEndpointsProtocol = getValueInConnString(connectionString, "DefaultEndpointsProtocol");
      const protocol = defaultEndpointsProtocol!.toLowerCase();
      if (protocol !== "https" && protocol !== "http") {
        throw new Error(
          "Invalid DefaultEndpointsProtocol in the provided Connection String. Expecting 'https' or 'http'",
        );
      }

      endpointSuffix = getValueInConnString(connectionString, "EndpointSuffix");
      if (!endpointSuffix) {
        throw new Error("Invalid EndpointSuffix in the provided Connection String");
      }
      fileEndpoint = `${defaultEndpointsProtocol}://${accountName}.file.${endpointSuffix}`;
    }

    if (!accountName) {
      throw new Error("Invalid AccountName in the provided Connection String");
    } else if (accountKey.length === 0) {
      throw new Error("Invalid AccountKey in the provided Connection String");
    }

    return {
      kind: "AccountConnString",
      url: fileEndpoint,
      accountName,
      accountKey,
    };
  } else {
    // SAS connection string
    const accountSas = getValueInConnString(connectionString, "SharedAccessSignature");
    let accountName = getValueInConnString(connectionString, "AccountName");
    // if accountName is empty, try to read it from BlobEndpoint
    if (!accountName) {
      accountName = getAccountNameFromUrl(fileEndpoint);
    }
    if (!fileEndpoint) {
      throw new Error("Invalid FileEndpoint in the provided SAS Connection String");
    } else if (!accountSas) {
      throw new Error("Invalid SharedAccessSignature in the provided SAS Connection String");
    }

    return { kind: "SASConnString", url: fileEndpoint, accountName, accountSas };
  }
}

/**
 * Internal escape method implemented Strategy Two mentioned in escapeURL() description.
 *
 * @param text -
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
function escape(text: string): string {
  return encodeURIComponent(text)
    .replace(/%2F/g, "/") // Don't escape for "/"
    .replace(/'/g, "%27") // Escape for "'"
    .replace(/\+/g, "%20")
    .replace(/%25/g, "%"); // Revert encoded "%"
}

/**
 * Append a string to URL path. Will remove duplicated "/" in front of the string
 * when URL path ends with a "/".
 *
 * @param url - Source URL string
 * @param name - String to be appended to URL
 * @returns An updated URL string
 */
export function appendToURLPath(url: string, name: string): string {
  const urlParsed = new URL(url);

  let path = urlParsed.pathname;
  path = path ? (path.endsWith("/") ? `${path}${name}` : `${path}/${name}`) : name;
  urlParsed.pathname = path;

  return urlParsed.toString();
}

/**
 * Append a string to URL query.
 *
 * @param url - Source URL string.
 * @param queryParts - String to be appended to the URL query.
 * @returns An updated URL string.
 */
export function appendToURLQuery(url: string, queryParts: string): string {
  const urlParsed = new URL(url);

  let query = urlParsed.search;
  if (query) {
    query += "&" + queryParts;
  } else {
    query = queryParts;
  }

  urlParsed.search = query;
  return urlParsed.toString();
}

/**
 * Set URL parameter name and value. If name exists in URL parameters, old value
 * will be replaced by name key. If not provide value, the parameter will be deleted.
 *
 * @param url - Source URL string
 * @param name - Parameter name
 * @param value - Parameter value
 * @returns An updated URL string
 */
export function setURLParameter(url: string, name: string, value?: string): string {
  const urlParsed = new URL(url);
  const encodedName = encodeURIComponent(name);
  const encodedValue = value ? encodeURIComponent(value) : undefined;
  // mutating searchParams will change the encoding, so we have to do this ourselves
  const searchString = urlParsed.search === "" ? "?" : urlParsed.search;

  const searchPieces: string[] = [];

  for (const pair of searchString.slice(1).split("&")) {
    if (pair) {
      const [key] = pair.split("=", 2);
      if (key !== encodedName) {
        searchPieces.push(pair);
      }
    }
  }
  if (encodedValue) {
    searchPieces.push(`${encodedName}=${encodedValue}`);
  }

  urlParsed.search = searchPieces.length ? `?${searchPieces.join("&")}` : "";

  return urlParsed.toString();
}

/**
 * Get URL parameter by name.
 *
 * @param url -
 * @param name -
 */
export function getURLParameter(url: string, name: string): string | string[] | undefined {
  const urlParsed = new URL(url);
  return urlParsed.searchParams.get(name) ?? undefined;
}

/**
 * Set URL host.
 *
 * @param url - Source URL string
 * @param host - New host string
 * @returns An updated URL string
 */
export function setURLHost(url: string, host: string): string {
  const urlParsed = new URL(url);
  urlParsed.hostname = host;
  return urlParsed.toString();
}

/**
 * Get URL path from an URL string.
 *
 * @param url - Source URL string
 */
export function getURLPath(url: string): string | undefined {
  try {
    const urlParsed = new URL(url);
    return urlParsed.pathname;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get URL query key value pairs from an URL string.
 *
 * @param url -
 */
export function getURLQueries(url: string): { [key: string]: string } {
  let queryString = new URL(url).search;
  if (!queryString) {
    return {};
  }

  queryString = queryString.trim();
  queryString = queryString.startsWith("?") ? queryString.substring(1) : queryString;

  let querySubStrings: string[] = queryString.split("&");
  querySubStrings = querySubStrings.filter((value: string) => {
    const indexOfEqual = value.indexOf("=");
    const lastIndexOfEqual = value.lastIndexOf("=");
    return (
      indexOfEqual > 0 && indexOfEqual === lastIndexOfEqual && lastIndexOfEqual < value.length - 1
    );
  });

  const queries: { [key: string]: string } = {};
  for (const querySubString of querySubStrings) {
    const splitResults = querySubString.split("=");
    const key: string = splitResults[0];
    const value: string = splitResults[1];
    queries[key] = value;
  }

  return queries;
}

/**
 * Rounds a date off to seconds.
 *
 * @param date -
 * @param withMilliseconds - If true, YYYY-MM-DDThh:mm:ss.fffffffZ will be returned;
 *                                          If false, YYYY-MM-DDThh:mm:ssZ will be returned.
 * @returns Date string in ISO8061 format, with or without 7 milliseconds component
 */
export function truncatedISO8061Date(date: Date, withMilliseconds: boolean = true): string {
  // Date.toISOString() will return like "2018-10-29T06:34:36.139Z"
  const dateString = date.toISOString();

  return withMilliseconds
    ? dateString.substring(0, dateString.length - 1) + "0000" + "Z"
    : dateString.substring(0, dateString.length - 5) + "Z";
}

/**
 * Base64 encode.
 *
 * @param content -
 */
export function base64encode(content: string): string {
  return !isNodeLike ? btoa(content) : Buffer.from(content).toString("base64");
}

/**
 * Base64 decode.
 *
 * @param encodedString -
 */
export function base64decode(encodedString: string): string {
  return !isNodeLike ? atob(encodedString) : Buffer.from(encodedString, "base64").toString();
}

/**
 * Delay specified time interval.
 *
 * @param timeInMs -
 * @param aborter -
 * @param abortError -
 */
export async function delay(
  timeInMs: number,
  aborter?: AbortSignalLike,
  abortError?: Error,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    /* eslint-disable-next-line prefer-const */
    let timeout: any;

    const abortHandler = (): void => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
      reject(abortError);
    };

    const resolveHandler = (): void => {
      if (aborter !== undefined) {
        aborter.removeEventListener("abort", abortHandler);
      }
      resolve();
    };

    timeout = setTimeout(resolveHandler, timeInMs);
    if (aborter !== undefined) {
      aborter.addEventListener("abort", abortHandler);
    }
  });
}

export function sanitizeURL(url: string): string {
  let safeURL: string = url;
  if (getURLParameter(safeURL, URLConstants.Parameters.SIGNATURE)) {
    safeURL = setURLParameter(safeURL, URLConstants.Parameters.SIGNATURE, "*****");
  }

  return safeURL;
}

export function sanitizeHeaders(originalHeader: HttpHeaders): HttpHeaders {
  const headers: HttpHeaders = createHttpHeaders();
  for (const [name, value] of originalHeader) {
    if (name.toLowerCase() === HeaderConstants.AUTHORIZATION.toLowerCase()) {
      headers.set(name, "*****");
    } else if (name.toLowerCase() === HeaderConstants.X_MS_COPY_SOURCE) {
      headers.set(name, sanitizeURL(value));
    } else {
      headers.set(name, value);
    }
  }

  return headers;
}

/**
 * Extracts account name from the url
 * @param url - url to extract the account name from
 * @returns with the account name
 */
export function getAccountNameFromUrl(url: string): string {
  const parsedUrl = new URL(url);
  let accountName;
  try {
    if (parsedUrl.hostname.split(".")[1] === "file") {
      // `${defaultEndpointsProtocol}://${accountName}.file.${endpointSuffix}`;
      // Slicing off '/' at the end if exists
      url = url.endsWith("/") ? url.slice(0, -1) : url;

      accountName = parsedUrl.hostname.split(".")[0];
    } else if (isIpEndpointStyle(parsedUrl)) {
      // IPv4/IPv6 address hosts... Example - http://192.0.0.10:10001/devstoreaccount1/
      // Single word domain without a [dot] in the endpoint... Example - http://localhost:10001/devstoreaccount1/
      // .getPath() -> /devstoreaccount1/
      accountName = parsedUrl.pathname.split("/")[1];
    } else {
      // Custom domain case: "https://customdomain.com/containername/blob".
      accountName = "";
    }
    return accountName;
  } catch (error: any) {
    throw new Error("Unable to extract accountName with provided information.");
  }
}

export function isIpEndpointStyle(parsedUrl: URL): boolean {
  const host = parsedUrl.host;

  // Case 1: Ipv6, use a broad regex to find out candidates whose host contains two ':'.
  // Case 2: localhost(:port) or host.docker.internal, use broad regex to match port part.
  // Case 3: Ipv4, use broad regex which just check if host contains Ipv4.
  // For valid host please refer to https://man7.org/linux/man-pages/man7/hostname.7.html.
  return (
    /^.*:.*:.*$|^(localhost|host.docker.internal)(:[0-9]+)?$|^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}(:[0-9]+)?$/.test(
      host,
    ) ||
    (Boolean(parsedUrl.port) && PathStylePorts.includes(parsedUrl.port))
  );
}

export function getShareNameAndPathFromUrl(url: string): {
  baseName: string;
  shareName: string;
  path: string;
} {
  //  URL may look like the following
  // "https://myaccount.file.core.windows.net/myshare/mydirectory/file?sasString";
  // "https://myaccount.file.core.windows.net/myshare/mydirectory/file";
  // "https://myaccount.file.core.windows.net/myshare/mydirectory?sasString";
  // "https://myaccount.file.core.windows.net/myshare/mydirectory";
  // "https://myaccount.file.core.windows.net/myshare?sasString";
  // "https://myaccount.file.core.windows.net/myshare";
  // IPv4/IPv6 address hosts, Endpoints - `http://187.24.0.1:1000/devstoreaccount1/mydirectory/file`
  // http://localhost:1000/devstoreaccount1/mydirectory/file
  // mydirectory can consist of multiple directories - dir1/dir2/dir3

  let shareName;
  let path;
  let baseName;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.split(".")[1] === "file") {
      // "https://myaccount.file.core.windows.net/myshare/mydirectory/file";
      // .getPath() -> /myshare/mydirectory/file
      const pathComponents = parsedUrl.pathname.match("/([^/]*)(/(.*))?");
      shareName = pathComponents![1];
      path = pathComponents![3];
    } else if (isIpEndpointStyle(parsedUrl)) {
      // IPv4/IPv6 address hosts... Example - http://187.24.0.1:1000/devstoreaccount1/mydirectory/file
      // Single word domain without a [dot] in the endpoint... Example - http://localhost:1000/devstoreaccount1/mydirectory/file
      // .getPath() -> /devstoreaccount1/mydirectory/file
      const pathComponents = parsedUrl.pathname.match("/([^/]*)/([^/]*)(/(.*))?");
      shareName = pathComponents![2];
      path = pathComponents![4];
    } else {
      // "https://customdomain.com/myshare/mydirectory/file";
      // .getPath() -> /myshare/mydirectory/file
      const pathComponents = parsedUrl.pathname.match("/([^/]*)(/(.*))?");
      shareName = pathComponents![1];
      path = pathComponents![3];
    }

    // decode the encoded shareName and filePath - to get all the special characters that might be present in it
    shareName = decodeURIComponent(shareName);
    path = decodeURIComponent(path);

    // Cast to string is required as TypeScript cannot infer that split() always returns
    // an array with length >= 1
    baseName = path.split("/").pop() as string;

    if (!shareName) {
      throw new Error("Provided shareName is invalid.");
    } else {
      return { baseName, shareName, path };
    }
  } catch (error: any) {
    throw new Error(
      "Unable to extract shareName and filePath/directoryPath with provided information.",
    );
  }
}

export function httpAuthorizationToString(
  httpAuthorization?: HttpAuthorization,
): string | undefined {
  return httpAuthorization ? httpAuthorization.scheme + " " + httpAuthorization.value : undefined;
}

/**
 * Set URL path.
 *
 * @param url - URL to change path to.
 * @param path - Path to set into the URL.
 */
export function setURLPath(url: string, path: string): string {
  const urlParsed = new URL(url);
  urlParsed.pathname = path;
  return urlParsed.toString();
}

/**
 * Set URL query string.
 *
 * @param url - URL to set query string to.
 * @param queryString - Query string to set to the URL.
 */
export function setURLQueries(url: string, queryString: string): string {
  const urlParsed = new URL(url);
  urlParsed.search = queryString;
  return urlParsed.toString();
}

/**
 * Escape the file or directory name but keep path separator ('/').
 */
export function EscapePath(pathName: string): string {
  const split = pathName.split("/");
  for (let i = 0; i < split.length; i++) {
    split[i] = encodeURIComponent(split[i]);
  }
  return split.join("/");
}

/**
 * A representation of an HTTP response that
 * includes a reference to the request that
 * originated it.
 */
export interface HttpResponse {
  /**
   * The headers from the response.
   */
  headers: HttpHeadersLike;
  /**
   * The original request that resulted in this response.
   */
  request: WebResourceLike;
  /**
   * The HTTP status code returned from the service.
   */
  status: number;
}

/**
 * An object with a _response property that has
 * headers already parsed into a typed object.
 */
export interface ResponseWithHeaders<Headers> {
  /**
   * The underlying HTTP response.
   */
  _response: HttpResponse & {
    /**
     * The parsed HTTP response headers.
     */
    parsedHeaders: Headers;
  };
}

/**
 * An object with a _response property that has body
 * and headers already parsed into known types.
 */
export interface ResponseWithBody<Headers, Body> {
  /**
   * The underlying HTTP response.
   */
  _response: HttpResponse & {
    /**
     * The parsed HTTP response headers.
     */
    parsedHeaders: Headers;
    /**
     * The response body as text (string format)
     */
    bodyAsText: string;
    /**
     * The response body as parsed JSON or XML
     */
    parsedBody: Body;
  };
}

/**
 * An object with a simple _response property.
 */
export interface ResponseLike {
  /**
   * The underlying HTTP response.
   */
  _response: HttpResponse;
}

/**
 * A type that represents an operation result with a known _response property.
 */
export type WithResponse<T, Headers = undefined, Body = undefined> = T &
  (Body extends object
    ? ResponseWithBody<Headers, Body>
    : Headers extends object
      ? ResponseWithHeaders<Headers>
      : ResponseLike);

/**
 * A typesafe helper for ensuring that a given response object has
 * the original _response attached.
 * @param response - A response object from calling a client operation
 * @returns The same object, but with known _response property
 */
export function assertResponse<T extends object, Headers = undefined, Body = undefined>(
  response: T,
): WithResponse<T, Headers, Body> {
  if (`_response` in response) {
    return response as WithResponse<T, Headers, Body>;
  }

  throw new TypeError(`Unexpected response object ${response}`);
}

export function StringEncodedToString(name: StringEncoded): string {
  if (name.encoded) {
    return decodeURIComponent(name.content!);
  } else {
    return name.content!;
  }
}

export function ConvertInternalResponseOfListFiles(
  internalResponse: ListFilesAndDirectoriesSegmentResponseInternal,
): ListFilesAndDirectoriesSegmentResponse {
  const wrappedResponse = {
    ...internalResponse,
    prefix: undefined,
    directoryPath: StringEncodedToString({
      encoded: internalResponse.encoded,
      content: internalResponse.directoryPath,
    }),
    segment: {
      fileItems: internalResponse.segment.fileItems.map((fileItemInternal) => {
        const fileItem: FileItem = {
          ...fileItemInternal,
          name: StringEncodedToString(fileItemInternal.name),
        };
        return fileItem;
      }),
      directoryItems: internalResponse.segment.directoryItems.map((directoryItemInternal) => {
        const directoryItem: DirectoryItem = {
          ...directoryItemInternal,
          name: StringEncodedToString(directoryItemInternal.name),
        };
        return directoryItem;
      }),
    },
  };

  delete wrappedResponse.encoded;

  const listResponse: ListFilesAndDirectoriesSegmentResponse = wrappedResponse as any;

  if (internalResponse.prefix) {
    listResponse.prefix = StringEncodedToString(internalResponse.prefix);
  }

  return listResponse;
}

export function ConvertInternalResponseOfListHandles(
  internalResponse: ListHandlesResponseInternal,
): ListHandlesResponse {
  const wrappedResponse: ListHandlesResponse = {
    ...internalResponse,
    handleList: internalResponse.handleList
      ? internalResponse.handleList.map((handleItemInternal) => {
          const handleItem: HandleItem = {
            ...handleItemInternal,
            path: StringEncodedToString(handleItemInternal.path),
          };
          return handleItem;
        })
      : undefined,
  };

  return wrappedResponse;
}

/**
 * A small helper to handle converting an empty string "" into undefined
 * This is used in the case of query parameters (like continuation token) where
 * we don't want to send an empty query parameter to the service since the signing
 * policy for shared key will fail.
 * @internal
 */
export function removeEmptyString(value: string | undefined): string | undefined {
  return value ? value : undefined;
}

export function asSharePermission(value: string | SharePermission): SharePermission {
  const castSharePermission = value as SharePermission;
  if (castSharePermission["permission"] !== undefined) {
    return {
      permission: castSharePermission.permission,
      format: castSharePermission.format,
    };
  }

  return {
    permission: value as string,
  };
}

/**
 * Parse 4-digit octal string representation of a File Mode to a {@link NfsFileMode} structure.
 */
export function parseOctalFileMode(input?: string): NfsFileMode | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (input?.length !== 4) {
    throw new Error("Invalid format of input string");
  }

  const nfsFileMode: NfsFileMode = {
    owner: parseOctalRolePermissions(input[1]),
    group: parseOctalRolePermissions(input[2]),
    other: parseOctalRolePermissions(input[3]),
    effectiveUserIdentity: false,
    effectiveGroupIdentity: false,
    stickyBit: false,
  };

  const value: number = Number.parseInt(input[0]);

  if ((value & 4) > 0) {
    nfsFileMode.effectiveUserIdentity = true;
  }

  if ((value & 2) > 0) {
    nfsFileMode.effectiveGroupIdentity = true;
  }

  if ((value & 1) > 0) {
    nfsFileMode.stickyBit = true;
  }

  return nfsFileMode;
}

/**
 * Convert {@link NfsFileMode} structure to a 4-digit octal string represenation.
 */
export function toOctalFileMode(input?: NfsFileMode): string | undefined {
  if (input === undefined) return undefined;

  let higherOrderDigit = 0;
  if (input?.effectiveUserIdentity) {
    higherOrderDigit |= 4;
  }

  if (input?.effectiveGroupIdentity) {
    higherOrderDigit |= 2;
  }

  if (input?.stickyBit) {
    higherOrderDigit |= 1;
  }

  let stringFileMode = higherOrderDigit.toString();
  stringFileMode += toOctalRolePermissions(input!.owner);
  stringFileMode += toOctalRolePermissions(input!.group);
  stringFileMode += toOctalRolePermissions(input!.other);

  return stringFileMode;
}

/**
 * Convert a {@link NfsFileMode} to a string in symbolic notation.
 */
export function toSymbolicFileMode(input?: NfsFileMode): string | undefined {
  if (input === undefined) return undefined;
  let ownerPermissions = toSymbolicRolePermissions(input.owner);
  let groupPermissions = toSymbolicRolePermissions(input.group);
  let otherPermissions = toSymbolicRolePermissions(input.other);

  if (input.effectiveUserIdentity) {
    if (ownerPermissions[2] === "x") {
      ownerPermissions = ownerPermissions.substring(0, 2) + "s";
    } else {
      ownerPermissions = ownerPermissions.substring(0, 2) + "S";
    }
  }

  if (input.effectiveGroupIdentity) {
    if (groupPermissions[2] === "x") {
      groupPermissions = groupPermissions.substring(0, 2) + "s";
    } else {
      groupPermissions = groupPermissions.substring(0, 2) + "S";
    }
  }

  if (input.stickyBit) {
    if (otherPermissions[2] === "x") {
      otherPermissions = otherPermissions.substring(0, 2) + "t";
    } else {
      otherPermissions = otherPermissions.substring(0, 2) + "T";
    }
  }
  return ownerPermissions + groupPermissions + otherPermissions;
}

/**
 * Parse a 9-character symbolic string representation of a File Mode to a {@link NfsFileMode} structure.
 */
export function parseSymbolicFileMode(input?: string): NfsFileMode | undefined {
  if (input === undefined) return undefined;

  if (input?.length !== 9) {
    throw new Error("Invalid format of input string");
  }
  const ownerPermissions = parseSymbolicRolePermissions(input.substring(0, 3));
  const groupPermissions = parseSymbolicRolePermissions(input.substring(3, 6));
  const otherPermissions = parseSymbolicRolePermissions(input.substring(6, 9));
  const nfsFileMode: NfsFileMode = {
    owner: ownerPermissions.rolePermissions,
    group: groupPermissions.rolePermissions,
    other: otherPermissions.rolePermissions,
    effectiveUserIdentity: ownerPermissions.setSticky,
    effectiveGroupIdentity: groupPermissions.setSticky,
    stickyBit: otherPermissions.setSticky,
  };

  return nfsFileMode;
}

export function parseOctalRolePermissions(c: string): PosixRolePermissions {
  const rolePermissions: PosixRolePermissions = {
    read: false,
    write: false,
    execute: false,
  };

  const value = Number.parseInt(c);

  if (value < 0 || value > 7) {
    throw new Error("MustBeBetweenInclusive");
  }

  if ((value & 4) > 0) {
    rolePermissions.read = true;
  }

  if ((value & 2) > 0) {
    rolePermissions.write = true;
  }

  if ((value & 1) > 0) {
    rolePermissions.execute = true;
  }

  return rolePermissions;
}

export function toOctalRolePermissions(rolePermissions: PosixRolePermissions): string {
  let result = 0;
  if (rolePermissions.read === true) {
    result |= 4;
  }

  if (rolePermissions.write === true) {
    result |= 2;
  }

  if (rolePermissions.execute === true) {
    result |= 1;
  }

  return result.toString();
}

export function toSymbolicRolePermissions(rolePermissions: PosixRolePermissions): string {
  let symbolicRolePermissions = "";

  if (rolePermissions.read === true) {
    symbolicRolePermissions += "r";
  } else {
    symbolicRolePermissions += "-";
  }

  if (rolePermissions.write === true) {
    symbolicRolePermissions += "w";
  } else {
    symbolicRolePermissions += "-";
  }

  if (rolePermissions.execute === true) {
    symbolicRolePermissions += "x";
  } else {
    symbolicRolePermissions += "-";
  }
  return symbolicRolePermissions;
}

export function parseSymbolicRolePermissions(input: string): {
  rolePermissions: PosixRolePermissions;
  setSticky: boolean;
} {
  if (input.length !== 3) {
    throw new Error("input must be 3 characters long");
  }

  const rolePermissions: PosixRolePermissions = {
    read: false,
    write: false,
    execute: false,
  };

  let setSticky = false;

  // Read character
  if (input[0] === "r") {
    rolePermissions.read = true;
  } else if (input[0] !== "-") {
    throw new Error(`Invalid character in symbolic role permission: ${input[0]}`);
  }

  // Write character
  if (input[1] === "w") {
    rolePermissions.write = true;
  } else if (input[1] !== "-") {
    throw new Error(`Invalid character in symbolic role permission: ${input[1]}`);
  }

  // Execute character
  if (input[2] === "x" || input[2] === "s" || input[2] === "t") {
    rolePermissions.execute = true;
    if (input[2] === "s" || input[2] === "t") {
      setSticky = true;
    }
  }

  if (input[2] === "S" || input[2] === "T") {
    setSticky = true;
  }

  if (
    input[2] !== "x" &&
    input[2] !== "s" &&
    input[2] !== "S" &&
    input[2] !== "t" &&
    input[2] !== "T" &&
    input[2] !== "-"
  ) {
    throw new Error(`Invalid character in symbolic role permission: ${input[2]}`);
  }

  return {
    rolePermissions,
    setSticky,
  };
}
