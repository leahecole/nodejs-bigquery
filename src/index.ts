/*!
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import * as arrify from 'arrify';
import * as Big from 'big.js';
import * as common from '@google-cloud/common';
import {promisifyAll} from '@google-cloud/promisify';
import {paginator} from '@google-cloud/paginator';
import * as extend from 'extend';
const format = require('string-format-obj');
import * as is from 'is';
import * as request from 'request';
import * as util from 'util';
import * as uuid from 'uuid';

import {Dataset} from './dataset';
import {Job} from './job';
import {Table} from './table';

/**
 * @typedef {object} ClientConfig
 * @property {string} [projectId] The project ID from the Google Developer's
 *     Console, e.g. 'grape-spaceship-123'. We will also check the environment
 *     variable `GCLOUD_PROJECT` for your project ID. If your app is running in
 *     an environment which supports {@link https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application Application Default Credentials},
 *     your project ID will be detected automatically.
 * @property {string} [keyFilename] Full path to the a .json, .pem, or .p12 key
 *     downloaded from the Google Developers Console. If you provide a path to a
 *     JSON file, the `projectId` option above is not necessary. NOTE: .pem and
 *     .p12 require you to specify the `email` option as well.
 * @property {string} [token] An OAUTH access token. If provided, we will not
 *     manage fetching, re-using, and re-minting access tokens.
 * @property {string} [email] Account email address. Required when using a .pem
 *     or .p12 keyFilename.
 * @property {object} [credentials] Credentials object.
 * @property {string} [credentials.client_email]
 * @property {string} [credentials.private_key]
 * @property {boolean} [autoRetry=true] Automatically retry requests if the
 *     response is related to rate limits or certain intermittent server errors.
 *     We will exponentially backoff subsequent requests by default.
 * @property {number} [maxRetries=3] Maximum number of automatic retries
 *     attempted before returning the error.
 * @property {Constructor} [promise] Custom promise module to use instead of
 *     native Promises.
 * @property {string} [location] The geographic location of all datasets and
 *     jobs referenced and created through the client.
 * @property {string[]} [scopes] Additional OAuth scopes to use in requests. For
 *     example, to access an external data source, you may need the
 *     `https://www.googleapis.com/auth/drive.readonly` scope.
 */

/**
 * In the following examples from this page and the other modules (`Dataset`,
 * `Table`, etc.), we are going to be using a dataset from
 * [data.gov](http://goo.gl/f2SXcb) of higher education institutions.
 *
 * We will create a table with the correct schema, import the public CSV file
 * into that table, and query it for data.
 *
 * @class
 *
 * @see [What is BigQuery?]{@link https://cloud.google.com/bigquery/what-is-bigquery}
 *
 * @param {ClientConfig} options Configuration options.
 *
 * @example <caption>Install the client library with <a href="https://www.npmjs.com/">npm</a>:</caption>
 * npm install --save @google-cloud/bigquery
 *
 * @example <caption>Import the client library</caption>
 * const BigQuery = require('@google-cloud/bigquery');
 *
 * @example <caption>Create a client that uses <a href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application Default Credentials (ADC)</a>:</caption>
 * const bigquery = new BigQuery();
 *
 * @example <caption>Create a client with <a href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit credentials</a>:</caption>
 * const bigquery = new BigQuery({
 *   projectId: 'your-project-id',
 *   keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:bigquery_quickstart
 * Full quickstart example:
 */
function BigQuery(options) {
  options = options || {};
  const config = {
    baseUrl: 'https://www.googleapis.com/bigquery/v2',
    scopes: ['https://www.googleapis.com/auth/bigquery'],
    packageJson: require('../../package.json'),
    requestModule: request,
  };

  if (options.scopes) {
    config.scopes = config.scopes.concat(options.scopes);
  }

  common.Service.call(this, config, options);

  /**
   * @name BigQuery#location
   * @type {string}
   */
  this.location = options.location;
}

util.inherits(BigQuery, common.Service);

/**
 * Merge a rowset returned from the API with a table schema.
 *
 * @private
 *
 * @param {object} schema
 * @param {array} rows
 * @returns {array} Fields using their matching names from the table's schema.
 */
