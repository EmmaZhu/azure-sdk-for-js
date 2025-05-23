/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { ConsumptionManagementClient } from "@azure/arm-consumption";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

/**
 * This sample demonstrates how to The operation to delete a budget.
 *
 * @summary The operation to delete a budget.
 * x-ms-original-file: specification/consumption/resource-manager/Microsoft.Consumption/stable/2021-10-01/examples/DeleteBudget.json
 */
async function deleteBudget(): Promise<void> {
  const subscriptionId =
    process.env["CONSUMPTION_SUBSCRIPTION_ID"] || "00000000-0000-0000-0000-000000000000";
  const scope = "subscriptions/00000000-0000-0000-0000-000000000000";
  const budgetName = "TestBudget";
  const credential = new DefaultAzureCredential();
  const client = new ConsumptionManagementClient(credential, subscriptionId);
  const result = await client.budgets.delete(scope, budgetName);
  console.log(result);
}

async function main(): Promise<void> {
  await deleteBudget();
}

main().catch(console.error);
