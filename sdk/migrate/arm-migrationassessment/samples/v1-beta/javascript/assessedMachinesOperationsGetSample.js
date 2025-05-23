/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { AzureMigrateAssessmentService } = require("@azure/arm-migrationassessment");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv/config");

/**
 * This sample demonstrates how to Get a AssessedMachine
 *
 * @summary Get a AssessedMachine
 * x-ms-original-file: specification/migrate/resource-manager/Microsoft.Migrate/AssessmentProjects/stable/2023-03-15/examples/AssessedMachinesOperations_Get_MaximumSet_Gen.json
 */
async function assessedMachinesOperationsGetMaximumSetGen() {
  const subscriptionId =
    process.env["MIGRATE_SUBSCRIPTION_ID"] || "D8E1C413-E65F-40C0-8A7E-743D6B7A6AE9";
  const resourceGroupName = process.env["MIGRATE_RESOURCE_GROUP"] || "rgopenapi";
  const projectName = "pavqtntysjn";
  const groupName = "smawqdmhfngray";
  const assessmentName = "qjlumxyqsitd";
  const assessedMachineName = "oqxjeheiipjmuo";
  const credential = new DefaultAzureCredential();
  const client = new AzureMigrateAssessmentService(credential, subscriptionId);
  const result = await client.assessedMachinesOperations.get(
    resourceGroupName,
    projectName,
    groupName,
    assessmentName,
    assessedMachineName,
  );
  console.log(result);
}

async function main() {
  await assessedMachinesOperationsGetMaximumSetGen();
}

main().catch(console.error);