(BigQuery as any).mergeSchemaWithRows_ = BigQuery.prototype.mergeSchemaWithRows_ = function(
  schema,
  rows
) {
  return arrify(rows)
    .map(mergeSchema)
    .map(flattenRows);

  function mergeSchema(row) {
    return row.f.map(function(field, index) {
      const schemaField = schema.fields[index];
      let value = field.v;

      if (schemaField.mode === 'REPEATED') {
        value = value.map(function(val) {
          return convert(schemaField, val.v);
        });
      } else {
        value = convert(schemaField, value);
      }

      const fieldObject = {};
      fieldObject[schemaField.name] = value;
      return fieldObject;
    });
  }

  function convert(schemaField, value) {
    if (is.nil(value)) {
      return value;
    }

    switch (schemaField.type) {
      case 'BOOLEAN':
      case 'BOOL': {
        value = value.toLowerCase() === 'true';
        break;
      }
      case 'BYTES': {
        value = Buffer.from(value, 'base64');
        break;
      }
      case 'FLOAT':
      case 'FLOAT64': {
        value = parseFloat(value);
        break;
      }
      case 'INTEGER':
      case 'INT64': {
        value = parseInt(value, 10);
        break;
      }
      case 'NUMERIC': {
        value = new Big(value);
        break;
      }
      case 'RECORD': {
        value = (BigQuery as any).mergeSchemaWithRows_(schemaField, value).pop();
        break;
      }
      case 'DATE': {
        value = (BigQuery as any).date(value);
        break;
      }
      case 'DATETIME': {
        value = (BigQuery as any).datetime(value);
        break;
      }
      case 'TIME': {
        value = (BigQuery as any).time(value);
        break;
      }
      case 'TIMESTAMP': {
        value = (BigQuery as any).timestamp(new Date(value * 1000));
        break;
      }
    }

    return value;
  }

  function flattenRows(rows) {
    return rows.reduce(function(acc, row) {
      const key = Object.keys(row)[0];
      acc[key] = row[key];
      return acc;
    }, {});
  }
};

/**
 * @method BigQuery.date
 * @param {object|string} value The date. If a string, this should be in the
 *     format the API describes: `YYYY-[M]M-[D]D`.
 *     Otherwise, provide an object.
 * @param {string|number} value.year Four digits.
 * @param {string|number} value.month One or two digits.
 * @param {string|number} value.day One or two digits.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const date = BigQuery.date('2017-01-01');
 *
 * //-
 * // Alternatively, provide an object.
 * //-
 * const date2 = BigQuery.date({
 *   year: 2017,
 *   month: 1,
 *   day: 1
 * });
 */

/**
 * The `DATE` type represents a logical calendar date, independent of time zone.
 * It does not represent a specific 24-hour time period. Rather, a given DATE
 * value represents a different 24-hour period when interpreted in different
 * time zones, and may represent a shorter or longer day during Daylight Savings
 * Time transitions.
 *
 * @method BigQuery#date
 * @param {object|string} value The date. If a string, this should be in the
 *     format the API describes: `YYYY-[M]M-[D]D`.
 *     Otherwise, provide an object.
 * @param {string|number} value.year Four digits.
 * @param {string|number} value.month One or two digits.
 * @param {string|number} value.day One or two digits.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 * const date = bigquery.date('2017-01-01');
 *
 * //-
 * // Alternatively, provide an object.
 * //-
 * const date2 = bigquery.date({
 *   year: 2017,
 *   month: 1,
 *   day: 1
 * });
 */
(BigQuery as any).date = BigQuery.prototype.date = function BigQueryDate(value) {
  if (!(this instanceof (BigQuery as any).date)) {
    return new (BigQuery as any).date(value);
  }

  if (is.object(value)) {
    value = (BigQuery as any).datetime(value).value;
  }

  this.value = value;
};

/**
 * A `DATETIME` data type represents a point in time. Unlike a `TIMESTAMP`,
 * this does not refer to an absolute instance in time. Instead, it is the civil
 * time, or the time that a user would see on a watch or calendar.
 *
 * @method BigQuery.datetime
 * @param {object|string} value The time. If a string, this should be in the
 *     format the API describes: `YYYY-[M]M-[D]D[ [H]H:[M]M:[S]S[.DDDDDD]]`.
 *     Otherwise, provide an object.
 * @param {string|number} value.year Four digits.
 * @param {string|number} value.month One or two digits.
 * @param {string|number} value.day One or two digits.
 * @param {string|number} [value.hours] One or two digits (`00` - `23`).
 * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
 * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
 * @param {string|number} [value.fractional] Up to six digits for microsecond
 *     precision.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const datetime = BigQuery.datetime('2017-01-01 13:00:00');
 *
 * //-
 * // Alternatively, provide an object.
 * //-
 * const datetime = BigQuery.datetime({
 *   year: 2017,
 *   month: 1,
 *   day: 1,
 *   hours: 14,
 *   minutes: 0,
 *   seconds: 0
 * });
 */

/**
 * A `DATETIME` data type represents a point in time. Unlike a `TIMESTAMP`,
 * this does not refer to an absolute instance in time. Instead, it is the civil
 * time, or the time that a user would see on a watch or calendar.
 *
 * @method BigQuery#datetime
 * @param {object|string} value The time. If a string, this should be in the
 *     format the API describes: `YYYY-[M]M-[D]D[ [H]H:[M]M:[S]S[.DDDDDD]]`.
 *     Otherwise, provide an object.
 * @param {string|number} value.year Four digits.
 * @param {string|number} value.month One or two digits.
 * @param {string|number} value.day One or two digits.
 * @param {string|number} [value.hours] One or two digits (`00` - `23`).
 * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
 * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
 * @param {string|number} [value.fractional] Up to six digits for microsecond
 *     precision.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 * const datetime = bigquery.datetime('2017-01-01 13:00:00');
 *
 * //-
 * // Alternatively, provide an object.
 * //-
 * const datetime = bigquery.datetime({
 *   year: 2017,
 *   month: 1,
 *   day: 1,
 *   hours: 14,
 *   minutes: 0,
 *   seconds: 0
 * });
 */
