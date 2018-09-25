'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteWebhooksAsync = exports.getWebhooksAsync = exports.setWebhookAsync = undefined;

let setWebhookAsync = exports.setWebhookAsync = (() => {
  var _ref = _asyncToGenerator(function* (experienceName, { url, secret, event }) {
    const user = yield (_User || _load_User()).default.getCurrentUserAsync();
    const api = (_ApiV || _load_ApiV()).default.clientForUser(user);
    return yield api.postAsync('webhook/set', {
      experienceName,
      url,
      secret,
      event
    });
  });

  return function setWebhookAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getWebhooksAsync = exports.getWebhooksAsync = (() => {
  var _ref2 = _asyncToGenerator(function* (experienceName) {
    const user = yield (_User || _load_User()).default.getCurrentUserAsync();
    const api = (_ApiV || _load_ApiV()).default.clientForUser(user);
    return yield api.postAsync('webhook/get', { experienceName });
  });

  return function getWebhooksAsync(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

let deleteWebhooksAsync = exports.deleteWebhooksAsync = (() => {
  var _ref3 = _asyncToGenerator(function* (experienceName, event) {
    const user = yield (_User || _load_User()).default.getCurrentUserAsync();
    const api = (_ApiV || _load_ApiV()).default.clientForUser(user);
    return yield api.postAsync('webhook/delete', { experienceName, event });
  });

  return function deleteWebhooksAsync(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
})();

var _User;

function _load_User() {
  return _User = _interopRequireDefault(require('./User'));
}

var _ApiV;

function _load_ApiV() {
  return _ApiV = _interopRequireDefault(require('./ApiV2'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=__sourcemaps__/Webhooks.js.map
