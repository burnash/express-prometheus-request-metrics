# express-prometheus-request-metrics

This is a rudimentary express middleware that provides `http_request_duration_milliseconds`
metric for Express apps.

It's mainly derived from [morgan](https://github.com/expressjs/morgan) and uses [prom-client](https://github.com/siimon/prom-client) under the hood. I made this middleware while learning how to instrument
Express apps with Prometheus metrics.

Other more feature-rich and refined libraries are:

* [jochen-schweizer/express-prom-bundle](https://github.com/jochen-schweizer/express-prom-bundle)
* [roylines/node-epimetheus](https://github.com/roylines/node-epimetheus)
