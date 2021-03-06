/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { BaseResource, CloudError, AzureServiceClientOptions } from "@azure/ms-rest-azure-js";
import * as msRest from "@azure/ms-rest-js";

export { BaseResource, CloudError };

/**
 * The result of the request or operation.
 */
export interface DeleteOperationResult {
  /**
   * The result of the operation or request.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly operationResult?: boolean;
}

/**
 * Subnet first address, scope, and/or last address.
 */
export interface EndpointPropertiesSubnetsItem {
  /**
   * First address in the subnet.
   */
  first?: string;
  /**
   * Last address in the subnet.
   */
  last?: string;
  /**
   * Block size (number of leading bits in the subnet mask).
   */
  scope?: number;
}

/**
 * Custom header name and value.
 */
export interface EndpointPropertiesCustomHeadersItem {
  /**
   * Header name.
   */
  name?: string;
  /**
   * Header value.
   */
  value?: string;
}

/**
 * Class which is a sparse representation of a Traffic Manager endpoint.
 */
export interface HeatMapEndpoint {
  /**
   * The ARM Resource ID of this Traffic Manager endpoint.
   */
  resourceId?: string;
  /**
   * A number uniquely identifying this endpoint in query experiences.
   */
  endpointId?: number;
}

/**
 * Class representing a Traffic Manager HeatMap query experience properties.
 */
export interface QueryExperience {
  /**
   * The id of the endpoint from the 'endpoints' array which these queries were routed to.
   */
  endpointId: number;
  /**
   * The number of queries originating from this location.
   */
  queryCount: number;
  /**
   * The latency experienced by queries originating from this location.
   */
  latency?: number;
}

/**
 * Class representing a Traffic Manager HeatMap traffic flow properties.
 */
export interface TrafficFlow {
  /**
   * The IP address that this query experience originated from.
   */
  sourceIp?: string;
  /**
   * The approximate latitude that these queries originated from.
   */
  latitude?: number;
  /**
   * The approximate longitude that these queries originated from.
   */
  longitude?: number;
  /**
   * The query experiences produced in this HeatMap calculation.
   */
  queryExperiences?: QueryExperience[];
}

/**
 * The core properties of ARM resources
 */
export interface Resource extends BaseResource {
  /**
   * Fully qualified resource Id for the resource. Ex -
   * /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/trafficManagerProfiles/{resourceName}
   */
  id?: string;
  /**
   * The name of the resource
   */
  name?: string;
  /**
   * The type of the resource. Ex- Microsoft.Network/trafficManagerProfiles.
   */
  type?: string;
}

/**
 * The resource model definition for a ARM proxy resource. It will have everything other than
 * required location and tags
 */
export interface ProxyResource extends Resource {
}

/**
 * Class representing a Traffic Manager HeatMap.
 */
export interface HeatMapModel extends ProxyResource {
  /**
   * The beginning of the time window for this HeatMap, inclusive.
   */
  startTime?: Date;
  /**
   * The ending of the time window for this HeatMap, exclusive.
   */
  endTime?: Date;
  /**
   * The endpoints used in this HeatMap calculation.
   */
  endpoints?: HeatMapEndpoint[];
  /**
   * The traffic flows produced in this HeatMap calculation.
   */
  trafficFlows?: TrafficFlow[];
}

/**
 * Class representing Traffic Manager User Metrics.
 */
export interface UserMetricsModel extends ProxyResource {
  /**
   * The key returned by the User Metrics operation.
   */
  key?: string;
}

/**
 * Class representing a Traffic Manager endpoint.
 */
export interface Endpoint extends ProxyResource {
  /**
   * The Azure Resource URI of the of the endpoint. Not applicable to endpoints of type
   * 'ExternalEndpoints'.
   */
  targetResourceId?: string;
  /**
   * The fully-qualified DNS name or IP address of the endpoint. Traffic Manager returns this value
   * in DNS responses to direct traffic to this endpoint.
   */
  target?: string;
  /**
   * The status of the endpoint. If the endpoint is Enabled, it is probed for endpoint health and
   * is included in the traffic routing method. Possible values include: 'Enabled', 'Disabled'
   */
  endpointStatus?: EndpointStatus;
  /**
   * The weight of this endpoint when using the 'Weighted' traffic routing method. Possible values
   * are from 1 to 1000.
   */
  weight?: number;
  /**
   * The priority of this endpoint when using the 'Priority' traffic routing method. Possible
   * values are from 1 to 1000, lower values represent higher priority. This is an optional
   * parameter.  If specified, it must be specified on all endpoints, and no two endpoints can
   * share the same priority value.
   */
  priority?: number;
  /**
   * Specifies the location of the external or nested endpoints when using the 'Performance'
   * traffic routing method.
   */
  endpointLocation?: string;
  /**
   * The monitoring status of the endpoint. Possible values include: 'CheckingEndpoint', 'Online',
   * 'Degraded', 'Disabled', 'Inactive', 'Stopped'
   */
  endpointMonitorStatus?: EndpointMonitorStatus;
  /**
   * The minimum number of endpoints that must be available in the child profile in order for the
   * parent profile to be considered available. Only applicable to endpoint of type
   * 'NestedEndpoints'.
   */
  minChildEndpoints?: number;
  /**
   * The minimum number of IPv4 (DNS record type A) endpoints that must be available in the child
   * profile in order for the parent profile to be considered available. Only applicable to
   * endpoint of type 'NestedEndpoints'.
   */
  minChildEndpointsIPv4?: number;
  /**
   * The minimum number of IPv6 (DNS record type AAAA) endpoints that must be available in the
   * child profile in order for the parent profile to be considered available. Only applicable to
   * endpoint of type 'NestedEndpoints'.
   */
  minChildEndpointsIPv6?: number;
  /**
   * The list of countries/regions mapped to this endpoint when using the 'Geographic' traffic
   * routing method. Please consult Traffic Manager Geographic documentation for a full list of
   * accepted values.
   */
  geoMapping?: string[];
  /**
   * The list of subnets, IP addresses, and/or address ranges mapped to this endpoint when using
   * the 'Subnet' traffic routing method. An empty list will match all ranges not covered by other
   * endpoints.
   */
  subnets?: EndpointPropertiesSubnetsItem[];
  /**
   * List of custom headers.
   */
  customHeaders?: EndpointPropertiesCustomHeadersItem[];
}

/**
 * Parameters supplied to check Traffic Manager name operation.
 */
export interface CheckTrafficManagerRelativeDnsNameAvailabilityParameters {
  /**
   * The name of the resource.
   */
  name?: string;
  /**
   * The type of the resource.
   */
  type?: string;
}

/**
 * Class containing DNS settings in a Traffic Manager profile.
 */
export interface DnsConfig {
  /**
   * The relative DNS name provided by this Traffic Manager profile. This value is combined with
   * the DNS domain name used by Azure Traffic Manager to form the fully-qualified domain name
   * (FQDN) of the profile.
   */
  relativeName?: string;
  /**
   * The fully-qualified domain name (FQDN) of the Traffic Manager profile. This is formed from the
   * concatenation of the RelativeName with the DNS domain used by Azure Traffic Manager.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  readonly fqdn?: string;
  /**
   * The DNS Time-To-Live (TTL), in seconds. This informs the local DNS resolvers and DNS clients
   * how long to cache DNS responses provided by this Traffic Manager profile.
   */
  ttl?: number;
}

/**
 * Custom header name and value.
 */
export interface MonitorConfigCustomHeadersItem {
  /**
   * Header name.
   */
  name?: string;
  /**
   * Header value.
   */
  value?: string;
}

/**
 * Min and max value of a status code range.
 */
export interface MonitorConfigExpectedStatusCodeRangesItem {
  /**
   * Min status code.
   */
  min?: number;
  /**
   * Max status code.
   */
  max?: number;
}

/**
 * Class containing endpoint monitoring settings in a Traffic Manager profile.
 */
export interface MonitorConfig {
  /**
   * The profile-level monitoring status of the Traffic Manager profile. Possible values include:
   * 'CheckingEndpoints', 'Online', 'Degraded', 'Disabled', 'Inactive'
   */
  profileMonitorStatus?: ProfileMonitorStatus;
  /**
   * The protocol (HTTP, HTTPS or TCP) used to probe for endpoint health. Possible values include:
   * 'HTTP', 'HTTPS', 'TCP'
   */
  protocol?: MonitorProtocol;
  /**
   * The TCP port used to probe for endpoint health.
   */
  port?: number;
  /**
   * The path relative to the endpoint domain name used to probe for endpoint health.
   */
  path?: string;
  /**
   * The monitor interval for endpoints in this profile. This is the interval at which Traffic
   * Manager will check the health of each endpoint in this profile.
   */
  intervalInSeconds?: number;
  /**
   * The monitor timeout for endpoints in this profile. This is the time that Traffic Manager
   * allows endpoints in this profile to response to the health check.
   */
  timeoutInSeconds?: number;
  /**
   * The number of consecutive failed health check that Traffic Manager tolerates before declaring
   * an endpoint in this profile Degraded after the next failed health check.
   */
  toleratedNumberOfFailures?: number;
  /**
   * List of custom headers.
   */
  customHeaders?: MonitorConfigCustomHeadersItem[];
  /**
   * List of expected status code ranges.
   */
  expectedStatusCodeRanges?: MonitorConfigExpectedStatusCodeRangesItem[];
}

/**
 * The resource model definition for a ARM tracked top level resource
 */
export interface TrackedResource extends Resource {
  /**
   * Resource tags.
   */
  tags?: { [propertyName: string]: string };
  /**
   * The Azure Region where the resource lives
   */
  location?: string;
}

/**
 * Class representing a Traffic Manager profile.
 */
export interface Profile extends TrackedResource {
  /**
   * The status of the Traffic Manager profile. Possible values include: 'Enabled', 'Disabled'
   */
  profileStatus?: ProfileStatus;
  /**
   * The traffic routing method of the Traffic Manager profile. Possible values include:
   * 'Performance', 'Priority', 'Weighted', 'Geographic', 'MultiValue', 'Subnet'
   */
  trafficRoutingMethod?: TrafficRoutingMethod;
  /**
   * The DNS settings of the Traffic Manager profile.
   */
  dnsConfig?: DnsConfig;
  /**
   * The endpoint monitoring settings of the Traffic Manager profile.
   */
  monitorConfig?: MonitorConfig;
  /**
   * The list of endpoints in the Traffic Manager profile.
   */
  endpoints?: Endpoint[];
  /**
   * Indicates whether Traffic View is 'Enabled' or 'Disabled' for the Traffic Manager profile.
   * Null, indicates 'Disabled'. Enabling this feature will increase the cost of the Traffic Manage
   * profile. Possible values include: 'Enabled', 'Disabled'
   */
  trafficViewEnrollmentStatus?: TrafficViewEnrollmentStatus;
  /**
   * The list of allowed endpoint record types.
   */
  allowedEndpointRecordTypes?: AllowedEndpointRecordType[];
  /**
   * Maximum number of endpoints to be returned for MultiValue routing type.
   */
  maxReturn?: number;
}

/**
 * Class representing a Traffic Manager Name Availability response.
 */
export interface TrafficManagerNameAvailability {
  /**
   * The relative name.
   */
  name?: string;
  /**
   * Traffic Manager profile resource type.
   */
  type?: string;
  /**
   * Describes whether the relative name is available or not.
   */
  nameAvailable?: boolean;
  /**
   * The reason why the name is not available, when applicable.
   */
  reason?: string;
  /**
   * Descriptive message that explains why the name is not available, when applicable.
   */
  message?: string;
}

/**
 * Class representing a region in the Geographic hierarchy used with the Geographic traffic routing
 * method.
 */
export interface Region {
  /**
   * The code of the region
   */
  code?: string;
  /**
   * The name of the region
   */
  name?: string;
  /**
   * The list of Regions grouped under this Region in the Geographic Hierarchy.
   */
  regions?: Region[];
}

/**
 * Class representing the Geographic hierarchy used with the Geographic traffic routing method.
 */
export interface TrafficManagerGeographicHierarchy extends ProxyResource {
  /**
   * The region at the root of the hierarchy from all the regions in the hierarchy can be
   * retrieved.
   */
  geographicHierarchy?: Region;
}

/**
 * Optional Parameters.
 */
export interface HeatMapGetOptionalParams extends msRest.RequestOptionsBase {
  /**
   * The top left latitude,longitude pair of the rectangular viewport to query for.
   */
  topLeft?: number[];
  /**
   * The bottom right latitude,longitude pair of the rectangular viewport to query for.
   */
  botRight?: number[];
}

/**
 * An interface representing TrafficManagerManagementClientOptions.
 */
export interface TrafficManagerManagementClientOptions extends AzureServiceClientOptions {
  baseUri?: string;
}

/**
 * @interface
 * The list Traffic Manager profiles operation response.
 * @extends Array<Profile>
 */
export interface ProfileListResult extends Array<Profile> {
}

/**
 * Defines values for EndpointStatus.
 * Possible values include: 'Enabled', 'Disabled'
 * @readonly
 * @enum {string}
 */
export type EndpointStatus = 'Enabled' | 'Disabled';

/**
 * Defines values for EndpointMonitorStatus.
 * Possible values include: 'CheckingEndpoint', 'Online', 'Degraded', 'Disabled', 'Inactive',
 * 'Stopped'
 * @readonly
 * @enum {string}
 */
export type EndpointMonitorStatus = 'CheckingEndpoint' | 'Online' | 'Degraded' | 'Disabled' | 'Inactive' | 'Stopped';

/**
 * Defines values for ProfileMonitorStatus.
 * Possible values include: 'CheckingEndpoints', 'Online', 'Degraded', 'Disabled', 'Inactive'
 * @readonly
 * @enum {string}
 */
export type ProfileMonitorStatus = 'CheckingEndpoints' | 'Online' | 'Degraded' | 'Disabled' | 'Inactive';

/**
 * Defines values for MonitorProtocol.
 * Possible values include: 'HTTP', 'HTTPS', 'TCP'
 * @readonly
 * @enum {string}
 */
export type MonitorProtocol = 'HTTP' | 'HTTPS' | 'TCP';

/**
 * Defines values for ProfileStatus.
 * Possible values include: 'Enabled', 'Disabled'
 * @readonly
 * @enum {string}
 */
export type ProfileStatus = 'Enabled' | 'Disabled';

/**
 * Defines values for TrafficRoutingMethod.
 * Possible values include: 'Performance', 'Priority', 'Weighted', 'Geographic', 'MultiValue',
 * 'Subnet'
 * @readonly
 * @enum {string}
 */
export type TrafficRoutingMethod = 'Performance' | 'Priority' | 'Weighted' | 'Geographic' | 'MultiValue' | 'Subnet';

/**
 * Defines values for TrafficViewEnrollmentStatus.
 * Possible values include: 'Enabled', 'Disabled'
 * @readonly
 * @enum {string}
 */
export type TrafficViewEnrollmentStatus = 'Enabled' | 'Disabled';

/**
 * Defines values for AllowedEndpointRecordType.
 * Possible values include: 'DomainName', 'IPv4Address', 'IPv6Address', 'Any'
 * @readonly
 * @enum {string}
 */
export type AllowedEndpointRecordType = 'DomainName' | 'IPv4Address' | 'IPv6Address' | 'Any';

/**
 * Contains response data for the update operation.
 */
export type EndpointsUpdateResponse = Endpoint & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: Endpoint;
    };
};