(BigQuery as any).datetime = BigQuery.prototype.datetime = function BigQueryDatetime(
  value
) {
  if (!(this instanceof (BigQuery as any).datetime)) {
    return new (BigQuery as any).datetime(value);
  }

  if (is.object(value)) {
    let time;

    if (value.hours) {
      time = (BigQuery as any).time(value).value;
    }

    value = format('{y}-{m}-{d}{time}', {
      y: value.year,
      m: value.month,
      d: value.day,
      time: time ? ' ' + time : '',
    });
  } else {
    value = value.replace(/^(.*)T(.*)Z$/, '$1 $2');
  }

  this.value = value;
};

/**
 * A `TIME` data type represents a time, independent of a specific date.
 *
 * @method BigQuery.time
 * @param {object|string} value The time. If a string, this should be in the
 *     format the API describes: `[H]H:[M]M:[S]S[.DDDDDD]`. Otherwise, provide
 *     an object.
 * @param {string|number} [value.hours] One or two digits (`00` - `23`).
 * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
 * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
 * @param {string|number} [value.fractional] Up to six digits for microsecond
 *     precision.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const time = BigQuery.time('14:00:00'); // 2:00 PM
 *
 * //-
 * // Alternatively, provide an object.
 * //-
 * const time = BigQuery.time({
 *   hours: 14,
 *   minutes: 0,
 *   seconds: 0
 * });
 */

/**
 * A `TIME` data type represents a time, independent of a specific date.
 *
 * @method BigQuery#time
 * @param {object|string} value The time. If a string, this should be in the
 *     format the API describes: `[H]H:[M]M:[S]S[.DDDDDD]`. Otherwise, provide
 *     an object.
 * @param {string|number} [value.hours] One or two digits (`00` - `23`).
 * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
 * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
 * @param {string|number} [value.fractional] Up to six digits for microsecond
 *     precision.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 * const time = bigquery.time('14:00:00'); // 2:00 PM
 *
 * //-
 * // Alternatively, provide an object.
 * //-
 * const time = bigquery.time({
 *   hours: 14,
 *   minutes: 0,
 *   seconds: 0
 * });
 */
(BigQuery as any).time = BigQuery.prototype.time = function BigQueryTime(value) {
  if (!(this instanceof (BigQuery as any).time)) {
    return new (BigQuery as any).time(value);
  }

  if (is.object(value)) {
    value = format('{h}:{m}:{s}{f}', {
      h: value.hours,
      m: value.minutes || 0,
      s: value.seconds || 0,
      f: is.defined(value.fractional) ? '.' + value.fractional : '',
    });
  }

  this.value = value;
};

/**
 * A timestamp represents an absolute point in time, independent of any time
 * zone or convention such as Daylight Savings Time.
 *
 * @method BigQuery.timestamp
 * @param {date} value The time.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const timestamp = BigQuery.timestamp(new Date());
 */

/**
 * A timestamp represents an absolute point in time, independent of any time
 * zone or convention such as Daylight Savings Time.
 *
 * @method BigQuery#timestamp
 * @param {date} value The time.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 * const timestamp = bigquery.timestamp(new Date());
 */
(BigQuery as any).timestamp = BigQuery.prototype.timestamp = function BigQueryTimestamp(
  value
) {
  if (!(this instanceof (BigQuery as any).timestamp)) {
    return new (BigQuery as any).timestamp(value);
  }

  this.value = new Date(value).toJSON();
};

/**
 * Detect a value's type.
 *
 * @private
 *
 * @throws {error} If the type could not be detected.
 *
 * @see [Data Type]{@link https://cloud.google.com/bigquery/data-types}
 *
 * @param {*} value The value.
 * @returns {string} The type detected from the value.
 */
(BigQuery as any).getType_ = function(value) {
  let typeName;

  if (value instanceof (BigQuery as any).date) {
    typeName = 'DATE';
  } else if (value instanceof (BigQuery as any).datetime) {
    typeName = 'DATETIME';
  } else if (value instanceof (BigQuery as any).time) {
    typeName = 'TIME';
  } else if (value instanceof (BigQuery as any).timestamp) {
    typeName = 'TIMESTAMP';
  } else if (value instanceof Buffer) {
    typeName = 'BYTES';
  } else if (value instanceof Big) {
    typeName = 'NUMERIC';
  } else if (is.array(value)) {
    return {
      type: 'ARRAY',
      arrayType: (BigQuery as any).getType_(value[0]),
    };
  } else if (is.bool(value)) {
    typeName = 'BOOL';
  } else if (is.number(value)) {
    typeName = value % 1 === 0 ? 'INT64' : 'FLOAT64';
  } else if (is.object(value)) {
    return {
      type: 'STRUCT',
      structTypes: Object.keys(value).map(function(prop) {
        return {
          name: prop,
          type: (BigQuery as any).getType_(value[prop]),
        };
      }),
    };
  } else if (is.string(value)) {
    typeName = 'STRING';
  }

  if (!typeName) {
    throw new Error(
      [
        'This value could not be translated to a BigQuery data type.',
        value,
      ].join('\n')
    );
  }

  return {
    type: typeName,
  };
};

