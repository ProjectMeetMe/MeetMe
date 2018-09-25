'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var action = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, options) {
    var root, startOpts, _ref2, url, isUrlFallback, _ref3, exp, recipient;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, (_exit || _load_exit()).installExitHooks)(projectDir);

            _context.next = 3;
            return (_urlOpts || _load_urlOpts()).default.optsAsync(projectDir, options);

          case 3:

            (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.gray('Using project at', projectDir));

            root = _path.default.resolve(projectDir);
            startOpts = {};

            if (options.clear) {
              startOpts.reset = true;
            }

            if (options.maxWorkers) {
              startOpts.maxWorkers = options.maxWorkers;
            }

            _context.next = 10;
            return (_xdl || _load_xdl()).Project.startAsync(root, startOpts);

          case 10:

            (0, (_log || _load_log()).default)('Expo is ready.');
            (_log || _load_log()).default.newLine();

            _context.next = 14;
            return (_xdl || _load_xdl()).Project.getManifestUrlWithFallbackAsync(projectDir);

          case 14:
            _ref2 = _context.sent;
            url = _ref2.url;
            isUrlFallback = _ref2.isUrlFallback;
            _context.next = 19;
            return (_xdl || _load_xdl()).ProjectUtils.readConfigJsonAsync(projectDir);

          case 19:
            _ref3 = _context.sent;
            exp = _ref3.exp;


            if (!exp.isDetached) {
              (_urlOpts || _load_urlOpts()).default.printQRCode(url);
            }

            (0, (_log || _load_log()).default)('Your URL is: ' + (_chalk || _load_chalk()).default.underline(url));

            if (exp.isDetached) {
              _context.next = 26;
              break;
            }

            _context.next = 26;
            return (0, (_printRunInstructionsAsync || _load_printRunInstructionsAsync()).default)();

          case 26:
            if (!isUrlFallback) {
              _context.next = 30;
              break;
            }

            _context.next = 29;
            return (_xdl || _load_xdl()).ProjectSettings.setAsync(projectDir, { hostType: 'lan' });

          case 29:

            (_log || _load_log()).default.warn('Switched to a LAN URL because the tunnel appears to be down. ' + 'Only devices in the same network can access the app. ' + 'Restart with `exp start --tunnel` to try reconnecting.');

          case 30:
            _context.next = 32;
            return (_sendTo || _load_sendTo()).default.getRecipient(options.sendTo);

          case 32:
            recipient = _context.sent;

            if (!recipient) {
              _context.next = 36;
              break;
            }

            _context.next = 36;
            return (_sendTo || _load_sendTo()).default.sendUrlAsync(url, recipient);

          case 36:
            _context.next = 38;
            return (_urlOpts || _load_urlOpts()).default.handleMobileOptsAsync(projectDir, options);

          case 38:

            (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.green('Logs for your project will appear below. Press Ctrl+C to exit.'));

          case 39:
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

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _path = _interopRequireDefault(require('path'));

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

var _printRunInstructionsAsync;

function _load_printRunInstructionsAsync() {
  return _printRunInstructionsAsync = _interopRequireDefault(require('../printRunInstructionsAsync'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (program) {
  program.command('start [project-dir]').alias('r').description('Starts or restarts a local server for your app and gives you a URL to it').option('-s, --send-to [dest]', 'A phone number or e-mail address to send a link to').option('-c, --clear', 'Clear the React Native packager cache')
  // TODO(anp) set a default for this dynamically based on whether we're inside a container?
  .option('--max-workers [num]', 'Maximum number of tasks to allow Metro to spawn.').urlOpts().allowOffline().asyncActionProjectDir(action, true);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/exp_commands/start.js.map
