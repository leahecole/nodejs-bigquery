// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// sample-metadata:
//   title: BigQuery List Models Streaming
//   description: Lists all existing models in the dataset using streaming method.
//   usage: node listModelsStreaming.js <DATASET_ID>

function main(datasetId = 'my_dataset') {
  // [START bigquery_list_models_streaming]

  // Import the Google Cloud client library
  const {DatasetServiceClient} = require('../build/src');
  const bigquery = new DatasetServiceClient();

  async function listDatasets() {
    // Lists all existing datasets in the dataset using streaming method.

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const projectId = "leah-playground"
    console.log("########## regular get datasets")
    const request = {
        projectId,
      };
    const [datasets] = await bigquery.listDatasets(request);
    console.log('Datasets:', datasets);
    console.log("########## streaming get datasets")

    // bigquery
    //   .getDatasetsStream()
    //   .on('error', console.error)
    //   .on('data', dataset => {
    //     console.log(dataset.metadata);
    //   })
    //   .on('end', () => {
    //     console.log('All models have been retrieved.');
    //   });
  }
  // [END bigquery_list_models_streaming]
  listDatasets();
}

main(...process.argv.slice(2));