/**
 * Convert a value into a `queryParameter` object.
 *
 * @private
 *
 * @see [Jobs.query API Reference Docs (see `queryParameters`)]{@link https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query#request-body}
 *
 * @param {*} value The value.
 * @returns {object} A properly-formed `queryParameter` object.
 */
(BigQuery as any).valueToQueryParameter_ = function(value) {
  if (is.date(value)) {
    value = (BigQuery as any).timestamp(value);
  }

  const queryParameter = {
    parameterType: (BigQuery as any).getType_(value),
    parameterValue: {} as any,
  };

  const typeName = queryParameter.parameterType.type;

  if (typeName.indexOf('TIME') > -1 || typeName.indexOf('DATE') > -1) {
    value = value.value;
  }

  if (typeName === 'ARRAY') {
    queryParameter.parameterValue.arrayValues = value.map(function(value) {
      return {
        value: value,
      };
    });
  } else if (typeName === 'STRUCT') {
    queryParameter.parameterValue.structValues = Object.keys(value).reduce(
      function(structValues, prop) {
        const nestedQueryParameter = (BigQuery as any).valueToQueryParameter_(value[prop]);
        structValues[prop] = nestedQueryParameter.parameterValue;
        return structValues;
      },
      {}
    );
  } else {
    queryParameter.parameterValue.value = value;
  }

  return queryParameter;
};

/**
 * Create a dataset.
 *
 * @see [Datasets: insert API Documentation]{@link https://cloud.google.com/bigquery/docs/reference/v2/datasets/insert}
 *
 * @param {string} id ID of the dataset to create.
 * @param {object} [options] See a
 *     [Dataset resource](https://cloud.google.com/bigquery/docs/reference/v2/datasets#resource).
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while making this request
 * @param {Dataset} callback.dataset The newly created dataset
 * @param {object} callback.apiResponse The full API response.
 * @returns {Promise}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * bigquery.createDataset('my-dataset', function(err, dataset, apiResponse) {});
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * bigquery.createDataset('my-dataset').then(function(data) {
 *   const dataset = data[0];
 *   const apiResponse = data[1];
 * });
 */
BigQuery.prototype.createDataset = function(id, options, callback) {
  const that = this;

  if (is.fn(options)) {
    callback = options;
    options = {};
  }

  this.request(
    {
      method: 'POST',
      uri: '/datasets',
      json: extend(
        true,
        {
          location: this.location,
        },
        options,
        {
          datasetReference: {
            datasetId: id,
          },
        }
      ),
    },
    function(err, resp) {
      if (err) {
        callback(err, null, resp);
        return;
      }

      const dataset = that.dataset(id);
      dataset.metadata = resp;

      callback(null, dataset, resp);
    }
  );
};

/**
 * Run a query as a job. No results are immediately returned. Instead, your
 * callback will be executed with a {@link Job} object that you must
 * ping for the results. See the Job documentation for explanations of how to
 * check on the status of the job.
 *
 * @see [Jobs: insert API Documentation]{@link https://cloud.google.com/bigquery/docs/reference/v2/jobs/insert}
 *
 * @param {object|string} options The configuration object. This must be in
 *     the format of the [`configuration.query`](http://goo.gl/wRpHvR) property
 *     of a Jobs resource. If a string is provided, this is used as the query
 *     string, and all other options are defaulted.
 * @param {Table} [options.destination] The table to save the
 *     query's results to. If omitted, a new table will be created.
 * @param {boolean} [options.dryRun] If set, don't actually run this job. A
 *     valid query will update the job with processing statistics. These can be
 *     accessed via `job.metadata`.
 * @param {string} [options.location] The geographic location of the job.
 *     Required except for US and EU.
 * @param {string} [options.jobId] Custom job id.
 * @param {string} [options.jobPrefix] Prefix to apply to the job id.
 * @param {string} options.query A query string, following the BigQuery query
 *     syntax, of the query to execute.
 * @param {boolean} [options.useLegacySql=false] Option to use legacy sql syntax.
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while making this request.
 * @param {Job} callback.job The newly created job for your
       query.
 * @param {object} callback.apiResponse The full API response.
 * @returns {Promise}
 *
 * @throws {Error} If a query is not specified.
 * @throws {Error} If a Table is not provided as a destination.
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * const query = 'SELECT url FROM `publicdata.samples.github_nested` LIMIT 100';
 *
 * //-
 * // You may pass only a query string, having a new table created to store the
 * // results of the query.
 * //-
 * bigquery.createQueryJob(query, function(err, job) {});
 *
 * //-
 * // You can also control the destination table by providing a
 * // {@link Table} object.
 * //-
 * bigquery.createQueryJob({
 *   destination: bigquery.dataset('higher_education').table('institutions'),
 *   query: query
 * }, function(err, job) {});
 *
 * //-
 * // After you have run `createQueryJob`, your query will execute in a job. Your
 * // callback is executed with a {@link Job} object so that you may
 * // check for the results.
 * //-
 * bigquery.createQueryJob(query, function(err, job) {
 *   if (!err) {
 *     job.getQueryResults(function(err, rows, apiResponse) {});
 *   }
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * bigquery.createQueryJob(query).then(function(data) {
 *   const job = data[0];
 *   const apiResponse = data[1];
 *
 *   return job.getQueryResults();
 * });
 */
