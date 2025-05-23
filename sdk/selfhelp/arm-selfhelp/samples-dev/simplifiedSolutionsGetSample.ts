/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */
import { HelpRP } from "@azure/arm-selfhelp";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to Get the simplified Solutions using the applicable solutionResourceName while creating the simplified Solutions.
 *
 * @summary Get the simplified Solutions using the applicable solutionResourceName while creating the simplified Solutions.
 * x-ms-original-file: specification/help/resource-manager/Microsoft.Help/preview/2024-03-01-preview/examples/SimplifiedSolutions_Get.json
 */
async function solutionGet(): Promise<void> {
  const scope =
    "subscriptions/mySubscription/resourcegroups/myresourceGroup/providers/Microsoft.KeyVault/vaults/test-keyvault-rp";
  const simplifiedSolutionsResourceName = "simplifiedSolutionsResourceName1";
  const credential = new DefaultAzureCredential();
  const client = new HelpRP(credential);
  const result = await client.simplifiedSolutions.get(scope, simplifiedSolutionsResourceName);
  console.log(result);
}

async function main(): Promise<void> {
  await solutionGet();
}

main().catch(console.error);
