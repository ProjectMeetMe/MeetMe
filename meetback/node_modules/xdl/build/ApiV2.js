'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiV2Error = undefined;

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _es6Error;

function _load_es6Error() {
  return _es6Error = _interopRequireDefault(require('es6-error'));
}

var _querystring = _interopRequireDefault(require('querystring'));

var _axios;

function _load_axios() {
  return _axios = _interopRequireDefault(require('axios'));
}

var _idx;

function _load_idx() {
  return _idx = _interopRequireDefault(require('idx'));
}

var _Config;

function _load_Config() {
  return _Config = _interopRequireDefault(require('./Config'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// These aren't constants because some commands switch between staging and prod
function _rootBaseUrl() {
  return `${(_Config || _load_Config()).default.api.scheme}://${(_Config || _load_Config()).default.api.host}`;
}

function _apiBaseUrl() {
  let rootBaseUrl = _rootBaseUrl();
  if ((_Config || _load_Config()).default.api.port) {
    rootBaseUrl += ':' + (_Config || _load_Config()).default.api.port;
  }
  return rootBaseUrl + '/--/api/v2';
}

class ApiV2Error extends (_es6Error || _load_es6Error()).default {

  constructor(message, code = 'UNKNOWN') {
    super(message);
    this.code = code;
    this._isApiError = true;
  }
}

exports.ApiV2Error = ApiV2Error;
class ApiV2Client {

  static clientForUser(user) {
    if (user && user.sessionSecret) {
      return new ApiV2Client({ sessionSecret: user.sessionSecret });
    }

    return new ApiV2Client();
  }

  constructor(options = {}) {
    this.sessionSecret = null;

    if (options.sessionSecret) {
      this.sessionSecret = options.sessionSecret;
    }
  }

  getAsync(methodName, args = {}, extraOptions = {}, returnEntireResponse = false) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _this._requestAsync(methodName, {
        httpMethod: 'get',
        queryParameters: args,
        json: true
      }, extraOptions, returnEntireResponse);
    })();
  }

  postAsync(methodName, data = {}, extraOptions = {}, returnEntireResponse = false) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2._requestAsync(methodName, {
        httpMethod: 'post',
        body: data
      }, extraOptions, returnEntireResponse);
    })();
  }

  putAsync(methodName, data = {}, extraOptions = {}, returnEntireResponse = false) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3._requestAsync(methodName, {
        httpMethod: 'put',
        body: data
      }, extraOptions, returnEntireResponse);
    })();
  }

  deleteAsync(methodName, data = {}, extraOptions = {}, returnEntireResponse = false) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return _this4._requestAsync(methodName, {
        httpMethod: 'delete',
        body: data
      }, extraOptions, returnEntireResponse);
    })();
  }

  _requestAsync(methodName, options, extraRequestOptions, returnEntireResponse = false) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const url = `${_apiBaseUrl()}/${methodName}`;
      let reqOptions = {
        url,
        method: options.httpMethod,
        headers: {
          'Exponent-Client': 'xdl'
        },
        json: typeof options.json !== 'undefined' ? options.json : false
      };

      if (_this5.sessionSecret) {
        reqOptions.headers['Expo-Session'] = _this5.sessionSecret;
      }

      // Handle qs
      if (options.queryParameters) {
        reqOptions.params = options.queryParameters;
        reqOptions.paramsSerializer = _querystring.default.stringify;
      }

      // Handle body
      if (options.body) {
        reqOptions.data = options.body;
      }

      reqOptions = (_lodash || _load_lodash()).default.merge({}, reqOptions, extraRequestOptions);
      let response;
      let result;
      try {
        response = yield (_axios || _load_axios()).default.request(reqOptions);
        result = response.data;
      } catch (e) {
        const maybeErrorData = (0, (_idx || _load_idx()).default)(e, function (_) {
          return _.response.data.errors.length;
        });
        if (maybeErrorData) {
          result = e.response.data;
        } else {
          throw e;
        }
      }

      if (result.errors && result.errors.length) {
        let responseError = result.errors[0];
        let error = new ApiV2Error(responseError.message, responseError.code);
        error.serverStack = responseError.stack;
        error.details = responseError.details;
        throw error;
      }

      return returnEntireResponse ? response : result.data;
    })();
  }
}
exports.default = ApiV2Client;
//# sourceMappingURL=__sourcemaps__/ApiV2.js.map