/**
 * Contains response data for the get operation.
 */
export type EndpointsGetResponse = Endpoint & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: Endpoint;
    };
};

/**
 * Contains response data for the createOrUpdate operation.
 */
export type EndpointsCreateOrUpdateResponse = Endpoint & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: Endpoint;
    };
};

/**
 * Contains response data for the deleteMethod operation.
 */
export type EndpointsDeleteMethodResponse = DeleteOperationResult & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: DeleteOperationResult;
    };
};

/**
 * Contains response data for the checkTrafficManagerRelativeDnsNameAvailability operation.
 */
export type ProfilesCheckTrafficManagerRelativeDnsNameAvailabilityResponse = TrafficManagerNameAvailability & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: TrafficManagerNameAvailability;
    };
};

/**
 * Contains response data for the listByResourceGroup operation.
 */
export type ProfilesListByResourceGroupResponse = ProfileListResult & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: ProfileListResult;
    };
};

/**
 * Contains response data for the listBySubscription operation.
 */
export type ProfilesListBySubscriptionResponse = ProfileListResult & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: ProfileListResult;
    };
};

/**
 * Contains response data for the get operation.
 */
export type ProfilesGetResponse = Profile & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: Profile;
    };
};

/**
 * Contains response data for the createOrUpdate operation.
 */