BigQuery.prototype.createQueryJob = function(options, callback) {
  if (is.string(options)) {
    options = {
      query: options,
    };
  }

  if (!options || !options.query) {
    throw new Error('A SQL query string is required.');
  }

  const query = extend(
    true,
    {
      useLegacySql: false,
    },
    options
  );

  if (options.destination) {
    if (!(options.destination instanceof Table)) {
      throw new Error('Destination must be a Table object.');
    }

    query.destinationTable = {
      datasetId: options.destination.dataset.id,
      projectId: options.destination.dataset.bigQuery.projectId,
      tableId: options.destination.id,
    };

    delete query.destination;
  }

  if (query.params) {
    query.parameterMode = is.array(query.params) ? 'positional' : 'named';

    if (query.parameterMode === 'named') {
      query.queryParameters = [];

      for (const namedParamater in query.params) {
        const value = query.params[namedParamater];
        const queryParameter = (BigQuery as any).valueToQueryParameter_(value);
        queryParameter.name = namedParamater;
        query.queryParameters.push(queryParameter);
      }
    } else {
      query.queryParameters = query.params.map((BigQuery as any).valueToQueryParameter_);
    }

    delete query.params;
  }

  const reqOpts = {
    configuration: {
      query: query,
    } as any,
  } as any;

  if (query.dryRun) {
    reqOpts.configuration.dryRun = query.dryRun;
    delete query.dryRun;
  }

  if (query.jobPrefix) {
    reqOpts.jobPrefix = query.jobPrefix;
    delete query.jobPrefix;
  }

  if (query.location) {
    reqOpts.location = query.location;
    delete query.location;
  }

  if (query.jobId) {
    reqOpts.jobId = query.jobId;
    delete query.jobId;
  }

  this.createJob(reqOpts, callback);
};

/**
 * Run a query scoped to your project as a readable object stream.
 *
 * @param {object} query Configuration object. See {@link Query} for a complete
 *     list of options.
 * @returns {stream}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * const query = 'SELECT url FROM `publicdata.samples.github_nested` LIMIT 100';
 *
 * bigquery.createQueryStream(query)
 *   .on('error', console.error)
 *   .on('data', function(row) {
 *     // row is a result from your query.
 *   })
 *   .on('end', function() {
 *     // All rows retrieved.
 *   });
 *
 * //-
 * // If you anticipate many results, you can end a stream early to prevent
 * // unnecessary processing and API requests.
 * //-
 * bigquery.createQueryStream(query)
 *   .on('data', function(row) {
 *     this.end();
 *   });
 */
BigQuery.prototype.createQueryStream = paginator.streamify(
  'queryAsStream_'
);

/**
 * Creates a job. Typically when creating a job you'll have a very specific task
 * in mind. For this we recommend one of the following methods:
 *
 * - {@link BigQuery#createQueryJob}
 * - {@link Table#createCopyJob}
 * - {@link Table#createCopyFromJob}
 * - {@link Table#createExtractJob}
 * - {@link Table#createLoadJob}
 *
 * However in the event you need a finer level of control over the job creation,
 * you can use this method to pass in a raw [Job resource](https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs)
 * object.
 *
 * @see [Jobs Overview]{@link https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs}
 * @see [Jobs: insert API Documentation]{@link https://cloud.google.com/bigquery/docs/reference/v2/jobs/insert}
 *
 * @param {object} options Object in the form of a [Job resource](https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs);
 * @param {string} [options.jobId] Custom job id.
 * @param {string} [options.jobPrefix] Prefix to apply to the job id.
 * @param {string} [options.location] The geographic location of the job.
 *     Required except for US and EU.
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while making this request.
 * @param {Job} callback.job The newly created job.
 * @param {object} callback.apiResponse The full API response.
 * @returns {Promise}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * const options = {
 *   configuration: {
 *     query: {
 *       query: 'SELECT url FROM `publicdata.samples.github_nested` LIMIT 100'
 *     }
 *   }
 * };
 *
 * bigquery.createJob(options, function(err, job) {
 *   if (err) {
 *     // Error handling omitted.
 *   }
 *
 *   job.getQueryResults(function(err, rows) {});
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * bigquery.createJob(options).then(function(data) {
 *   const job = data[0];
 *
 *   return job.getQueryResults();
 * });
 */
