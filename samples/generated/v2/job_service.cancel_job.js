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

function main(projectId, jobId) {
  // [START bigquery_v2_generated_JobService_CancelJob_async]
  /**
   * This snippet has been automatically generated and should be regarded as a code template only.
   * It will require modifications to work.
   * It may require correct/in-range values for request initialization.
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. Project ID of the job to cancel
   */
  // const projectId = 'abc123'
  /**
   *  Required. Job ID of the job to cancel
   */
  // const jobId = 'abc123'
  /**
   *  The geographic location of the job. You must specify the location to run
   *  the job for the following scenarios:
   *  * If the location to run a job is not in the `us` or
   *    the `eu` multi-regional location
   *  * If the job's location is in a single region (for example,
   *    `us-central1`)
   *  For more information, see
   *  https://cloud.google.com/bigquery/docs/locations#specifying_your_location.
   */
  // const location = 'abc123'

  // Imports the Bigquery library
  const {JobServiceClient} = require('@google-cloud/bigquery').v2;

  // Instantiates a client
  const bigqueryClient = new JobServiceClient();

  async function callCancelJob() {
    // Construct request
    const request = {
      projectId,
      jobId,
    };

    // Run request
    const response = await bigqueryClient.cancelJob(request);
    console.log(response);
  }

  callCancelJob();
  // [END bigquery_v2_generated_JobService_CancelJob_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));