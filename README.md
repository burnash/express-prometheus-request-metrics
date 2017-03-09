# Express Prometheus Request Metrics

This is a rudimentary express middleware that provides `http_request_duration_milliseconds`
metric for Express apps.

It's mainly derived from [morgan](https://github.com/expressjs/morgan) and uses [prom-client](https://github.com/siimon/prom-client) under the hood. I made this middleware while learning how to instrument
Express apps with Prometheus metrics.

Other more feature-rich and refined libraries are:

* [jochen-schweizer/express-prom-bundle](https://github.com/jochen-schweizer/express-prom-bundle)
* [roylines/node-epimetheus](https://github.com/roylines/node-epimetheus)


## Usage

```js

var promClient = require('prom-client');
var expressPrometheus = require('express-prometheus-request-metrics');

app.configure(function () {

  // ...

  app.use(expressPrometheus(promClient));

});

app.get('/hello', function (req, res) {
  res.send('Hello World!')
});

// This is a special endpoint you need to set up
// to let Prometheus scrape the metrics:

app.get('/metrics', function(req, res) {
  res.end(promClient.register.metrics());
});

```

Run your app and query for metrics:

```sh

curl http://localhost:3000/metrics

```

You will get a text response. The `http_request_duration_milliseconds` metric is preceded by
some [default metrics](https://github.com/siimon/prom-client#default-metrics) collected
by [prom-client](https://github.com/siimon/prom-client).

```sh
# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE process_start_time_seconds gauge
process_start_time_seconds 1489022945
# HELP process_open_fds Number of open file descriptors.
# TYPE process_open_fds gauge
process_open_fds 14

# ...

# HELP http_request_duration_milliseconds Request duration in milliseconds.
# TYPE http_request_duration_milliseconds summary
http_request_duration_milliseconds{quantile="0.01",code="200",handler="/hello",method="get"} 114.4
http_request_duration_milliseconds{quantile="0.05",code="200",handler="/hello",method="get"} 143.4
http_request_duration_milliseconds{quantile="0.5",code="200",handler="/hello",method="get"} 174.75
http_request_duration_milliseconds{quantile="0.9",code="200",handler="/hello",method="get"} 267.90
http_request_duration_milliseconds{quantile="0.95",code="200",handler="/hello",method="get"} 298.79
http_request_duration_milliseconds{quantile="0.99",code="200",handler="/hello",method="get"} 728.60
http_request_duration_milliseconds{quantile="0.999",code="200",handler="/hello",method="get"} 763
http_request_duration_milliseconds_sum{method="get",handler="/hello",code="200"} 11444
http_request_duration_milliseconds_count{method="get",handler="/hello",code="200"} 58

```

## Install

```
npm install --save github:burnash/express-prometheus-request-metrics
```
