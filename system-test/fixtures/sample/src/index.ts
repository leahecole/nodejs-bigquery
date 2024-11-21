// Copyright 2023 Google LLC
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

import {BigQuery} from '@google-cloud/bigquery';

import {DatasetServiceClient, JobServiceClient, ModelServiceClient, ProjectServiceClient, RoutineServiceClient, RowAccessPolicyServiceClient, TableServiceClient} from '@google-cloud/bigquery';

// check that the client class type name can be used
function doStuffWithDatasetServiceClient(client: DatasetServiceClient) {
  client.close();
}
function doStuffWithJobServiceClient(client: JobServiceClient) {
  client.close();
}
function doStuffWithModelServiceClient(client: ModelServiceClient) {
  client.close();
}
function doStuffWithProjectServiceClient(client: ProjectServiceClient) {
  client.close();
}
function doStuffWithRoutineServiceClient(client: RoutineServiceClient) {
  client.close();
}
function doStuffWithRowAccessPolicyServiceClient(client: RowAccessPolicyServiceClient) {
  client.close();
}
function doStuffWithTableServiceClient(client: TableServiceClient) {
  client.close();
}

function main() {
  // check that the client instance can be created
  const datasetServiceClient = new DatasetServiceClient();
  doStuffWithDatasetServiceClient(datasetServiceClient);
  // check that the client instance can be created
  const jobServiceClient = new JobServiceClient();
  doStuffWithJobServiceClient(jobServiceClient);
  // check that the client instance can be created
  const modelServiceClient = new ModelServiceClient();
  doStuffWithModelServiceClient(modelServiceClient);
  // check that the client instance can be created
  const projectServiceClient = new ProjectServiceClient();
  doStuffWithProjectServiceClient(projectServiceClient);
  // check that the client instance can be created
  const routineServiceClient = new RoutineServiceClient();
  doStuffWithRoutineServiceClient(routineServiceClient);
  // check that the client instance can be created
  const rowAccessPolicyServiceClient = new RowAccessPolicyServiceClient();
  doStuffWithRowAccessPolicyServiceClient(rowAccessPolicyServiceClient);
  // check that the client instance can be created
  const tableServiceClient = new TableServiceClient();
  doStuffWithTableServiceClient(tableServiceClient);
  const bq = new BigQuery();
  console.log(bq);
}
