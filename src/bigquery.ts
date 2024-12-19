
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
export class BigQueryClient{
	datasetClient: DatasetServiceClient;
	tableClient: TableServiceClient;

	constructor(options:any){
		this.datasetClient = options?.datasetClient ?? new DatasetServiceClient();
		this.tableClient = options?.tableClient ?? new TableServiceClient();
	}
	getDataset(
		request: IGetDatasetRequest, 
		optionsOrCallback: CallOptions | Callback<IDataset, IGetDatasetRequest, {}>, 
		callback: Callback<IDataset, IGetDatasetRequest, {}>):void | Promise<[IDataset, IGetDatasetRequest, {}]>{
		this.datasetClient.getDataset(request, optionsOrCallback, callback)
	}
	insertDataset(
		request: IInsertDatasetRequest, 
		optionsOrCallback: CallOptions | Callback<IDataset, IInsertDatasetRequest, {}>, 
		callback: Callback<IDataset, IInsertDatasetRequest, {}>):void | Promise<[IDataset, IInsertDatasetRequest, {}]>{
		this.datasetClient.insertDataset(request, optionsOrCallback, callback)
	}
	patchDataset(
		request: IUpdateOrPatchDatasetRequest, 
		optionsOrCallback: CallOptions | Callback<IDataset, IUpdateOrPatchDatasetRequest, {}>, 
		callback: Callback<IDataset, IUpdateOrPatchDatasetRequest, {}>):void | Promise<[IDataset, IUpdateOrPatchDatasetRequest, {}]>{
		this.datasetClient.patchDataset(request, optionsOrCallback, callback)
	}
	updateDataset(
		request: IUpdateOrPatchDatasetRequest, 
		optionsOrCallback: CallOptions | Callback<IDataset, IUpdateOrPatchDatasetRequest, {}>, 
		callback: Callback<IDataset, IUpdateOrPatchDatasetRequest, {}>):void | Promise<[IDataset, IUpdateOrPatchDatasetRequest, {}]>{
		this.datasetClient.updateDataset(request, optionsOrCallback, callback)
	}
	deleteDataset(
		request: IDeleteDatasetRequest, 
		optionsOrCallback: CallOptions | Callback<IEmpty, IDeleteDatasetRequest, {}>, 
		callback: Callback<IEmpty, IDeleteDatasetRequest, {}>):void | Promise<[IEmpty, IDeleteDatasetRequest, {}]>{
		this.datasetClient.deleteDataset(request, optionsOrCallback, callback)
	}
	listDatasets(
		request: IListDatasetsRequest, 
		optionsOrCallback: CallOptions | Callback<IDatasetList, IListDatasetsRequest, {}>, 
		callback: Callback<IDatasetList, IListDatasetsRequest, {}>):void | Promise<[IDatasetList, IListDatasetsRequest, {}]>{
		this.datasetClient.listDatasets(request, optionsOrCallback, callback)
	}
	undeleteDataset(
		request: IUndeleteDatasetRequest, 
		optionsOrCallback: CallOptions | Callback<IDataset, IUndeleteDatasetRequest, {}>, 
		callback: Callback<IDataset, IUndeleteDatasetRequest, {}>):void | Promise<[IDataset, IUndeleteDatasetRequest, {}]>{
		this.datasetClient.undeleteDataset(request, optionsOrCallback, callback)
	}
}