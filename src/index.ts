// /*!
//  * Copyright 2019 Google Inc. All Rights Reserved.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *      http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

export {
  BigQuery,
//   BigQueryDate,
//   BigQueryDateOptions,
//   BigQueryDatetime,
//   BigQueryDatetimeOptions,
//   BigQueryInt,
//   BigQueryOptions,
//   BigQueryTime,
//   BigQueryTimeOptions,
//   BigQueryTimestamp,
//   common,
//   DatasetCallback,
//   DatasetResource,
//   DatasetResponse,
//   DatasetsCallback,
//   DatasetsResponse,
//   Geography,
//   GetDatasetsOptions,
//   GetJobsCallback,
//   GetJobsOptions,
//   GetJobsResponse,
//   IntegerTypeCastOptions,
//   IntegerTypeCastValue,
//   JobRequest,
//   Json,
//   PROTOCOL_REGEX,
//   PagedCallback,
//   PagedRequest,
//   PagedResponse,
//   ProvidedTypeArray,
//   ProvidedTypeStruct,
//   Query,
//   QueryOptions,
//   QueryParameter,
//   QueryRowsCallback,
//   QueryRowsResponse,
//   QueryStreamOptions,
//   RequestCallback,
//   ResourceCallback,
//   SimpleQueryRowsCallback,
//   SimpleQueryRowsResponse,
//   ValueType,
} from './bigquery';

// export {
//   CreateDatasetOptions,
//   Dataset,
//   DatasetDeleteOptions,
//   DatasetOptions,
//   GetModelsCallback,
//   GetModelsOptions,
//   GetModelsResponse,
//   GetRoutinesCallback,
//   GetRoutinesOptions,
//   GetRoutinesResponse,
//   GetTablesCallback,
//   GetTablesOptions,
//   GetTablesResponse,
//   RoutineCallback,
//   RoutineMetadata,
//   RoutineResponse,
//   TableCallback,
//   TableResponse,
// } from './dataset';

// // export {
// //   CancelCallback,
// //   CancelResponse,
// //   Job,
// //   JobMetadata,
// //   JobOptions,
// //   QueryResultsOptions,
// // } from './job';

// // export {
// //   CreateExtractJobOptions,
// //   File,
// //   JobCallback,
// //   JobMetadataCallback,
// //   JobMetadataResponse,
// //   JobResponse,
// //   Model,
// // } from './model';

// // export {Routine} from './routine';

// // export {RowBatch} from './rowBatch';

// // export {InsertRowsStreamResponse, RowQueue} from './rowQueue';

// // export {
// //   CopyTableMetadata,
// //   CreateCopyJobMetadata,
// //   FormattedMetadata,
// //   GetPolicyOptions,
// //   GetRowsOptions,
// //   InsertRow,
// //   InsertRowsCallback,
// //   InsertRowsOptions,
// //   InsertRowsResponse,
// //   InsertStreamOptions,
// //   JobLoadMetadata,
// //   PartialInsertFailure,
// //   PermissionsCallback,
// //   PermissionsResponse,
// //   Policy,
// //   PolicyCallback,
// //   PolicyRequest,
// //   PolicyResponse,
// //   RowMetadata,
// //   RowsCallback,
// //   RowsResponse,
// //   SetPolicyOptions,
// //   SetTableMetadataOptions,
// //   Table,
// //   TableField,
// //   TableMetadata,
// //   TableOptions,
// //   TableRow,
// //   TableRowField,
// //   TableRowValue,
// //   TableSchema,
// //   ViewDefinition,
// // } from './table';

import * as v2 from './v2';
const DatasetServiceClient = v2.DatasetServiceClient;
type DatasetServiceClient = v2.DatasetServiceClient;
const JobServiceClient = v2.JobServiceClient;
type JobServiceClient = v2.JobServiceClient;
const ModelServiceClient = v2.ModelServiceClient;
type ModelServiceClient = v2.ModelServiceClient;
const ProjectServiceClient = v2.ProjectServiceClient;
type ProjectServiceClient = v2.ProjectServiceClient;
const RoutineServiceClient = v2.RoutineServiceClient;
type RoutineServiceClient = v2.RoutineServiceClient;
const RowAccessPolicyServiceClient = v2.RowAccessPolicyServiceClient;
type RowAccessPolicyServiceClient = v2.RowAccessPolicyServiceClient;
const TableServiceClient = v2.TableServiceClient;
type TableServiceClient = v2.TableServiceClient;
export {v2, DatasetServiceClient, JobServiceClient, ModelServiceClient, ProjectServiceClient, RoutineServiceClient, RowAccessPolicyServiceClient, TableServiceClient};
export default {v2, DatasetServiceClient, JobServiceClient, ModelServiceClient, ProjectServiceClient, RoutineServiceClient, RowAccessPolicyServiceClient, TableServiceClient};
import * as protos from '../protos/protos';
export {protos}
