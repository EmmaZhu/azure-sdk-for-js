/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { SipRouting } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { SipRoutingClientContext } from "../sipRoutingClientContext";
import {
  SipRoutingGetOptionalParams,
  SipRoutingGetResponse,
  SipRoutingUpdateOptionalParams,
  SipRoutingUpdateResponse
} from "../models";

/** Class containing SipRouting operations. */
export class SipRoutingImpl implements SipRouting {
  private readonly client: SipRoutingClientContext;

  /**
   * Initialize a new instance of the class SipRouting class.
   * @param client Reference to the service client
   */
  constructor(client: SipRoutingClientContext) {
    this.client = client;
  }

  /**
   * Gets SIP configuration for resource.
   * @param options The options parameters.
   */
  get(options?: SipRoutingGetOptionalParams): Promise<SipRoutingGetResponse> {
    return this.client.sendOperationRequest({ options }, getOperationSpec);
  }

  /**
   * Updates SIP configuration for resource.
   * @param options The options parameters.
   */
  update(
    options?: SipRoutingUpdateOptionalParams
  ): Promise<SipRoutingUpdateResponse> {
    return this.client.sendOperationRequest({ options }, updateOperationSpec);
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path: "/sip",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.SipConfiguration
    },
    default: {
      bodyMapper: Mappers.CommunicationErrorResponse,
      headersMapper: Mappers.SipRoutingGetExceptionHeaders
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.endpoint],
  headerParameters: [Parameters.accept],
  serializer
};
const updateOperationSpec: coreClient.OperationSpec = {
  path: "/sip",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.SipConfiguration
    },
    default: {
      bodyMapper: Mappers.CommunicationErrorResponse,
      headersMapper: Mappers.SipRoutingUpdateExceptionHeaders
    }
  },
  requestBody: {
    parameterPath: {
      trunks: ["options", "trunks"],
      routes: ["options", "routes"]
    },
    mapper: Mappers.SipConfigurationUpdate
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.endpoint],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};