BigQuery.prototype.createJob = function(options, callback) {
  const self = this;

  const reqOpts = extend({}, options);
  let jobId = reqOpts.jobId || uuid.v4();

  if (reqOpts.jobId) {
    delete reqOpts.jobId;
  }

  if (reqOpts.jobPrefix) {
    jobId = reqOpts.jobPrefix + jobId;
    delete reqOpts.jobPrefix;
  }

  reqOpts.jobReference = {
    projectId: this.projectId,
    jobId: jobId,
    location: this.location,
  };

  if (options.location) {
    reqOpts.jobReference.location = options.location;
    delete reqOpts.location;
  }

  this.request(
    {
      method: 'POST',
      uri: '/jobs',
      json: reqOpts,
    },
    function(err, resp) {
      if (err) {
        callback(err, null, resp);
        return;
      }

      if (resp.status.errors) {
        err = new common.util.ApiError({
          errors: resp.status.errors,
          response: resp,
        } as any);
      }

      const job = self.job(jobId, {
        location: resp.jobReference.location,
      });

      job.metadata = resp;
      callback(err, job, resp);
    }
  );
};

/**
 * Create a reference to a dataset.
 *
 * @param {string} id ID of the dataset.
 * @param {object} [options] Dataset options.
 * @param {string} [options.location] The geographic location of the dataset.
 *      Required except for US and EU.
 * @returns {Dataset}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 * const dataset = bigquery.dataset('higher_education');
 */
BigQuery.prototype.dataset = function(id, options) {
  if (this.location) {
    options = extend({location: this.location}, options);
  }

  return new Dataset(this, id, options);
};

/**
 * List all or some of the datasets in your project.
 *
 * @see [Datasets: list API Documentation]{@link https://cloud.google.com/bigquery/docs/reference/v2/datasets/list}
 *
 * @param {object} [options] Configuration object.
 * @param {boolean} [options.all] List all datasets, including hidden ones.
 * @param {boolean} [options.autoPaginate] Have pagination handled automatically.
 *     Default: true.
 * @param {number} [options.maxApiCalls] Maximum number of API calls to make.
 * @param {number} [options.maxResults] Maximum number of results to return.
 * @param {string} [options.pageToken] Token returned from a previous call, to
 *     request the next page of results.
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while making this request
 * @param {Dataset[]} callback.datasets The list of datasets in your project.
 * @returns {Promise}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * bigquery.getDatasets(function(err, datasets) {
 *   if (!err) {
 *     // datasets is an array of Dataset objects.
 *   }
 * });
 *
 * //-
 * // To control how many API requests are made and page through the results
 * // manually, set `autoPaginate` to `false`.
 * //-
 * function manualPaginationCallback(err, datasets, nextQuery, apiResponse) {
 *   if (nextQuery) {
 *     // More results exist.
 *     bigquery.getDatasets(nextQuery, manualPaginationCallback);
 *   }
 * }
 *
 * bigquery.getDatasets({
 *   autoPaginate: false
 * }, manualPaginationCallback);
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * bigquery.getDatasets().then(function(datasets) {});
 */
BigQuery.prototype.getDatasets = function(options, callback) {
  const that = this;

  if (is.fn(options)) {
    callback = options;
    options = {};
  }

  options = options || {};

  this.request(
    {
      uri: '/datasets',
      qs: options,
    },
    function(err, resp) {
      if (err) {
        callback(err, null, null, resp);
        return;
      }

      let nextQuery = null;

      if (resp.nextPageToken) {
        nextQuery = extend({}, options, {
          pageToken: resp.nextPageToken,
        });
      }

      const datasets = (resp.datasets || []).map(function(dataset) {
        const ds = that.dataset(dataset.datasetReference.datasetId, {
          location: dataset.location,
        });

        ds.metadata = dataset;
        return ds;
      });

      callback(null, datasets, nextQuery, resp);
    }
  );
};

/**
 * List all or some of the {@link Dataset} objects in your project as
 * a readable object stream.
 *
 * @param {object} [options] Configuration object. See
 *     {@link BigQuery#getDatasets} for a complete list of options.
 * @returns {stream}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * bigquery.getDatasetsStream()
 *   .on('error', console.error)
 *   .on('data', function(dataset) {
 *     // dataset is a Dataset object.
 *   })
 *   .on('end', function() {
 *     // All datasets retrieved.
 *   });
 *
 * //-
 * // If you anticipate many results, you can end a stream early to prevent
 * // unnecessary processing and API requests.
 * //-
 * bigquery.getDatasetsStream()
 *   .on('data', function(dataset) {
 *     this.end();
 *   });
 */
