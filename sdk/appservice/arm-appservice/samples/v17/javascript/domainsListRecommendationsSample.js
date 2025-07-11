/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

const { WebSiteManagementClient } = require("@azure/arm-appservice");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv/config");

/**
 * This sample demonstrates how to Description for Get domain name recommendations based on keywords.
 *
 * @summary Description for Get domain name recommendations based on keywords.
 * x-ms-original-file: specification/web/resource-manager/Microsoft.DomainRegistration/stable/2024-11-01/examples/ListDomainRecommendations.json
 */
async function listDomainRecommendations() {
  const subscriptionId =
    process.env["APPSERVICE_SUBSCRIPTION_ID"] || "34adfa4f-cedf-4dc0-ba29-b6d1a69ab345";
  const parameters = {
    keywords: "example1",
    maxDomainRecommendations: 10,
  };
  const credential = new DefaultAzureCredential();
  const client = new WebSiteManagementClient(credential, subscriptionId);
  const resArray = new Array();
  for await (const item of client.domains.listRecommendations(parameters)) {
    resArray.push(item);
  }
  console.log(resArray);
}

async function main() {
  await listDomainRecommendations();
}

main().catch(console.error);
