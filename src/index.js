"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.protos = exports.TableServiceClient = exports.RowAccessPolicyServiceClient = exports.RoutineServiceClient = exports.ProjectServiceClient = exports.ModelServiceClient = exports.JobServiceClient = exports.DatasetServiceClient = exports.v2 = exports.BigQueryClient = void 0;
var bigquery_1 = require("./bigquery");
Object.defineProperty(exports, "BigQueryClient", { enumerable: true, get: function () { return bigquery_1.BigQueryClient; } });
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
var v2 = require("./v2");
exports.v2 = v2;
var DatasetServiceClient = v2.DatasetServiceClient;
exports.DatasetServiceClient = DatasetServiceClient;
var JobServiceClient = v2.JobServiceClient;
exports.JobServiceClient = JobServiceClient;
var ModelServiceClient = v2.ModelServiceClient;
exports.ModelServiceClient = ModelServiceClient;
var ProjectServiceClient = v2.ProjectServiceClient;
exports.ProjectServiceClient = ProjectServiceClient;
var RoutineServiceClient = v2.RoutineServiceClient;
exports.RoutineServiceClient = RoutineServiceClient;
var RowAccessPolicyServiceClient = v2.RowAccessPolicyServiceClient;
exports.RowAccessPolicyServiceClient = RowAccessPolicyServiceClient;
var TableServiceClient = v2.TableServiceClient;
exports.TableServiceClient = TableServiceClient;
exports.default = { v2: v2, DatasetServiceClient: DatasetServiceClient, JobServiceClient: JobServiceClient, ModelServiceClient: ModelServiceClient, ProjectServiceClient: ProjectServiceClient, RoutineServiceClient: RoutineServiceClient, RowAccessPolicyServiceClient: RowAccessPolicyServiceClient, TableServiceClient: TableServiceClient };
var protos = require("../protos/protos");
exports.protos = protos;