BigQuery.prototype.getDatasetsStream = paginator.streamify(
  'getDatasets'
);

/**
 * Get all of the jobs from your project.
 *
 * @see [Jobs: list API Documentation]{@link https://cloud.google.com/bigquery/docs/reference/v2/jobs/list}
 *
 * @param {object} [options] Configuration object.
 * @param {boolean} [options.allUsers] Display jobs owned by all users in the
 *     project.
 * @param {boolean} [options.autoPaginate] Have pagination handled
 *     automatically. Default: true.
 * @param {number} [options.maxApiCalls] Maximum number of API calls to make.
 * @param {number} [options.maxResults] Maximum number of results to return.
 * @param {string} [options.pageToken] Token returned from a previous call, to
 *     request the next page of results.
 * @param {string} [options.projection] Restrict information returned to a set
 *     of selected fields. Acceptable values are "full", for all job data, and
 *     "minimal", to not include the job configuration.
 * @param {string} [options.stateFilter] Filter for job state. Acceptable
 *     values are "done", "pending", and "running". Sending an array to this
 *     option performs a disjunction.
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while making this request
 * @param {Job[]} callback.jobs The list of jobs in your
 *     project.
 * @returns {Promise}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * bigquery.getJobs(function(err, jobs) {
 *   if (!err) {
 *     // jobs is an array of Job objects.
 *   }
 * });
 *
 * //-
 * // To control how many API requests are made and page through the results
 * // manually, set `autoPaginate` to `false`.
 * //-
 * function manualPaginationCallback(err, jobs, nextQuery, apiRespose) {
 *   if (nextQuery) {
 *     // More results exist.
 *     bigquery.getJobs(nextQuery, manualPaginationCallback);
 *   }
 * }
 *
 * bigquery.getJobs({
 *   autoPaginate: false
 * }, manualPaginationCallback);
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * bigquery.getJobs().then(function(data) {
 *   const jobs = data[0];
 * });
 */
BigQuery.prototype.getJobs = function(options, callback) {
  const that = this;

  if (is.fn(options)) {
    callback = options;
    options = {};
  }

  options = options || {};

  this.request(
    {
      uri: '/jobs',
      qs: options,
      useQuerystring: true,
    },
    function(err, resp) {
      if (err) {
        callback(err, null, null, resp);
        return;
      }

      let nextQuery = null;

      if (resp.nextPageToken) {
        nextQuery = extend({}, options, {
          pageToken: resp.nextPageToken,
        });
      }

      const jobs = (resp.jobs || []).map(function(jobObject) {
        const job = that.job(jobObject.jobReference.jobId, {
          location: jobObject.jobReference.location,
        });

        job.metadata = jobObject;
        return job;
      });

      callback(null, jobs, nextQuery, resp);
    }
  );
};

/**
 * List all or some of the {@link Job} objects in your project as a
 * readable object stream.
 *
 * @param {object} [options] Configuration object. See
 *     {@link BigQuery#getJobs} for a complete list of options.
 * @returns {stream}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * bigquery.getJobsStream()
 *   .on('error', console.error)
 *   .on('data', function(job) {
 *     // job is a Job object.
 *   })
 *   .on('end', function() {
 *     // All jobs retrieved.
 *   });
 *
 * //-
 * // If you anticipate many results, you can end a stream early to prevent
 * // unnecessary processing and API requests.
 * //-
 * bigquery.getJobsStream()
 *   .on('data', function(job) {
 *     this.end();
 *   });
 */
BigQuery.prototype.getJobsStream = paginator.streamify('getJobs');

/**
 * Create a reference to an existing job.
 *
 * @param {string} id ID of the job.
 * @param {object} [options] Configuration object.
 * @param {string} [options.location] The geographic location of the job.
 *      Required except for US and EU.
 * @returns {Job}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * const myExistingJob = bigquery.job('job-id');
 */
BigQuery.prototype.job = function(id, options) {
  if (this.location) {
    options = extend({location: this.location}, options);
  }

  return new Job(this, id, options);
};

