/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { MsixPackages } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { DesktopVirtualizationAPIClient } from "../desktopVirtualizationAPIClient.js";
import {
  MsixPackage,
  MsixPackagesListNextOptionalParams,
  MsixPackagesListOptionalParams,
  MsixPackagesListResponse,
  MsixPackagesGetOptionalParams,
  MsixPackagesGetResponse,
  MsixPackagesCreateOrUpdateOptionalParams,
  MsixPackagesCreateOrUpdateResponse,
  MsixPackagesDeleteOptionalParams,
  MsixPackagesUpdateOptionalParams,
  MsixPackagesUpdateResponse,
  MsixPackagesListNextResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing MsixPackages operations. */
export class MsixPackagesImpl implements MsixPackages {
  private readonly client: DesktopVirtualizationAPIClient;

  /**
   * Initialize a new instance of the class MsixPackages class.
   * @param client Reference to the service client
   */
  constructor(client: DesktopVirtualizationAPIClient) {
    this.client = client;
  }

  /**
   * List MSIX packages in hostpool.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param hostPoolName The name of the host pool within the specified resource group
   * @param options The options parameters.
   */
  public list(
    resourceGroupName: string,
    hostPoolName: string,
    options?: MsixPackagesListOptionalParams,
  ): PagedAsyncIterableIterator<MsixPackage> {
    const iter = this.listPagingAll(resourceGroupName, hostPoolName, options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listPagingPage(
          resourceGroupName,
          hostPoolName,
          options,
          settings,
        );
      },
    };
  }

  private async *listPagingPage(
    resourceGroupName: string,
    hostPoolName: string,
    options?: MsixPackagesListOptionalParams,
    settings?: PageSettings,
  ): AsyncIterableIterator<MsixPackage[]> {
    let result: MsixPackagesListResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._list(resourceGroupName, hostPoolName, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listNext(
        resourceGroupName,
        hostPoolName,
        continuationToken,
        options,
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listPagingAll(
    resourceGroupName: string,
    hostPoolName: string,
    options?: MsixPackagesListOptionalParams,
  ): AsyncIterableIterator<MsixPackage> {
    for await (const page of this.listPagingPage(
      resourceGroupName,
      hostPoolName,
      options,
    )) {
      yield* page;
    }
  }

  /**
   * Get a msixpackage.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param hostPoolName The name of the host pool within the specified resource group
   * @param msixPackageFullName The version specific package full name of the MSIX package within
   *                            specified hostpool
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    hostPoolName: string,
    msixPackageFullName: string,
    options?: MsixPackagesGetOptionalParams,
  ): Promise<MsixPackagesGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, hostPoolName, msixPackageFullName, options },
      getOperationSpec,
    );
  }

  /**
   * Create or update a MSIX package.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param hostPoolName The name of the host pool within the specified resource group
   * @param msixPackageFullName The version specific package full name of the MSIX package within
   *                            specified hostpool
   * @param msixPackage Object containing  MSIX Package definitions.
   * @param options The options parameters.
   */
  createOrUpdate(
    resourceGroupName: string,
    hostPoolName: string,
    msixPackageFullName: string,
    msixPackage: MsixPackage,
    options?: MsixPackagesCreateOrUpdateOptionalParams,
  ): Promise<MsixPackagesCreateOrUpdateResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        hostPoolName,
        msixPackageFullName,
        msixPackage,
        options,
      },
      createOrUpdateOperationSpec,
    );
  }

  /**
   * Remove an MSIX Package.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param hostPoolName The name of the host pool within the specified resource group
   * @param msixPackageFullName The version specific package full name of the MSIX package within
   *                            specified hostpool
   * @param options The options parameters.
   */
  delete(
    resourceGroupName: string,
    hostPoolName: string,
    msixPackageFullName: string,
    options?: MsixPackagesDeleteOptionalParams,
  ): Promise<void> {
    return this.client.sendOperationRequest(
      { resourceGroupName, hostPoolName, msixPackageFullName, options },
      deleteOperationSpec,
    );
  }

  /**
   * Update an  MSIX Package.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param hostPoolName The name of the host pool within the specified resource group
   * @param msixPackageFullName The version specific package full name of the MSIX package within
   *                            specified hostpool
   * @param options The options parameters.
   */
  update(
    resourceGroupName: string,
    hostPoolName: string,
    msixPackageFullName: string,
    options?: MsixPackagesUpdateOptionalParams,
  ): Promise<MsixPackagesUpdateResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, hostPoolName, msixPackageFullName, options },
      updateOperationSpec,
    );
  }

  /**
   * List MSIX packages in hostpool.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param hostPoolName The name of the host pool within the specified resource group
   * @param options The options parameters.
   */
  private _list(
    resourceGroupName: string,
    hostPoolName: string,
    options?: MsixPackagesListOptionalParams,
  ): Promise<MsixPackagesListResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, hostPoolName, options },
      listOperationSpec,
    );
  }

  /**
   * ListNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param hostPoolName The name of the host pool within the specified resource group
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    resourceGroupName: string,
    hostPoolName: string,
    nextLink: string,
    options?: MsixPackagesListNextOptionalParams,
  ): Promise<MsixPackagesListNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, hostPoolName, nextLink, options },
      listNextOperationSpec,
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.DesktopVirtualization/hostPools/{hostPoolName}/msixPackages/{msixPackageFullName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.MsixPackage,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.hostPoolName,
    Parameters.msixPackageFullName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const createOrUpdateOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.DesktopVirtualization/hostPools/{hostPoolName}/msixPackages/{msixPackageFullName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.MsixPackage,
    },
    201: {
      bodyMapper: Mappers.MsixPackage,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  requestBody: Parameters.msixPackage,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.hostPoolName,
    Parameters.msixPackageFullName,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.DesktopVirtualization/hostPools/{hostPoolName}/msixPackages/{msixPackageFullName}",
  httpMethod: "DELETE",
  responses: {
    200: {},
    204: {},
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.hostPoolName,
    Parameters.msixPackageFullName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const updateOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.DesktopVirtualization/hostPools/{hostPoolName}/msixPackages/{msixPackageFullName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.MsixPackage,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  requestBody: Parameters.msixPackage1,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.hostPoolName,
    Parameters.msixPackageFullName,
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer,
};
const listOperationSpec: coreClient.OperationSpec = {
  path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.DesktopVirtualization/hostPools/{hostPoolName}/msixPackages",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.MsixPackageList,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  queryParameters: [
    Parameters.apiVersion,
    Parameters.pageSize,
    Parameters.isDescending,
    Parameters.initialSkip,
  ],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.hostPoolName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.MsixPackageList,
    },
    default: {
      bodyMapper: Mappers.CloudError,
    },
  },
  urlParameters: [
    Parameters.$host,
    Parameters.nextLink,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.hostPoolName,
  ],
  headerParameters: [Parameters.accept],
  serializer,
};
