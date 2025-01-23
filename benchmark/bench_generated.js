'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// const {GoogleAuth} = require('google-auth-library');
// const r = require('teeny-request');
// const https = require('https');
function main() {
    var JobServiceClient = require('../build/src').JobServiceClient;
    var version = require('../package.json').version;
    function queryPerf() {
        return __awaiter(this, void 0, void 0, function () {
            var bigqueryClient, sqlQuery, projectId, queryRequest, request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Node SDK Version:', version);
                        console.log();
                        // const initAuth = `${process.env.INIT_AUTH}`.toLowerCase() === 'true';
                        // let authClient;
                        // if (initAuth) {
                        //   console.time('instantiate auth client');
                        //   authClient = new GoogleAuth({
                        //     projectId: 'aviebrantz-testing',
                        //     keyFilename:
                        //       '/Users/aviebrantz/.config/gcloud/application_default_credentials.json',
                        //   });
                        //   await authClient.getAccessToken(); // force auth init
                        //   console.timeEnd('instantiate auth client');
                        // }
                        console.time('instantiate BigQuery Job client');
                        bigqueryClient = new JobServiceClient({});
                        console.timeEnd('instantiate BigQuery Job client');
                        console.log();
                        sqlQuery = 'SELECT 1';
                        console.time('1st run query');
                        projectId = 'leah-playground';
                        queryRequest = { query: sqlQuery,
                            location: 'US',
                            useLegacySql: { value: false } };
                        request = {
                            projectId: projectId,
                            queryRequest: queryRequest
                        };
                        return [4 /*yield*/, bigqueryClient.query(request)];
                    case 1:
                        response = _a.sent();
                        console.timeEnd('1st run query');
                        console.log('Query:', sqlQuery);
                        console.log(response);
                        console.log('Query:', sqlQuery);
                        console.log('Job ID:', response[0].jobReference.jobId);
                        console.log('Query Results:', response[0].rows[0]);
                        console.log();
                        console.time('2nd run query');
                        return [4 /*yield*/, bigqueryClient.query(request)];
                    case 2:
                        response = _a.sent();
                        console.timeEnd('2nd run query');
                        console.log('Query:', sqlQuery);
                        console.log('Job ID:', response[0].jobReference.jobId);
                        console.log('Query Results:', response[0].rows[0]);
                        return [2 /*return*/];
                }
            });
        });
    }
    queryPerf();
}
main();
