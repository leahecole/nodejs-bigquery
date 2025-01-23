'use strict';

// const {GoogleAuth} = require('google-auth-library');
// const r = require('teeny-request');
// const https = require('https');

function main() {
  const {JobServiceClient} = require('../build/src');
  const {version} = require('../package.json');

  async function queryPerf() {
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
    // const bigqueryClient = new JobServiceClient({apiEndpoint: 'grpc-bigquery.googleapis.com', fallback: false})
    const bigqueryClient = new JobServiceClient({})

    console.timeEnd('instantiate BigQuery Job client');
    console.log();

    const sqlQuery = 'SELECT 1';

    console.time('1st run query');
    const projectId = 'leah-playground'
    const queryRequest = {query: sqlQuery,
      location: 'US', 
      useLegacySql: {value: false}}
    const request = {
      projectId,
      queryRequest
    };

    let response = await bigqueryClient.query(request);
    console.timeEnd('1st run query');
    console.log('Query:', sqlQuery);
    console.log(response)
    console.log('Query:', sqlQuery);
    console.log('Job ID:', response[0].jobReference.jobId);
    console.log('Query Results:', response[0].rows[0]);
    console.log();

    console.time('2nd run query');
    response  = await bigqueryClient.query(request);
    console.timeEnd('2nd run query');
    console.log('Query:', sqlQuery);
    console.log('Job ID:', response[0].jobReference.jobId);
    console.log('Query Results:', response[0].rows[0]);
  }
  queryPerf();
}

main();

// Outputs https://github.com/googleapis/nodejs-bigquery/issues/1383#issuecomment-2218215648