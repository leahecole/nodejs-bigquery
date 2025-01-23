"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigQueryClient = void 0;
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
var _1 = require(".");
var BigQueryClient = /** @class */ (function () {
    function BigQueryClient(options) {
        var _a, _b;
        this.datasetClient = (_a = options === null || options === void 0 ? void 0 : options.datasetClient) !== null && _a !== void 0 ? _a : new _1.DatasetServiceClient();
        this.tableClient = (_b = options === null || options === void 0 ? void 0 : options.tableClient) !== null && _b !== void 0 ? _b : new _1.TableServiceClient();
    }
    BigQueryClient.prototype.getDataset = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.datasetClient.getDataset(request, options, callback);
    };
    BigQueryClient.prototype.insertDataset = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.datasetClient.insertDataset(request, options, callback);
    };
    BigQueryClient.prototype.patchDataset = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.datasetClient.patchDataset(request, options, callback);
    };
    BigQueryClient.prototype.updateDataset = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.datasetClient.updateDataset(request, options, callback);
    };
    BigQueryClient.prototype.deleteDataset = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.datasetClient.deleteDataset(request, options, callback);
    };
    BigQueryClient.prototype.listDatasets = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.datasetClient.listDatasets(request, options, callback);
    };
    BigQueryClient.prototype.undeleteDataset = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.datasetClient.undeleteDataset(request, options, callback);
    };
    BigQueryClient.prototype.getTable = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.tableClient.getTable(request, options, callback);
    };
    BigQueryClient.prototype.insertTable = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.tableClient.insertTable(request, options, callback);
    };
    BigQueryClient.prototype.patchTable = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.tableClient.patchTable(request, options, callback);
    };
    BigQueryClient.prototype.updateTable = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.tableClient.updateTable(request, options, callback);
    };
    BigQueryClient.prototype.deleteTable = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.tableClient.deleteTable(request, options, callback);
    };
    BigQueryClient.prototype.listTables = function (request, optionsOrCallback, callback) {
        var options;
        if (typeof optionsOrCallback === 'function' && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        this.tableClient.listTables(request, options, callback);
    };
    return BigQueryClient;
}());
exports.BigQueryClient = BigQueryClient;
