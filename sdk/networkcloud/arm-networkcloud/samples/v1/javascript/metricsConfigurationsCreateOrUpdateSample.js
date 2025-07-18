/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

const { NetworkCloud } = require("@azure/arm-networkcloud");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv/config");

/**
 * This sample demonstrates how to Create new or update the existing metrics configuration of the provided cluster.
 *
 * @summary Create new or update the existing metrics configuration of the provided cluster.
 * x-ms-original-file: specification/networkcloud/resource-manager/Microsoft.NetworkCloud/stable/2025-02-01/examples/ClusterMetricsConfigurations_Create.json
 */
async function createOrUpdateMetricsConfigurationOfCluster() {
  const subscriptionId =
    process.env["NETWORKCLOUD_SUBSCRIPTION_ID"] || "123e4567-e89b-12d3-a456-426655440000";
  const resourceGroupName = process.env["NETWORKCLOUD_RESOURCE_GROUP"] || "resourceGroupName";
  const clusterName = "clusterName";
  const metricsConfigurationName = "default";
  const metricsConfigurationParameters = {
    collectionInterval: 15,
    enabledMetrics: ["metric1", "metric2"],
    extendedLocation: {
      name: "/subscriptions/123e4567-e89b-12d3-a456-426655440000/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterExtendedLocationName",
      type: "CustomLocation",
    },
    location: "location",
    tags: { key1: "myvalue1", key2: "myvalue2" },
  };
  const credential = new DefaultAzureCredential();
  const client = new NetworkCloud(credential, subscriptionId);
  const result = await client.metricsConfigurations.beginCreateOrUpdateAndWait(
    resourceGroupName,
    clusterName,
    metricsConfigurationName,
    metricsConfigurationParameters,
  );
  console.log(result);
}

async function main() {
  await createOrUpdateMetricsConfigurationOfCluster();
}

main().catch(console.error);
