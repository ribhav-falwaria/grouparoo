const nock = require("nock");
process.env.BIGQUERY_JEST_TIMESTAMP = "1602381547725";

nock("https://www.googleapis.com:443", { encodedQueryParams: true })
  .post("/oauth2/v4/token", {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: /.+/g,
  })
  .once()
  .reply(
    200,
    [
      "1f",
      "8b",
      "08",
      "00",
      "00",
      "00000002ff1dcfd97282301400d07fc9b3e314cada37a24c53202cb294fac2a4e9d55a100204119dfe7b9d9e3f3877c4388771ac6457438b5ed0c2547bcdd77e6761cde156e1e1869156aa810c3cf9c5da6d5d2e7d6c6616559ac29494a65304f0fe0aeda23511a995dcf9ccaaf078b0cfcc9d6d11766f3968c91ccdc7b80165671a1be177832762859346c7c59539b8a69b24d5e5d529e9cfed89eef0b407f0c9b62ff91c7eebb14716e3f261f9dc752f988881dd82fd41636ad6538ff8de7436d2da494813e37c104e267c3bcc46b4427015a701c6eaf4983debb6bd42ffcd4a2e021e570c6c8001fdfe0108d6e23705010000",
    ],
    [
      "Content-Type",
      "application/json; charset=UTF-8",
      "Vary",
      "Origin",
      "Vary",
      "X-Origin",
      "Vary",
      "Referer",
      "Content-Encoding",
      "gzip",
      "Date",
      "Sun, 11 Oct 2020 01:59:09 GMT",
      "Server",
      "scaffolding on HTTPServer2",
      "Cache-Control",
      "private",
      "X-XSS-Protection",
      "0",
      "X-Frame-Options",
      "SAMEORIGIN",
      "X-Content-Type-Options",
      "nosniff",
      "Alt-Svc",
      'h3-Q050=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-27=":443"; ma=2592000,h3-T051=":443"; ma=2592000,h3-T050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
      "Connection",
      "close",
      "Transfer-Encoding",
      "chunked",
    ]
  );
nock("https://bigquery.googleapis.com:443", { encodedQueryParams: true })
  .get("/bigquery/v2/projects/sample-sources/datasets/test/tables")
  .query({ prettyPrint: "false" })
  .once()
  .reply(
    200,
    [
      "1f",
      "8b",
      "08",
      "00",
      "00",
      "00",
      "00",
      "00",
      "02",
      "ff",
      "b5",
      "94",
      "5d",
      "4b",
      "c3",
      "30",
      "14",
      "86",
      "ff",
      "4b",
      "bcf5a349d7342decc2c1c0e1f042ea858848d69db5a9fd3249d151f6df3ddddc2ed48b52eb5d3879f3701eded296bcaa724d42b252c95b037a7b66e52a87a532969c13b032c13b36e76926660f8f572c8bd4dd8d17c51fb7c9748a897dda90f0a9fd1d8411d54d8d2cea1c2e4cd5e8184c68c1d8cb586a7344dcc30634943190b025b5ae3288ede2e7438cafa595060e971de648d80ff6c81d4eb6359248743d5bce31106b90565565a48a6e4cbd80d140701ad020c0f880ddd32a7997da9a97c6c0e816dfe07d7c1cc7f1b8e0c265c37c70d98dca616c9313b68783107ce2519709e6fdcd813aff6481e03e1ebeefbb5c4c1ce10cf4c0738adb8c5ec689dbbb0dcf0fe8c0364c5de1273cb2c217b4570ba2ab80711ff77fc67c6565beb050e0cf8aef3e01cdccc29ff7040000",
    ],
    [
      "ETag",
      "2E6hj8BUY/2jTiNH5TcxKg==",
      "Content-Type",
      "application/json; charset=UTF-8",
      "Vary",
      "Origin",
      "Vary",
      "X-Origin",
      "Vary",
      "Referer",
      "Content-Encoding",
      "gzip",
      "Date",
      "Sun, 11 Oct 2020 01:59:10 GMT",
      "Server",
      "ESF",
      "Cache-Control",
      "private",
      "X-XSS-Protection",
      "0",
      "X-Frame-Options",
      "SAMEORIGIN",
      "X-Content-Type-Options",
      "nosniff",
      "Alt-Svc",
      'h3-Q050=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-27=":443"; ma=2592000,h3-T051=":443"; ma=2592000,h3-T050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
      "Transfer-Encoding",
      "chunked",
    ]
  );
