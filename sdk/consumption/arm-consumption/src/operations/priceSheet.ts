/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "@azure/ms-rest-js";
import * as Models from "../models";
import * as Mappers from "../models/priceSheetMappers";
import * as Parameters from "../models/parameters";
import { ConsumptionManagementClientContext } from "../consumptionManagementClientContext";

/** Class representing a PriceSheet. */
export class PriceSheet {
  private readonly client: ConsumptionManagementClientContext;

  /**
   * Create a PriceSheet.
   * @param {ConsumptionManagementClientContext} client Reference to the service client.
   */
  constructor(client: ConsumptionManagementClientContext) {
    this.client = client;
  }

  /**
   * Gets the price sheet for a scope by subscriptionId. Price sheet is available via this API only
   * for May 1, 2014 or later.
   * @param [options] The optional parameters
   * @returns Promise<Models.PriceSheetGetResponse>
   */
  get(options?: Models.PriceSheetGetOptionalParams): Promise<Models.PriceSheetGetResponse>;
  /**
   * @param callback The callback
   */
  get(callback: msRest.ServiceCallback<Models.PriceSheetResult>): void;
  /**
   * @param options The optional parameters
   * @param callback The callback
   */
  get(
    options: Models.PriceSheetGetOptionalParams,
    callback: msRest.ServiceCallback<Models.PriceSheetResult>
  ): void;
  get(
    options?: Models.PriceSheetGetOptionalParams | msRest.ServiceCallback<Models.PriceSheetResult>,
    callback?: msRest.ServiceCallback<Models.PriceSheetResult>
  ): Promise<Models.PriceSheetGetResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      getOperationSpec,
      callback
    ) as Promise<Models.PriceSheetGetResponse>;
  }

  /**
   * Get the price sheet for a scope by subscriptionId and billing period. Price sheet is available
   * via this API only for May 1, 2014 or later.
   * @param billingPeriodName Billing Period Name.
   * @param [options] The optional parameters
   * @returns Promise<Models.PriceSheetGetByBillingPeriodResponse>
   */
  getByBillingPeriod(
    billingPeriodName: string,
    options?: Models.PriceSheetGetByBillingPeriodOptionalParams
  ): Promise<Models.PriceSheetGetByBillingPeriodResponse>;
  /**
   * @param billingPeriodName Billing Period Name.
   * @param callback The callback
   */
  getByBillingPeriod(
    billingPeriodName: string,
    callback: msRest.ServiceCallback<Models.PriceSheetResult>
  ): void;
  /**
   * @param billingPeriodName Billing Period Name.
   * @param options The optional parameters
   * @param callback The callback
   */
  getByBillingPeriod(
    billingPeriodName: string,
    options: Models.PriceSheetGetByBillingPeriodOptionalParams,
    callback: msRest.ServiceCallback<Models.PriceSheetResult>
  ): void;
  getByBillingPeriod(
    billingPeriodName: string,
    options?:
      | Models.PriceSheetGetByBillingPeriodOptionalParams
      | msRest.ServiceCallback<Models.PriceSheetResult>,
    callback?: msRest.ServiceCallback<Models.PriceSheetResult>
  ): Promise<Models.PriceSheetGetByBillingPeriodResponse> {
    return this.client.sendOperationRequest(
      {
        billingPeriodName,
        options
      },
      getByBillingPeriodOperationSpec,
      callback
    ) as Promise<Models.PriceSheetGetByBillingPeriodResponse>;
  }
}

// Operation Specifications
const serializer = new msRest.Serializer(Mappers);
const getOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "subscriptions/{subscriptionId}/providers/Microsoft.Consumption/pricesheets/default",
  urlParameters: [Parameters.subscriptionId],
  queryParameters: [Parameters.expand, Parameters.skiptoken, Parameters.top, Parameters.apiVersion],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.PriceSheetResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const getByBillingPeriodOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path:
    "subscriptions/{subscriptionId}/providers/Microsoft.Billing/billingPeriods/{billingPeriodName}/providers/Microsoft.Consumption/pricesheets/default",
  urlParameters: [Parameters.subscriptionId, Parameters.billingPeriodName],
  queryParameters: [Parameters.expand, Parameters.skiptoken, Parameters.top, Parameters.apiVersion],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.PriceSheetResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};