export type ProfilesCreateOrUpdateResponse = Profile & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: Profile;
    };
};

/**
 * Contains response data for the deleteMethod operation.
 */
export type ProfilesDeleteMethodResponse = DeleteOperationResult & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: DeleteOperationResult;
    };
};

/**
 * Contains response data for the update operation.
 */
export type ProfilesUpdateResponse = Profile & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: Profile;
    };
};

/**
 * Contains response data for the getDefault operation.
 */
export type GeographicHierarchiesGetDefaultResponse = TrafficManagerGeographicHierarchy & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: TrafficManagerGeographicHierarchy;
    };
};

/**
 * Contains response data for the get operation.
 */
export type HeatMapGetResponse = HeatMapModel & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: HeatMapModel;
    };
};

/**
 * Contains response data for the get operation.
 */
export type TrafficManagerUserMetricsKeysGetResponse = UserMetricsModel & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: UserMetricsModel;
    };
};

/**
 * Contains response data for the createOrUpdate operation.
 */
export type TrafficManagerUserMetricsKeysCreateOrUpdateResponse = UserMetricsModel & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: UserMetricsModel;
    };
};

/**
 * Contains response data for the deleteMethod operation.
 */
export type TrafficManagerUserMetricsKeysDeleteMethodResponse = DeleteOperationResult & {
  /**
   * The underlying HTTP response.
   */
  _response: msRest.HttpResponse & {
      /**
       * The response body as text (string format)
       */
      bodyAsText: string;

      /**
       * The response body as parsed JSON or XML
       */
      parsedBody: DeleteOperationResult;
    };
};