/**
 * Run a query scoped to your project. For manual pagination please refer to
 * {@link BigQuery#createQueryJob}.
 *
 * @see [Jobs: query API Documentation]{@link https://cloud.google.com/bigquery/docs/reference/v2/jobs/query}
 *
 * @param {string|object} query A string SQL query or configuration object.
 *     For all available options, see
 *     [Jobs: query request body](https://cloud.google.com/bigquery/docs/reference/v2/jobs/query#request-body).
 * @param {string} [query.location] The geographic location of the job.
 *     Required except for US and EU.
 * @param {string} [query.jobId] Custom id for the underlying job.
 * @param {string} [query.jobPrefix] Prefix to apply to the underlying job id.
 * @param {object|Array<*>} query.params For positional SQL parameters, provide
 *     an array of values. For named SQL parameters, provide an object which
 *     maps each named parameter to its value. The supported types are integers,
 *     floats, {@link BigQuery#date} objects, {@link BigQuery#datetime}
 *     objects, {@link BigQuery#time} objects, {@link BigQuery#timestamp}
 *     objects, Strings, Booleans, and Objects.
 * @param {string} query.query A query string, following the BigQuery query
 *     syntax, of the query to execute.
 * @param {boolean} [query.useLegacySql=false] Option to use legacy sql syntax.
 * @param {object} [options] Configuration object for query results.
 * @param {number} [options.maxResults] Maximum number of results to read.
 * @param {number} [options.timeoutMs] How long to wait for the query to
 *     complete, in milliseconds, before returning. Default is to return
 *     immediately. If the timeout passes before the job completes, the request
 *     will fail with a `TIMEOUT` error.
 * @param {function} [callback] The callback function.
 * @param {?error} callback.err An error returned while making this request
 * @param {array} callback.rows The list of results from your query.
 * @returns {Promise}
 *
 * @example
 * const BigQuery = require('@google-cloud/bigquery');
 * const bigquery = new BigQuery();
 *
 * const query = 'SELECT url FROM `publicdata.samples.github_nested` LIMIT 100';
 *
 * bigquery.query(query, function(err, rows) {
 *   if (!err) {
 *     // rows is an array of results.
 *   }
 * });
 *
 * //-
 * // Positional SQL parameters are supported.
 * //-
 * bigquery.query({
 *   query: [
 *     'SELECT url',
 *     'FROM `publicdata.samples.github_nested`',
 *     'WHERE repository.owner = ?'
 *   ].join(' '),
 *
 *   params: [
 *     'google'
 *   ]
 * }, function(err, rows) {});
 *
 * //-
 * // Or if you prefer to name them, that's also supported.
 * //-
 * bigquery.query({
 *   query: [
 *     'SELECT url',
 *     'FROM `publicdata.samples.github_nested`',
 *     'WHERE repository.owner = @owner'
 *   ].join(' '),

 *   params: {
 *     owner: 'google'
 *   }
 * }, function(err, rows) {});
 *
 * //-
 * // If you need to use a `DATE`, `DATETIME`, `TIME`, or `TIMESTAMP` type in
 * // your query, see {@link BigQuery#date}, {@link BigQuery#datetime},
 * // {@link BigQuery#time}, and {@link BigQuery#timestamp}.
 * //-
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * bigquery.query(query).then(function(data) {
 *   const rows = data[0];
 * });
 */
BigQuery.prototype.query = function(query, options, callback) {
  if (is.fn(options)) {
    callback = options;
    options = {};
  }

  this.createQueryJob(query, function(err, job, resp) {
    if (err) {
      callback(err, null, resp);
      return;
    }

    if (query.dryRun) {
      callback(null, [], resp);
      return;
    }

    job.getQueryResults(options, callback);
  });
};

/**
 * This method will be called by `createQueryStream()`. It is required to
 * properly set the `autoPaginate` option value.
 *
 * @private
 */
BigQuery.prototype.queryAsStream_ = function(query, callback) {
  this.query(query, {autoPaginate: false}, callback);
};

/*! Developer Documentation
 *
 * These methods can be auto-paginated.
 */
paginator.extend(BigQuery, ['getDatasets', 'getJobs']);

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(BigQuery, {
  exclude: ['dataset', 'date', 'datetime', 'job', 'time', 'timestamp'],
});

/**
 * {@link Dataset} class.
 *
 * @name BigQuery.Dataset
 * @see Dataset
 * @type {constructor}
 */
(BigQuery as any).Dataset = Dataset;

/**
 * {@link Job} class.
 *
 * @name BigQuery.Job
 * @see Job
 * @type {constructor}
 */
(BigQuery as any).Job = Job;

/**
 * {@link Table} class.
 *
 * @name BigQuery.Table
 * @see Table
 * @type {constructor}
 */
(BigQuery as any).Table = Table;

/**
 * The default export of the `@google-cloud/bigquery` package is the {@link BigQuery}
 * class.
 *
 * See {@link BigQuery} and {@link ClientConfig} for client methods and
 * configuration options.
 *
 * @module {constructor} @google-cloud/bigquery
 * @alias nodejs-bigquery
 *
 * @example <caption>Install the client library with <a href="https://www.npmjs.com/">npm</a>:</caption>
 * npm install --save @google-cloud/bigquery
 *
 * @example <caption>Import the client library</caption>
 * const BigQuery = require('@google-cloud/bigquery');
 *
 * @example <caption>Create a client that uses <a href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application Default Credentials (ADC)</a>:</caption>
 * const bigquery = new BigQuery();
 *
 * @example <caption>Create a client with <a href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit credentials</a>:</caption>
 * const bigquery = new BigQuery({
 *   projectId: 'your-project-id',
 *   keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:bigquery_quickstart
 * Full quickstart example:
 */
module.exports = BigQuery;