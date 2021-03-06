## API Report File for "@azure/mixedreality-authentication"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AccessToken } from '@azure/core-auth';
import { AzureKeyCredential } from '@azure/core-auth';
import { OperationOptions } from '@azure/core-http';
import { PipelineOptions } from '@azure/core-http';
import { TokenCredential } from '@azure/core-http';

export { AccessToken }

export { AzureKeyCredential }

// @public
export interface GetTokenOptions extends OperationOptions {
}

// @public
export class MixedRealityStsClient {
    constructor(accountId: string, accountDomain: string, keyCredential: AzureKeyCredential, options?: MixedRealityStsClientOptions);
    constructor(accountId: string, accountDomain: string, credential: TokenCredential, options?: MixedRealityStsClientOptions);
    readonly accountId: string;
    readonly endpointUrl: string;
    getToken(options?: GetTokenOptions): Promise<AccessToken>;
    }

// @public
export interface MixedRealityStsClientOptions extends PipelineOptions {
    customEndpointUrl?: string;
}


```
