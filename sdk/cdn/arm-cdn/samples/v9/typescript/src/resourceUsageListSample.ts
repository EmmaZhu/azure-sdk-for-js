/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */
import { CdnManagementClient } from "@azure/arm-cdn";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Check the quota and actual usage of the CDN profiles under the given subscription.
 *
 * @summary Check the quota and actual usage of the CDN profiles under the given subscription.
 * x-ms-original-file: specification/cdn/resource-manager/Microsoft.Cdn/stable/2024-02-01/examples/ResourceUsage_List.json
 */
async function resourceUsageList() {
  const subscriptionId = process.env["CDN_SUBSCRIPTION_ID"] || "subid";
  const credential = new DefaultAzureCredential();
  const client = new CdnManagementClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.resourceUsageOperations.list()) {
    resArray.push(item);
  }
  console.log(resArray);
}

async function main() {
  resourceUsageList();
}

main().catch(console.error);
