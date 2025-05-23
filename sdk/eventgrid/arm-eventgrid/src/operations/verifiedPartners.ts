/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { VerifiedPartners } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { EventGridManagementClient } from "../eventGridManagementClient.js";
import {
  VerifiedPartner,
  VerifiedPartnersListNextOptionalParams,
  VerifiedPartnersListOptionalParams,
  VerifiedPartnersListResponse,
  VerifiedPartnersGetOptionalParams,
  VerifiedPartnersGetResponse,
  VerifiedPartnersListNextResponse,
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing VerifiedPartners operations. */
export class VerifiedPartnersImpl implements VerifiedPartners {
  private readonly client: EventGridManagementClient;

  /**
   * Initialize a new instance of the class VerifiedPartners class.
   * @param client Reference to the service client
   */
  constructor(client: EventGridManagementClient) {
    this.client = client;
  }

  /**
   * Get a list of all verified partners.
   * @param options The options parameters.
   */
  public list(
    options?: VerifiedPartnersListOptionalParams,
  ): PagedAsyncIterableIterator<VerifiedPartner> {
    const iter = this.listPagingAll(options);
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
        return this.listPagingPage(options, settings);
      },
    };
  }

  private async *listPagingPage(
    options?: VerifiedPartnersListOptionalParams,
    settings?: PageSettings,
  ): AsyncIterableIterator<VerifiedPartner[]> {
    let result: VerifiedPartnersListResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._list(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listPagingAll(
    options?: VerifiedPartnersListOptionalParams,
  ): AsyncIterableIterator<VerifiedPartner> {
    for await (const page of this.listPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Get properties of a verified partner.
   * @param verifiedPartnerName Name of the verified partner.
   * @param options The options parameters.
   */
  get(
    verifiedPartnerName: string,
    options?: VerifiedPartnersGetOptionalParams,
  ): Promise<VerifiedPartnersGetResponse> {
    return this.client.sendOperationRequest(
      { verifiedPartnerName, options },
      getOperationSpec,
    );
  }

  /**
   * Get a list of all verified partners.
   * @param options The options parameters.
   */
  private _list(
    options?: VerifiedPartnersListOptionalParams,
  ): Promise<VerifiedPartnersListResponse> {
    return this.client.sendOperationRequest({ options }, listOperationSpec);
  }

  /**
   * ListNext
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    nextLink: string,
    options?: VerifiedPartnersListNextOptionalParams,
  ): Promise<VerifiedPartnersListNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listNextOperationSpec,
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.EventGrid/verifiedPartners/{verifiedPartnerName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.VerifiedPartner,
    },
    default: {},
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.verifiedPartnerName],
  headerParameters: [Parameters.accept],
  serializer,
};
const listOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.EventGrid/verifiedPartners",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.VerifiedPartnersListResult,
    },
    default: {},
  },
  queryParameters: [Parameters.apiVersion, Parameters.filter, Parameters.top],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer,
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.VerifiedPartnersListResult,
    },
    default: {},
  },
  urlParameters: [Parameters.$host, Parameters.nextLink],
  headerParameters: [Parameters.accept],
  serializer,
};
