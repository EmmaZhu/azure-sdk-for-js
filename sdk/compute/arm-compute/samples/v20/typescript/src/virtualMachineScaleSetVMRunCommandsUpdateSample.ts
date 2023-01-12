/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  VirtualMachineRunCommandUpdate,
  ComputeManagementClient
} from "@azure/arm-compute";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to The operation to update the VMSS VM run command.
 *
 * @summary The operation to update the VMSS VM run command.
 * x-ms-original-file: specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-11-01/examples/runCommandExamples/VirtualMachineScaleSetVMRunCommand_Update.json
 */
async function updateVirtualMachineScaleSetVMRunCommand() {
  const subscriptionId =
    process.env["COMPUTE_SUBSCRIPTION_ID"] || "{subscription-id}";
  const resourceGroupName =
    process.env["COMPUTE_RESOURCE_GROUP"] || "myResourceGroup";
  const vmScaleSetName = "myvmScaleSet";
  const instanceId = "0";
  const runCommandName = "myRunCommand";
  const runCommand: VirtualMachineRunCommandUpdate = {
    source: { script: "Write-Host Script Source Updated!" }
  };
  const credential = new DefaultAzureCredential();
  const client = new ComputeManagementClient(credential, subscriptionId);
  const result = await client.virtualMachineScaleSetVMRunCommands.beginUpdateAndWait(
    resourceGroupName,
    vmScaleSetName,
    instanceId,
    runCommandName,
    runCommand
  );
  console.log(result);
}

async function main() {
  updateVirtualMachineScaleSetVMRunCommand();
}

main().catch(console.error);