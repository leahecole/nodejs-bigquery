// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **



'use strict';

function main(projectId, datasetId) {
  // [START bigquery_v2_generated_ModelService_ListModels_async]
  /**
   * This snippet has been automatically generated and should be regarded as a code template only.
   * It will require modifications to work.
   * It may require correct/in-range values for request initialization.
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. Project ID of the models to list.
   */
  // const projectId = 'abc123'
  /**
   *  Required. Dataset ID of the models to list.
   */
  // const datasetId = 'abc123'
  /**
   *  The maximum number of results to return in a single response page.
   *  Leverage the page tokens to iterate through the entire collection.
   */
  // const maxResults = {}
  /**
   *  Page token, returned by a previous call to request the next page of
   *  results
   */
  // const pageToken = 'abc123'

  // Imports the Bigquery library
  const {ModelServiceClient} = require('@google-cloud/bigquery').v2;

  // Instantiates a client
  const bigqueryClient = new ModelServiceClient();

  async function callListModels() {
    // Construct request
    const request = {
      projectId,
      datasetId,
    };

    // Run request
    const response = await bigqueryClient.listModels(request);
    console.log(response);
  }

  callListModels();
  // [END bigquery_v2_generated_ModelService_ListModels_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
