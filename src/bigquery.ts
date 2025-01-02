
// /*!
//  * Copyright 2024 Google LLC
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
import {protos, DatasetServiceClient, TableServiceClient} from ".";
import {Callback, CallOptions} from "google-gax";
export class BigQueryClient{
	datasetClient: DatasetServiceClient;
	tableClient: TableServiceClient;

	constructor(options:any){
		this.datasetClient = options?.datasetClient ?? new DatasetServiceClient();
		this.tableClient = options?.tableClient ?? new TableServiceClient();
	}
	getDataset(
		request:  protos.google.cloud.bigquery.v2.IGetDatasetRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IGetDatasetRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IGetDatasetRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.IDataset,
        protos.google.cloud.bigquery.v2.IGetDatasetRequest|undefined, {}|undefined
      ]>|void{
		this.datasetClient.getDataset(request, optionsOrCallback, callback)
	}
	insertDataset(
		request:  protos.google.cloud.bigquery.v2.IInsertDatasetRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IInsertDatasetRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IInsertDatasetRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.IDataset,
        protos.google.cloud.bigquery.v2.IInsertDatasetRequest|undefined, {}|undefined
      ]>|void{
		this.datasetClient.insertDataset(request, optionsOrCallback, callback)
	}
	patchDataset(
		request:  protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.IDataset,
        protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest|undefined, {}|undefined
      ]>|void{
		this.datasetClient.patchDataset(request, optionsOrCallback, callback)
	}
	updateDataset(
		request:  protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.IDataset,
        protos.google.cloud.bigquery.v2.IUpdateOrPatchDatasetRequest|undefined, {}|undefined
      ]>|void{
		this.datasetClient.updateDataset(request, optionsOrCallback, callback)
	}
	deleteDataset(
		request:  protos.google.cloud.bigquery.v2.IDeleteDatasetRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.protobuf.IEmpty,
          protos.google.cloud.bigquery.v2.IDeleteDatasetRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.protobuf.IEmpty,
          protos.google.cloud.bigquery.v2.IDeleteDatasetRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.protobuf.IEmpty,
        protos.google.cloud.bigquery.v2.IDeleteDatasetRequest|undefined, {}|undefined
      ]>|void{
		this.datasetClient.deleteDataset(request, optionsOrCallback, callback)
	}
	listDatasets(
		request:  protos.google.cloud.bigquery.v2.IListDatasetsRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.IDatasetList,
          protos.google.cloud.bigquery.v2.IListDatasetsRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.IDatasetList,
          protos.google.cloud.bigquery.v2.IListDatasetsRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.IDatasetList,
        protos.google.cloud.bigquery.v2.IListDatasetsRequest|undefined, {}|undefined
      ]>|void{
		this.datasetClient.listDatasets(request, optionsOrCallback, callback)
	}
	undeleteDataset(
		request:  protos.google.cloud.bigquery.v2.IUndeleteDatasetRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IUndeleteDatasetRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.IDataset,
          protos.google.cloud.bigquery.v2.IUndeleteDatasetRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.IDataset,
        protos.google.cloud.bigquery.v2.IUndeleteDatasetRequest|undefined, {}|undefined
      ]>|void{
		this.datasetClient.undeleteDataset(request, optionsOrCallback, callback)
	}
	getTable(
		request:  protos.google.cloud.bigquery.v2.IGetTableRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IGetTableRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IGetTableRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.ITable,
        protos.google.cloud.bigquery.v2.IGetTableRequest|undefined, {}|undefined
      ]>|void{
		this.tableClient.getTable(request, optionsOrCallback, callback)
	}
	insertTable(
		request:  protos.google.cloud.bigquery.v2.IInsertTableRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IInsertTableRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IInsertTableRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.ITable,
        protos.google.cloud.bigquery.v2.IInsertTableRequest|undefined, {}|undefined
      ]>|void{
		this.tableClient.insertTable(request, optionsOrCallback, callback)
	}
	patchTable(
		request:  protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.ITable,
        protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest|undefined, {}|undefined
      ]>|void{
		this.tableClient.patchTable(request, optionsOrCallback, callback)
	}
	updateTable(
		request:  protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.ITable,
          protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.ITable,
        protos.google.cloud.bigquery.v2.IUpdateOrPatchTableRequest|undefined, {}|undefined
      ]>|void{
		this.tableClient.updateTable(request, optionsOrCallback, callback)
	}
	deleteTable(
		request:  protos.google.cloud.bigquery.v2.IDeleteTableRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.protobuf.IEmpty,
          protos.google.cloud.bigquery.v2.IDeleteTableRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.protobuf.IEmpty,
          protos.google.cloud.bigquery.v2.IDeleteTableRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.protobuf.IEmpty,
        protos.google.cloud.bigquery.v2.IDeleteTableRequest|undefined, {}|undefined
      ]>|void{
		this.tableClient.deleteTable(request, optionsOrCallback, callback)
	}
	listTables(
		request:  protos.google.cloud.bigquery.v2.IListTablesRequest, 
		optionsOrCallback:  CallOptions|Callback<
          protos.google.cloud.bigquery.v2.ITableList,
          protos.google.cloud.bigquery.v2.IListTablesRequest|null|undefined,
          {}|null|undefined>, 
		callback:  Callback<
          protos.google.cloud.bigquery.v2.ITableList,
          protos.google.cloud.bigquery.v2.IListTablesRequest|null|undefined,
          {}|null|undefined>):
      Promise<[
        protos.google.cloud.bigquery.v2.ITableList,
        protos.google.cloud.bigquery.v2.IListTablesRequest|undefined, {}|undefined
      ]>|void{
		this.tableClient.listTables(request, optionsOrCallback, callback)
	}
}