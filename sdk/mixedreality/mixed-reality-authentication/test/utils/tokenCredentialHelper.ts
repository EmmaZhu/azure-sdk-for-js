// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { AzureKeyCredential } from "@azure/core-auth";
import { MixedRealityAccountKeyCredential } from "../../src/models/auth";

export function createTokenCredentialFromMRKeyCredential(
  accountId: string,
  accountKey: string | AzureKeyCredential,
): MixedRealityAccountKeyCredential {
  return new MixedRealityAccountKeyCredential(accountId, accountKey);
}
