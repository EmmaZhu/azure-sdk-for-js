/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper.js";
import { RoleAssignments } from "../operationsInterfaces/index.js";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers.js";
import * as Parameters from "../models/parameters.js";
import { AuthorizationManagementClient } from "../authorizationManagementClient.js";
import {
  RoleAssignment,
  RoleAssignmentsListForSubscriptionNextOptionalParams,
  RoleAssignmentsListForSubscriptionOptionalParams,
  RoleAssignmentsListForSubscriptionResponse,
  RoleAssignmentsListForResourceGroupNextOptionalParams,
  RoleAssignmentsListForResourceGroupOptionalParams,
  RoleAssignmentsListForResourceGroupResponse,
  RoleAssignmentsListForResourceNextOptionalParams,
  RoleAssignmentsListForResourceOptionalParams,
  RoleAssignmentsListForResourceResponse,
  RoleAssignmentsListForScopeNextOptionalParams,
  RoleAssignmentsListForScopeOptionalParams,
  RoleAssignmentsListForScopeResponse,
  RoleAssignmentsGetOptionalParams,
  RoleAssignmentsGetResponse,
  RoleAssignmentCreateParameters,
  RoleAssignmentsCreateOptionalParams,
  RoleAssignmentsCreateResponse,
  RoleAssignmentsDeleteOptionalParams,
  RoleAssignmentsDeleteResponse,
  RoleAssignmentsGetByIdOptionalParams,
  RoleAssignmentsGetByIdResponse,
  RoleAssignmentsCreateByIdOptionalParams,
  RoleAssignmentsCreateByIdResponse,
  RoleAssignmentsDeleteByIdOptionalParams,
  RoleAssignmentsDeleteByIdResponse,
  RoleAssignmentsListForSubscriptionNextResponse,
  RoleAssignmentsListForResourceGroupNextResponse,
  RoleAssignmentsListForResourceNextResponse,
  RoleAssignmentsListForScopeNextResponse
} from "../models/index.js";

/// <reference lib="esnext.asynciterable" />
/** Class containing RoleAssignments operations. */
export class RoleAssignmentsImpl implements RoleAssignments {
  private readonly client: AuthorizationManagementClient;

  /**
   * Initialize a new instance of the class RoleAssignments class.
   * @param client Reference to the service client
   */
  constructor(client: AuthorizationManagementClient) {
    this.client = client;
  }

