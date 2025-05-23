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
 * This sample demonstrates how to Get WAF log analytics charts for AFD profile
 *
 * @summary Get WAF log analytics charts for AFD profile
 * x-ms-original-file: specification/cdn/resource-manager/Microsoft.Cdn/stable/2024-02-01/examples/LogAnalytics_GetWafLogAnalyticsRankings.json
 */
async function logAnalyticsGetWafLogAnalyticsRankings(): Promise<void> {
  const subscriptionId = process.env["CDN_SUBSCRIPTION_ID"] || "subid";
  const resourceGroupName = process.env["CDN_RESOURCE_GROUP"] || "RG";
  const profileName = "profile1";
  const metrics = ["clientRequestCount"];
  const dateTimeBegin = new Date("2020-11-04T06:49:27.554Z");
  const dateTimeEnd = new Date("2020-11-04T09:49:27.554Z");
  const maxRanking = 5;
  const rankings = ["ruleId"];
  const credential = new DefaultAzureCredential();
  const client = new CdnManagementClient(credential, subscriptionId);
  const result = await client.logAnalytics.getWafLogAnalyticsRankings(
    resourceGroupName,
    profileName,
    metrics,
    dateTimeBegin,
    dateTimeEnd,
    maxRanking,
    rankings,
  );
  console.log(result);
}

async function main(): Promise<void> {
  await logAnalyticsGetWafLogAnalyticsRankings();
}

main().catch(console.error);
