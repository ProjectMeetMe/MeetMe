'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2;

function _load_getIterator() {
  return _getIterator2 = _interopRequireDefault(require('babel-runtime/core-js/get-iterator'));
}

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _extends2;

function _load_extends() {
  return _extends2 = _interopRequireDefault(require('babel-runtime/helpers/extends'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _askForSecret = function () {
  var _ref7 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee4() {
    var _ref8, secret;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (_inquirer || _load_inquirer()).default.prompt({
              type: 'password',
              name: 'secret',
              message: 'Webhook secret (at least 16 and not more than 1000 characters):'
            });

          case 2:
            _ref8 = _context4.sent;
            secret = _ref8.secret;

            if (!(secret.length < 16 || secret.length > 1000)) {
              _context4.next = 11;
              break;
            }

            (_log || _load_log()).default.error('Webhook secret has be at least 16 and not more than 1000 characters long');
            _context4.next = 8;
            return _askForSecret();

          case 8:
            return _context4.abrupt('return', _context4.sent);

          case 11:
            return _context4.abrupt('return', secret);

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function _askForSecret() {
    return _ref7.apply(this, arguments);
  };
}();

var _url = require('url');

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _inquirer;

function _load_inquirer() {
  return _inquirer = _interopRequireDefault(require('inquirer'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WEBHOOK_TYPES = ['build'];

exports.default = function (program) {
  program.command('webhooks:set [project-dir]').option('--url <webhook-url>', 'Webhook to be called after building the app.').option('--event <webhook-type>', 'Type of webhook: [build].').option('--secret <webhook-secret>', 'Secret to be used to calculate the webhook request payload signature (check docs for more details). It has to be at least 16 characters long.').description('Set a webhook for the project.').asyncActionProjectDir(function () {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, _options) {
      var options, secret, webhookData, _ref2, experienceName;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _sanitizeOptions(_options);

              if (!options.secret) {
                _context.next = 5;
                break;
              }

              _context.t0 = options.secret;
              _context.next = 8;
              break;

            case 5:
              _context.next = 7;
              return _askForSecret();

            case 7:
              _context.t0 = _context.sent;

            case 8:
              secret = _context.t0;
              webhookData = (0, (_extends2 || _load_extends()).default)({}, options, { secret: secret });
              _context.next = 12;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 12:
              _ref2 = _context.sent;
              experienceName = _ref2.args.remoteFullPackageName;

              (0, (_log || _load_log()).default)('Setting ' + webhookData.event + ' webhook and secret for ' + experienceName);
              _context.prev = 15;
              _context.next = 18;
              return (_xdl || _load_xdl()).Webhooks.setWebhookAsync(experienceName, webhookData);

            case 18:
              _context.next = 24;
              break;

            case 20:
              _context.prev = 20;
              _context.t1 = _context['catch'](15);

              (_log || _load_log()).default.error(_context.t1);
              throw new Error('Unable to set webhook and secret for this project.');

            case 24:

              (0, (_log || _load_log()).default)('All done!');

            case 25:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[15, 20]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }(), true);

  program.command('webhooks:show [project-dir]').description('Show webhooks for the project.').asyncActionProjectDir(function () {
    var _ref3 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(projectDir, options) {
      var _ref4, experienceName, webhooks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, webhook, event, url, secret;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 2:
              _ref4 = _context2.sent;
              experienceName = _ref4.args.remoteFullPackageName;


              (0, (_log || _load_log()).default)('Fetching webhooks for ' + experienceName);

              _context2.prev = 5;
              _context2.next = 8;
              return (_xdl || _load_xdl()).Webhooks.getWebhooksAsync(experienceName);

            case 8:
              webhooks = _context2.sent;

              if (!(!webhooks || webhooks.length === 0)) {
                _context2.next = 13;
                break;
              }

              (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.bold("You don't have any webhook set for this project."));
              _context2.next = 32;
              break;

            case 13:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 16;

              for (_iterator = (0, (_getIterator2 || _load_getIterator()).default)(webhooks); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                webhook = _step.value;
                event = webhook.event, url = webhook.url, secret = webhook.secret;

                (0, (_log || _load_log()).default)();
                (0, (_log || _load_log()).default)('Webhook type: ' + (_chalk || _load_chalk()).default.bold(event));
                (0, (_log || _load_log()).default)('Webhook URL: ' + (_chalk || _load_chalk()).default.bold(url));
                (0, (_log || _load_log()).default)('Webhook secret: ' + (_chalk || _load_chalk()).default.bold(secret));
              }
              _context2.next = 24;
              break;

            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2['catch'](16);
              _didIteratorError = true;
              _iteratorError = _context2.t0;

            case 24:
              _context2.prev = 24;
              _context2.prev = 25;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 27:
              _context2.prev = 27;

              if (!_didIteratorError) {
                _context2.next = 30;
                break;
              }

              throw _iteratorError;

            case 30:
              return _context2.finish(27);

            case 31:
              return _context2.finish(24);

            case 32:
              _context2.next = 38;
              break;

            case 34:
              _context2.prev = 34;
              _context2.t1 = _context2['catch'](5);

              (_log || _load_log()).default.error(_context2.t1);
              throw new Error('Unable to fetch webhooks for this project.');

            case 38:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[5, 34], [16, 20, 24, 32], [25,, 27, 31]]);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }(), true);

  program.command('webhooks:clear [project-dir]').option('--event <webhook-type>', 'Type of webhook: [build].').description('Clear a webhook associated with this project.').asyncActionProjectDir(function () {
    var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3(projectDir, options) {
      var event, _ref6, experienceName;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              event = _sanitizeEvent(options.event);
              _context3.next = 3;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 3:
              _ref6 = _context3.sent;
              experienceName = _ref6.args.remoteFullPackageName;


              (0, (_log || _load_log()).default)('Clearing webhooks for ' + experienceName);

              _context3.prev = 6;
              _context3.next = 9;
              return (_xdl || _load_xdl()).Webhooks.deleteWebhooksAsync(experienceName, event);

            case 9:
              _context3.next = 15;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3['catch'](6);

              (_log || _load_log()).default.error(_context3.t0);
              throw new Error('Unable to clear webhook and secret for this project.');

            case 15:
              (0, (_log || _load_log()).default)('All done!');

            case 16:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[6, 11]]);
    }));

    return function (_x5, _x6) {
      return _ref5.apply(this, arguments);
    };
  }(), true);
};

function _sanitizeOptions(options) {
  var url = options.url,
      secret = options.secret,
      _options$event = options.event,
      _event = _options$event === undefined ? 'build' : _options$event;

  var event = _sanitizeEvent(_event, true);

  if (!url) {
    throw new Error('You must provide --url parameter');
  } else {
    try {
      // eslint-disable-next-line no-new
      new _url.URL(url);
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('The provided webhook URL is invalid and must be an absolute URL, including a scheme.');
      } else {
        throw err;
      }
    }

    if (secret) {
      var secretString = String(secret);
      if (secretString.length < 16 || secretString.length > 1000) {
        throw new Error('Webhook secret has be at least 16 and not more than 1000 characters long');
      }
    }
  }

  return { url: url, secret: secret, event: event };
}

function _sanitizeEvent(event) {
  var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!event) {
    if (required) {
      throw new Error('Webhook type has to be provided');
    } else {
      // we don't have anything to sanitize here, continue
      return event;
    }
  }

  if (!(_lodash || _load_lodash()).default.includes(WEBHOOK_TYPES, event)) {
    throw new Error('Unsupported webhook type: ' + event);
  }

  return event;
}

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/expo_commands/webhooks.js.map
