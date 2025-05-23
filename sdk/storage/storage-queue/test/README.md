# Testing

To test this project, make sure to first build it properly by following our [building instructions](https://github.com/Azure/azure-sdk-for-js/blob/main/CONTRIBUTING.md#building). Once the project is correctly built, you will be able to run the tests by following the [testing instructions](https://github.com/Azure/azure-sdk-for-js/blob/main/CONTRIBUTING.md#testing).

You can use existing Azure resources for the live tests, or generate new ones by using our [New-TestResources.ps1](https://github.com/Azure/azure-sdk-for-js/blob/main/eng/common/TestResources/New-TestResources.ps1) script, which will use a [Bicep template](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/test-resources.bicep) that already has all of the the necessary configurations.

The Azure resources that are used by the tests in this project are:

- Two general purpose, v2 [Azure Storage](https://learn.microsoft.com/azure/storage/common/storage-account-overview) account properly configured to test the Azure Storage Blob, Azure Storage Queue, Azure File Data Lake and Azure File Share services.

You will also need to set the below environment variables to run the live tests:

- `TEST_MODE`: Should have `live` assigned.
- `ACCOUNT_NAME`: The Azure Storage account name.
- `STORAGE_DATALAKE_ACCOUNT_NAME`: An Azure Storage account name that has Azure Storage File Data Lake features.
- `ACCOUNT_KEY`: The Azure Storage account key.
- `ACCOUNT_SAS`: The shared access signature.
- `STORAGE_CONNECTION_STRING`: The Azure Storage account connection string.

The live tests in this project will create queues in the provided Azure Storage account.
