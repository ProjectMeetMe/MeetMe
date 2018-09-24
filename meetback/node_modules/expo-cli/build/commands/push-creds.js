'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify;

function _load_stringify() {
  return _stringify = _interopRequireDefault(require('babel-runtime/core-js/json/stringify'));
}

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (program) {
  program.command('push:android:upload [project-dir]').description('Uploads a Firebase Cloud Messaging key for Android push notifications.').option('--api-key [api-key]', 'Server API key for FCM.').asyncActionProjectDir(function () {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, options) {
      var _ref2, remotePackageName, user, apiClient;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!options.apiKey || options.apiKey.length === 0)) {
                _context.next = 2;
                break;
              }

              throw new Error('Must specify an API key to upload with --api-key.');

            case 2:

              (0, (_log || _load_log()).default)('Reading project configuration...');

              _context.next = 5;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 5:
              _ref2 = _context.sent;
              remotePackageName = _ref2.args.remotePackageName;


              (0, (_log || _load_log()).default)('Logging in...');

              _context.next = 10;
              return (_xdl || _load_xdl()).User.getCurrentUserAsync();

            case 10:
              user = _context.sent;
              apiClient = (_xdl || _load_xdl()).ApiV2.clientForUser(user);


              (0, (_log || _load_log()).default)("Setting API key on Expo's servers...");

              _context.next = 15;
              return apiClient.putAsync('credentials/push/android/' + remotePackageName, {
                fcmApiKey: options.apiKey
              });

            case 15:

              (0, (_log || _load_log()).default)('All done!');

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }(), true);

  program.command('push:android:show [project-dir]').description('Print the value currently in use for FCM notifications for this project.').asyncActionProjectDir(function () {
    var _ref3 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(projectDir, options) {
      var _ref4, remotePackageName, user, apiClient, result;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 2:
              _ref4 = _context2.sent;
              remotePackageName = _ref4.args.remotePackageName;
              _context2.next = 6;
              return (_xdl || _load_xdl()).User.getCurrentUserAsync();

            case 6:
              user = _context2.sent;
              apiClient = (_xdl || _load_xdl()).ApiV2.clientForUser(user);
              _context2.next = 10;
              return apiClient.getAsync('credentials/push/android/' + remotePackageName);

            case 10:
              result = _context2.sent;

              if (!(result.status === 'ok' && result.fcmApiKey)) {
                _context2.next = 15;
                break;
              }

              console.log((0, (_stringify || _load_stringify()).default)(result));
              _context2.next = 16;
              break;

            case 15:
              throw new Error('Server returned an invalid result!');

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }(), true);

  program.command('push:android:clear [project-dir]').description('Deletes a previously uploaded FCM credential.').asyncActionProjectDir(function () {
    var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3(projectDir, options) {
      var _ref6, remotePackageName, user, apiClient;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              (0, (_log || _load_log()).default)('Reading project configuration...');
              _context3.next = 3;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 3:
              _ref6 = _context3.sent;
              remotePackageName = _ref6.args.remotePackageName;


              (0, (_log || _load_log()).default)('Logging in...');
              _context3.next = 8;
              return (_xdl || _load_xdl()).User.getCurrentUserAsync();

            case 8:
              user = _context3.sent;
              apiClient = (_xdl || _load_xdl()).ApiV2.clientForUser(user);


              (0, (_log || _load_log()).default)("Deleting API key from Expo's servers...");

              _context3.next = 13;
              return apiClient.deleteAsync('credentials/push/android/' + remotePackageName);

            case 13:

              (0, (_log || _load_log()).default)('All done!');

            case 14:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
      return _ref5.apply(this, arguments);
    };
  }(), true);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/commands/push-creds.js.map
