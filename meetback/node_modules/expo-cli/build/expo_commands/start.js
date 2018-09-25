'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _taggedTemplateLiteral2;

function _load_taggedTemplateLiteral() {
  return _taggedTemplateLiteral2 = _interopRequireDefault(require('babel-runtime/helpers/taggedTemplateLiteral'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var action = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, options) {
    var root, startOpts, devToolsUrl, url, recipient, _ref2, exp, nonInteractive;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, (_exit || _load_exit()).installExitHooks)(projectDir);

            _context.next = 3;
            return (_urlOpts || _load_urlOpts()).default.optsAsync(projectDir, options);

          case 3:

            (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.gray('Starting project at', projectDir));

            root = _path.default.resolve(projectDir);
            startOpts = {};

            if (options.clear) {
              startOpts.reset = true;
            }

            if (options.maxWorkers) {
              startOpts.maxWorkers = options.maxWorkers;
            }

            _context.next = 10;
            return (_devTools || _load_devTools()).DevToolsServer.startAsync(root);

          case 10:
            devToolsUrl = _context.sent;
            _context.next = 13;
            return (_xdl || _load_xdl()).Project.startAsync(root, startOpts);

          case 13:
            _context.next = 15;
            return (_xdl || _load_xdl()).UrlUtils.constructManifestUrlAsync(projectDir);

          case 15:
            url = _context.sent;
            _context.next = 18;
            return (_sendTo || _load_sendTo()).default.getRecipient(options.sendTo);

          case 18:
            recipient = _context.sent;

            if (!recipient) {
              _context.next = 22;
              break;
            }

            _context.next = 22;
            return (_sendTo || _load_sendTo()).default.sendUrlAsync(url, recipient);

          case 22:
            _context.next = 24;
            return (_urlOpts || _load_urlOpts()).default.handleMobileOptsAsync(projectDir, options);

          case 24:
            _context.next = 26;
            return (_xdl || _load_xdl()).ProjectUtils.readConfigJsonAsync(projectDir);

          case 26:
            _ref2 = _context.sent;
            exp = _ref2.exp;


            (0, (_log || _load_log()).default)('Expo DevTools is running at ' + (_chalk || _load_chalk()).default.underline(devToolsUrl));
            nonInteractive = options.parent && options.parent.nonInteractive;

            if (!(!nonInteractive && !exp.isDetached)) {
              _context.next = 43;
              break;
            }

            _context.next = 33;
            return (_xdl || _load_xdl()).UserSettings.getAsync('openDevToolsAtStartup', true);

          case 33:
            if (!_context.sent) {
              _context.next = 38;
              break;
            }

            (0, (_log || _load_log()).default)('Opening DevTools in the browser... (press ' + (_chalk || _load_chalk()).default.bold(_templateObject) + ' to disable)');
            (0, (_opn || _load_opn()).default)(devToolsUrl, { wait: false });
            _context.next = 39;
            break;

          case 38:
            (0, (_log || _load_log()).default)('Press ' + (_chalk || _load_chalk()).default.bold(_templateObject2) + ' to open DevTools now, or ' + (_chalk || _load_chalk()).default.bold(_templateObject) + ' to always open it automatically.');

          case 39:
            _context.next = 41;
            return (_TerminalUI || _load_TerminalUI()).startAsync(projectDir);

          case 41:
            _context.next = 45;
            break;

          case 43:
            if (!exp.isDetached) {
              (_log || _load_log()).default.newLine();
              (_urlOpts || _load_urlOpts()).default.printQRCode(url);
            }
            (0, (_log || _load_log()).default)('Your app is running at ' + (_chalk || _load_chalk()).default.underline(url));

          case 45:

            (_log || _load_log()).default.nested((_chalk || _load_chalk()).default.green('Logs for your project will appear below. Press Ctrl+C to exit.'));

          case 46:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function action(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _templateObject = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['shift-d'], ['shift-d']),
    _templateObject2 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['d'], ['d']);

var _devTools;

function _load_devTools() {
  return _devTools = require('@expo/dev-tools');
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _opn;

function _load_opn() {
  return _opn = _interopRequireDefault(require('opn'));
}

var _path = _interopRequireDefault(require('path'));

var _prompt;

function _load_prompt() {
  return _prompt = _interopRequireDefault(require('../prompt'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

var _sendTo;

function _load_sendTo() {
  return _sendTo = _interopRequireDefault(require('../sendTo'));
}

var _exit;

function _load_exit() {
  return _exit = require('../exit');
}

var _urlOpts;

function _load_urlOpts() {
  return _urlOpts = _interopRequireDefault(require('../urlOpts'));
}

var _TerminalUI;

function _load_TerminalUI() {
  return _TerminalUI = _interopRequireWildcard(require('./start/TerminalUI'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (program) {
  program.command('start [project-dir]').alias('r').description('Starts or restarts a local server for your app and gives you a URL to it').option('-s, --send-to [dest]', 'A phone number or e-mail address to send a link to').option('-c, --clear', 'Clear the React Native packager cache')
  // TODO(anp) set a default for this dynamically based on whether we're inside a container?
  .option('--max-workers [num]', 'Maximum number of tasks to allow Metro to spawn.').urlOpts().allowOffline().asyncActionProjectDir(action, true, true);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/expo_commands/start.js.map
