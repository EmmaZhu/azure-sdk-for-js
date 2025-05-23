// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IoTOperationsClient } from "@azure/arm-iotoperations";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * This sample demonstrates how to delete a BrokerResource
 *
 * @summary delete a BrokerResource
 * x-ms-original-file: 2024-11-01/Broker_Delete_MaximumSet_Gen.json
 */
async function brokerDelete(): Promise<void> {
  const credential = new DefaultAzureCredential();
  const subscriptionId = "F8C729F9-DF9C-4743-848F-96EE433D8E53";
  const client = new IoTOperationsClient(credential, subscriptionId);
  await client.broker.delete(
    "rgiotoperations",
    "resource-name123",
    "resource-name123",
  );
}

async function main(): Promise<void> {
  brokerDelete();
}

main().catch(console.error);