  /**
   * List all role assignments that apply to a subscription.
   * @param options The options parameters.
   */
  public listForSubscription(
    options?: RoleAssignmentsListForSubscriptionOptionalParams
  ): PagedAsyncIterableIterator<RoleAssignment> {
    const iter = this.listForSubscriptionPagingAll(options);
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
        return this.listForSubscriptionPagingPage(options, settings);
      }
    };
  }

  private async *listForSubscriptionPagingPage(
    options?: RoleAssignmentsListForSubscriptionOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<RoleAssignment[]> {
    let result: RoleAssignmentsListForSubscriptionResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listForSubscription(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listForSubscriptionNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listForSubscriptionPagingAll(
    options?: RoleAssignmentsListForSubscriptionOptionalParams
  ): AsyncIterableIterator<RoleAssignment> {
    for await (const page of this.listForSubscriptionPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * List all role assignments that apply to a resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  public listForResourceGroup(
    resourceGroupName: string,
    options?: RoleAssignmentsListForResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<RoleAssignment> {
    const iter = this.listForResourceGroupPagingAll(resourceGroupName, options);
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
        return this.listForResourceGroupPagingPage(
          resourceGroupName,
          options,
          settings
        );
      }
    };
  }

  private async *listForResourceGroupPagingPage(
    resourceGroupName: string,
    options?: RoleAssignmentsListForResourceGroupOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<RoleAssignment[]> {
    let result: RoleAssignmentsListForResourceGroupResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listForResourceGroup(resourceGroupName, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listForResourceGroupNext(
        resourceGroupName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listForResourceGroupPagingAll(
    resourceGroupName: string,
    options?: RoleAssignmentsListForResourceGroupOptionalParams
  ): AsyncIterableIterator<RoleAssignment> {
    for await (const page of this.listForResourceGroupPagingPage(
      resourceGroupName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * List all role assignments that apply to a resource.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceProviderNamespace The namespace of the resource provider.
   * @param resourceType The resource type name. For example the type name of a web app is 'sites' (from
   *                     Microsoft.Web/sites).
   * @param resourceName The resource name.
   * @param options The options parameters.
   */
  public listForResource(
    resourceGroupName: string,
    resourceProviderNamespace: string,
    resourceType: string,
    resourceName: string,
    options?: RoleAssignmentsListForResourceOptionalParams
  ): PagedAsyncIterableIterator<RoleAssignment> {
    const iter = this.listForResourcePagingAll(
      resourceGroupName,
      resourceProviderNamespace,
      resourceType,
      resourceName,
      options
    );
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
        return this.listForResourcePagingPage(
          resourceGroupName,
          resourceProviderNamespace,
          resourceType,
          resourceName,
          options,
          settings
        );
      }
    };
  }

  private async *listForResourcePagingPage(
    resourceGroupName: string,
    resourceProviderNamespace: string,
    resourceType: string,
    resourceName: string,
    options?: RoleAssignmentsListForResourceOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<RoleAssignment[]> {
    let result: RoleAssignmentsListForResourceResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listForResource(
        resourceGroupName,
        resourceProviderNamespace,
        resourceType,
        resourceName,
        options
      );
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listForResourceNext(
        resourceGroupName,
        resourceProviderNamespace,
        resourceType,
        resourceName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listForResourcePagingAll(
    resourceGroupName: string,
    resourceProviderNamespace: string,
    resourceType: string,
    resourceName: string,
    options?: RoleAssignmentsListForResourceOptionalParams
  ): AsyncIterableIterator<RoleAssignment> {
    for await (const page of this.listForResourcePagingPage(
      resourceGroupName,
      resourceProviderNamespace,
      resourceType,
      resourceName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * List all role assignments that apply to a scope.
   * @param scope The scope of the operation or resource. Valid scopes are: subscription (format:
   *              '/subscriptions/{subscriptionId}'), resource group (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}', or resource (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}'
   * @param options The options parameters.
   */
  public listForScope(
    scope: string,
    options?: RoleAssignmentsListForScopeOptionalParams
  ): PagedAsyncIterableIterator<RoleAssignment> {
    const iter = this.listForScopePagingAll(scope, options);
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
        return this.listForScopePagingPage(scope, options, settings);
      }
    };
  }

  private async *listForScopePagingPage(
    scope: string,
    options?: RoleAssignmentsListForScopeOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<RoleAssignment[]> {
    let result: RoleAssignmentsListForScopeResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listForScope(scope, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listForScopeNext(scope, continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listForScopePagingAll(
    scope: string,
    options?: RoleAssignmentsListForScopeOptionalParams
  ): AsyncIterableIterator<RoleAssignment> {
    for await (const page of this.listForScopePagingPage(scope, options)) {
      yield* page;
    }
  }

  /**
   * List all role assignments that apply to a subscription.
   * @param options The options parameters.
   */
  private _listForSubscription(
    options?: RoleAssignmentsListForSubscriptionOptionalParams
  ): Promise<RoleAssignmentsListForSubscriptionResponse> {
    return this.client.sendOperationRequest(
      { options },
      listForSubscriptionOperationSpec
    );
  }

  /**
   * List all role assignments that apply to a resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param options The options parameters.
   */
  private _listForResourceGroup(
    resourceGroupName: string,
    options?: RoleAssignmentsListForResourceGroupOptionalParams
  ): Promise<RoleAssignmentsListForResourceGroupResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listForResourceGroupOperationSpec
    );
  }

  /**
   * List all role assignments that apply to a resource.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceProviderNamespace The namespace of the resource provider.
   * @param resourceType The resource type name. For example the type name of a web app is 'sites' (from
   *                     Microsoft.Web/sites).
   * @param resourceName The resource name.
   * @param options The options parameters.
   */
  private _listForResource(
    resourceGroupName: string,
    resourceProviderNamespace: string,
    resourceType: string,
    resourceName: string,
    options?: RoleAssignmentsListForResourceOptionalParams
  ): Promise<RoleAssignmentsListForResourceResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        resourceProviderNamespace,
        resourceType,
        resourceName,
        options
      },
      listForResourceOperationSpec
    );
  }

  /**
   * Get a role assignment by scope and name.
   * @param scope The scope of the operation or resource. Valid scopes are: subscription (format:
   *              '/subscriptions/{subscriptionId}'), resource group (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}', or resource (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}'
   * @param roleAssignmentName The name of the role assignment. It can be any valid GUID.
   * @param options The options parameters.
   */
  get(
    scope: string,
    roleAssignmentName: string,
    options?: RoleAssignmentsGetOptionalParams
  ): Promise<RoleAssignmentsGetResponse> {
    return this.client.sendOperationRequest(
      { scope, roleAssignmentName, options },
      getOperationSpec
    );
  }

  /**
   * Create or update a role assignment by scope and name.
   * @param scope The scope of the operation or resource. Valid scopes are: subscription (format:
   *              '/subscriptions/{subscriptionId}'), resource group (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}', or resource (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}'
   * @param roleAssignmentName The name of the role assignment. It can be any valid GUID.
   * @param parameters Parameters for the role assignment.
   * @param options The options parameters.
   */
  create(
    scope: string,
    roleAssignmentName: string,
    parameters: RoleAssignmentCreateParameters,
    options?: RoleAssignmentsCreateOptionalParams
  ): Promise<RoleAssignmentsCreateResponse> {
    return this.client.sendOperationRequest(
      { scope, roleAssignmentName, parameters, options },
      createOperationSpec
    );
  }

  /**
   * Delete a role assignment by scope and name.
   * @param scope The scope of the operation or resource. Valid scopes are: subscription (format:
   *              '/subscriptions/{subscriptionId}'), resource group (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}', or resource (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}'
   * @param roleAssignmentName The name of the role assignment. It can be any valid GUID.
   * @param options The options parameters.
   */
  delete(
    scope: string,
    roleAssignmentName: string,
    options?: RoleAssignmentsDeleteOptionalParams
  ): Promise<RoleAssignmentsDeleteResponse> {
    return this.client.sendOperationRequest(
      { scope, roleAssignmentName, options },
      deleteOperationSpec
    );
  }

  /**
   * List all role assignments that apply to a scope.
   * @param scope The scope of the operation or resource. Valid scopes are: subscription (format:
   *              '/subscriptions/{subscriptionId}'), resource group (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}', or resource (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}'
   * @param options The options parameters.
   */
  private _listForScope(
    scope: string,
    options?: RoleAssignmentsListForScopeOptionalParams
  ): Promise<RoleAssignmentsListForScopeResponse> {
    return this.client.sendOperationRequest(
      { scope, options },
      listForScopeOperationSpec
    );
  }

  /**
   * Get a role assignment by ID.
   * @param roleAssignmentId The fully qualified ID of the role assignment including scope, resource
   *                         name, and resource type. Format:
   *                         /{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}. Example:
   *                         /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP>/providers/Microsoft.Authorization/roleAssignments/<ROLE_ASSIGNMENT_NAME>
   * @param options The options parameters.
   */
  getById(
    roleAssignmentId: string,
    options?: RoleAssignmentsGetByIdOptionalParams
  ): Promise<RoleAssignmentsGetByIdResponse> {
    return this.client.sendOperationRequest(
      { roleAssignmentId, options },
      getByIdOperationSpec
    );
  }

  /**
   * Create or update a role assignment by ID.
   * @param roleAssignmentId The fully qualified ID of the role assignment including scope, resource
   *                         name, and resource type. Format:
   *                         /{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}. Example:
   *                         /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP>/providers/Microsoft.Authorization/roleAssignments/<ROLE_ASSIGNMENT_NAME>
   * @param parameters Parameters for the role assignment.
   * @param options The options parameters.
   */
  createById(
    roleAssignmentId: string,
    parameters: RoleAssignmentCreateParameters,
    options?: RoleAssignmentsCreateByIdOptionalParams
  ): Promise<RoleAssignmentsCreateByIdResponse> {
    return this.client.sendOperationRequest(
      { roleAssignmentId, parameters, options },
      createByIdOperationSpec
    );
  }

  /**
   * Delete a role assignment by ID.
   * @param roleAssignmentId The fully qualified ID of the role assignment including scope, resource
   *                         name, and resource type. Format:
   *                         /{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}. Example:
   *                         /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP>/providers/Microsoft.Authorization/roleAssignments/<ROLE_ASSIGNMENT_NAME>
   * @param options The options parameters.
   */
  deleteById(
    roleAssignmentId: string,
    options?: RoleAssignmentsDeleteByIdOptionalParams
  ): Promise<RoleAssignmentsDeleteByIdResponse> {
    return this.client.sendOperationRequest(
      { roleAssignmentId, options },
      deleteByIdOperationSpec
    );
  }

  /**
   * ListForSubscriptionNext
   * @param nextLink The nextLink from the previous successful call to the ListForSubscription method.
   * @param options The options parameters.
   */
  private _listForSubscriptionNext(
    nextLink: string,
    options?: RoleAssignmentsListForSubscriptionNextOptionalParams
  ): Promise<RoleAssignmentsListForSubscriptionNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listForSubscriptionNextOperationSpec
    );
  }

  /**
   * ListForResourceGroupNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param nextLink The nextLink from the previous successful call to the ListForResourceGroup method.
   * @param options The options parameters.
   */
  private _listForResourceGroupNext(
    resourceGroupName: string,
    nextLink: string,
    options?: RoleAssignmentsListForResourceGroupNextOptionalParams
  ): Promise<RoleAssignmentsListForResourceGroupNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, nextLink, options },
      listForResourceGroupNextOperationSpec
    );
  }

  /**
   * ListForResourceNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param resourceProviderNamespace The namespace of the resource provider.
   * @param resourceType The resource type name. For example the type name of a web app is 'sites' (from
   *                     Microsoft.Web/sites).
   * @param resourceName The resource name.
   * @param nextLink The nextLink from the previous successful call to the ListForResource method.
   * @param options The options parameters.
   */
  private _listForResourceNext(
    resourceGroupName: string,
    resourceProviderNamespace: string,
    resourceType: string,
    resourceName: string,
    nextLink: string,
    options?: RoleAssignmentsListForResourceNextOptionalParams
  ): Promise<RoleAssignmentsListForResourceNextResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        resourceProviderNamespace,
        resourceType,
        resourceName,
        nextLink,
        options
      },
      listForResourceNextOperationSpec
    );
  }

  /**
   * ListForScopeNext
   * @param scope The scope of the operation or resource. Valid scopes are: subscription (format:
   *              '/subscriptions/{subscriptionId}'), resource group (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}', or resource (format:
   *              '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}'
   * @param nextLink The nextLink from the previous successful call to the ListForScope method.
   * @param options The options parameters.
   */
  private _listForScopeNext(
    scope: string,
    nextLink: string,
    options?: RoleAssignmentsListForScopeNextOptionalParams
  ): Promise<RoleAssignmentsListForScopeNextResponse> {
    return this.client.sendOperationRequest(
      { scope, nextLink, options },
      listForScopeNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listForSubscriptionOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleAssignments",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [
    Parameters.apiVersion1,
    Parameters.filter1,
    Parameters.tenantId
  ],
  urlParameters: [Parameters.$host, Parameters.subscriptionId],
  headerParameters: [Parameters.accept],
  serializer
};
const listForResourceGroupOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/roleAssignments",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [
    Parameters.apiVersion1,
    Parameters.filter1,
    Parameters.tenantId
  ],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listForResourceOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}/providers/Microsoft.Authorization/roleAssignments",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [
    Parameters.apiVersion1,
    Parameters.filter1,
    Parameters.tenantId
  ],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.resourceProviderNamespace,
    Parameters.resourceType,
    Parameters.resourceName1
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignment
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion1, Parameters.tenantId],
  urlParameters: [
    Parameters.$host,
    Parameters.scope,
    Parameters.roleAssignmentName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOperationSpec: coreClient.OperationSpec = {
  path:
    "/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignment
    },
    201: {
      bodyMapper: Mappers.RoleAssignment
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.parameters,
  queryParameters: [Parameters.apiVersion1],
  urlParameters: [
    Parameters.$host,
    Parameters.scope,
    Parameters.roleAssignmentName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}",
  httpMethod: "DELETE",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignment
    },
    204: {},
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion1, Parameters.tenantId],
  urlParameters: [
    Parameters.$host,
    Parameters.scope,
    Parameters.roleAssignmentName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listForScopeOperationSpec: coreClient.OperationSpec = {
  path: "/{scope}/providers/Microsoft.Authorization/roleAssignments",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [
    Parameters.apiVersion1,
    Parameters.filter1,
    Parameters.tenantId,
    Parameters.skipToken
  ],
  urlParameters: [Parameters.$host, Parameters.scope],
  headerParameters: [Parameters.accept],
  serializer
};
const getByIdOperationSpec: coreClient.OperationSpec = {
  path: "/{roleAssignmentId}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignment
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion1, Parameters.tenantId],
  urlParameters: [Parameters.$host, Parameters.roleAssignmentId],
  headerParameters: [Parameters.accept],
  serializer
};
const createByIdOperationSpec: coreClient.OperationSpec = {
  path: "/{roleAssignmentId}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignment
    },
    201: {
      bodyMapper: Mappers.RoleAssignment
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.parameters,
  queryParameters: [Parameters.apiVersion1],
  urlParameters: [Parameters.$host, Parameters.roleAssignmentId],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteByIdOperationSpec: coreClient.OperationSpec = {
  path: "/{roleAssignmentId}",
  httpMethod: "DELETE",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignment
    },
    204: {},
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion1, Parameters.tenantId],
  urlParameters: [Parameters.$host, Parameters.roleAssignmentId],
  headerParameters: [Parameters.accept],
  serializer
};
const listForSubscriptionNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listForResourceGroupNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.nextLink,
    Parameters.resourceGroupName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listForResourceNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.nextLink,
    Parameters.resourceGroupName,
    Parameters.resourceProviderNamespace,
    Parameters.resourceType,
    Parameters.resourceName1
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listForScopeNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.RoleAssignmentListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [Parameters.$host, Parameters.nextLink, Parameters.scope],
  headerParameters: [Parameters.accept],
  serializer
};
