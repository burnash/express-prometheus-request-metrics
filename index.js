'use strict';

var onHeaders = require('on-headers');
var onFinished = require('on-finished');

var DEFAULT_METRICS_ENDPOINT = '/metrics';

function diffTime(start, end) {
  return (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;
}

function prometheus (client, options) {
  var opts = options || {};

  var requestDuration = new client.Summary(
    'http_request_duration_milliseconds', 'Request duration in milliseconds.', ['method', 'handler', 'code']
  );

  function observe(method, handler, code, duration) {
    var labels = { method: method.toLowerCase(), handler: handler, code: code };

    requestDuration.observe(labels, duration);
  }

  // check if request / response should be skipped
  var skip = opts.skip || false;

  var metricsEnpoint = opts.metricsEnpoint || DEFAULT_METRICS_ENDPOINT;

  return function middleware (req, res, next) {
    req._startAt = undefined;
    res._startAt = undefined;

    // record request start
    recordStartTime.call(req);

    function observeRequest () {
      if (req.path === metricsEnpoint || (skip !== false && skip(req, res))) {
        return;
      }

      var duration = (req._startAt && res._startAt) ? diffTime(req._startAt, res._startAt, 0) : null;

      if (req.route && duration !== null) {
        observe(req.method, req.route.path, res.statusCode, Math.round(duration));
      }
    };

    // record response start
    onHeaders(res, recordStartTime);

    // log when response finished
    onFinished(res, observeRequest);

    next();
  }
}

function recordStartTime () {
  this._startAt = process.hrtime();
}

module.exports = prometheus;
