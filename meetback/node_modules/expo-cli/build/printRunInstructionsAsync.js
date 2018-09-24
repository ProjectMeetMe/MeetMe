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

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('./log'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee() {
    var user;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (_xdl || _load_xdl()).User.getCurrentUserAsync();

          case 2:
            user = _context.sent;


            // If no user, we are offline and can't connect
            if (user) {
              (_log || _load_log()).default.newLine();
              (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.bold('Instructions to open this project on a physical device'));
              (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.underline('Android devices') + ': scan the above QR code.');
              (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.underline('iOS devices') + ': run ' + (_chalk || _load_chalk()).default.bold('exp send -s <your-phone-number-or-email>') + ' in this project directory in another terminal window to send the URL to your device.');

              // NOTE(brentvatne) Uncomment this when we update iOS client
              // log(
              //   `Alternatively, sign in to your account (${chalk.bold(
              //     user.username
              //   )}) in the latest version of the Expo client on your iOS or Android device. Your projects will automatically appear in the "Projects" tab.`
              // );
            }

            (_log || _load_log()).default.newLine();
            (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.bold('Instructions to open this project on a simulator'));
            (0, (_log || _load_log()).default)('If you already have the simulator installed, run ' + (_chalk || _load_chalk()).default.bold('exp ios') + ' or ' + (_chalk || _load_chalk()).default.bold('exp android') + ' in this project directory in another terminal window.');
            (_log || _load_log()).default.newLine();

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function printRunInstructionsAsync() {
    return _ref.apply(this, arguments);
  }

  return printRunInstructionsAsync;
}();

module.exports = exports['default'];
//# sourceMappingURL=__sourcemaps__/printRunInstructionsAsync.js.map
