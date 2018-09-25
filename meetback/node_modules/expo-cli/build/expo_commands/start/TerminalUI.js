'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startAsync = exports.printServerInfo = undefined;

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

var _templateObject = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['i'], ['i']),
    _templateObject2 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['a'], ['a']),
    _templateObject3 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['A'], ['A']),
    _templateObject4 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['c'], ['c']),
    _templateObject5 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['d'], ['d']),
    _templateObject6 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['shift-d'], ['shift-d']),
    _templateObject7 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['D'], ['D']),
    _templateObject8 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['e'], ['e']),
    _templateObject9 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['p'], ['p']),
    _templateObject10 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['r'], ['r']),
    _templateObject11 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['shift-r'], ['shift-r']),
    _templateObject12 = (0, (_taggedTemplateLiteral2 || _load_taggedTemplateLiteral()).default)(['s'], ['s']);

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

var _readline = _interopRequireDefault(require('readline'));

var _wordwrap;

function _load_wordwrap() {
  return _wordwrap = _interopRequireDefault(require('wordwrap'));
}

var _accounts;

function _load_accounts() {
  return _accounts = require('../../accounts');
}

var _urlOpts;

function _load_urlOpts() {
  return _urlOpts = _interopRequireDefault(require('../../urlOpts'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../../log'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CTRL_C = '\x03';
var CTRL_D = '\x04';
var CTRL_L = '\f';

var b = (_chalk || _load_chalk()).default.bold,
    i = (_chalk || _load_chalk()).default.italic,
    u = (_chalk || _load_chalk()).default.underline;

var clearConsole = function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
};

var printHelp = function printHelp() {
  (_log || _load_log()).default.newLine();
  (_log || _load_log()).default.nested('Press ' + b('?') + ' to show a list of all available commands.');
};

var printUsage = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir) {
    var _ref2, dev, openDevToolsAtStartup, username, devMode, iosInfo;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (_xdl || _load_xdl()).ProjectSettings.readAsync(projectDir);

          case 2:
            _ref2 = _context.sent;
            dev = _ref2.dev;
            _context.next = 6;
            return (_xdl || _load_xdl()).UserSettings.getAsync('openDevToolsAtStartup', true);

          case 6:
            openDevToolsAtStartup = _context.sent;
            _context.next = 9;
            return (_xdl || _load_xdl()).User.getCurrentUsernameAsync();

          case 9:
            username = _context.sent;
            devMode = dev ? 'development' : 'production';
            iosInfo = process.platform === 'darwin' ? ', or ' + b(_templateObject) + ' to run on ' + u(_templateObject) + 'OS simulator' : '';

            (_log || _load_log()).default.nested('\n \u203A Press ' + b(_templateObject2) + ' to run on ' + u(_templateObject3) + 'ndroid device/emulator' + iosInfo + '.\n \u203A Press ' + b(_templateObject4) + ' to show info on ' + u(_templateObject4) + 'onnecting new devices.\n \u203A Press ' + b(_templateObject5) + ' to open DevTools in the default web browser.\n \u203A Press ' + b(_templateObject6) + ' to ' + (openDevToolsAtStartup ? 'disable' : 'enable') + ' automatically opening ' + u(_templateObject7) + 'evTools at startup.\n \u203A Press ' + b(_templateObject8) + ' to send an app link with ' + u(_templateObject8) + 'mail/SMS.\n \u203A Press ' + b(_templateObject9) + ' to toggle ' + u(_templateObject9) + 'roduction mode. (current mode: ' + i(devMode) + ')\n \u203A Press ' + b(_templateObject10) + ' to ' + u(_templateObject10) + 'estart bundler, or ' + b(_templateObject11) + ' to restart and clear cache.\n \u203A Press ' + b(_templateObject12) + ' to ' + u(_templateObject12) + 'ign ' + (username ? 'out. (Signed in as ' + i('@' + username) + '.)' : 'in.') + '\n');

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function printUsage(_x) {
    return _ref.apply(this, arguments);
  };
}();

var printServerInfo = exports.printServerInfo = function () {
  var _ref3 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(projectDir) {
    var url, username, wrap, wrapItem, item, iosInfo;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (_xdl || _load_xdl()).UrlUtils.constructManifestUrlAsync(projectDir);

          case 2:
            url = _context2.sent;
            _context2.next = 5;
            return (_xdl || _load_xdl()).User.getCurrentUsernameAsync();

          case 5:
            username = _context2.sent;

            (_log || _load_log()).default.newLine();
            (_log || _load_log()).default.nested('  ' + u(url));
            (_log || _load_log()).default.newLine();
            (_urlOpts || _load_urlOpts()).default.printQRCode(url);
            wrap = (0, (_wordwrap || _load_wordwrap()).default)(2, process.stdout.columns || 80);
            wrapItem = (0, (_wordwrap || _load_wordwrap()).default)(4, process.stdout.columns || 80);

            item = function item(text) {
              return '  \u2022 ' + wrapItem(text).trimStart();
            };

            iosInfo = process.platform === 'darwin' ? ', or ' + b('i') + ' for iOS simulator' : '';

            (_log || _load_log()).default.nested(wrap(u('To run the app with live reloading, choose one of:')));
            if (username) {
              (_log || _load_log()).default.nested(item('Sign in as ' + i('@' + username) + ' in Expo Client on Android or iOS. Your projects will automatically appear in the "Projects" tab.'));
            }
            (_log || _load_log()).default.nested(item('Scan the QR code above with the Expo app (Android) or the Camera app (iOS).'));
            (_log || _load_log()).default.nested(item('Press ' + b(_templateObject2) + ' for Android emulator' + iosInfo + '.'));
            (_log || _load_log()).default.nested(item('Press ' + b(_templateObject8) + ' to send a link to your phone with email/SMS.'));
            if (!username) {
              (_log || _load_log()).default.nested(item('Press ' + b(_templateObject12) + ' to sign in and enable more options.'));
            }
            printHelp();

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function printServerInfo(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var startAsync = exports.startAsync = function () {
  var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee6(projectDir) {
    var handleKeypress = function () {
      var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee5(key) {
        var _this = this;

        var _ref6, success, error, _ref7, _success, msg, _ref8, devToolsPort, enabled, lanAddress, defaultRecipient, rl, _handleKeypress, _cleanup, _cancel, projectSettings, dev, reset, authSession;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.t0 = key;
                _context5.next = _context5.t0 === CTRL_C ? 3 : _context5.t0 === CTRL_D ? 3 : _context5.t0 === CTRL_L ? 5 : _context5.t0 === '?' ? 7 : _context5.t0 === 'a' ? 10 : _context5.t0 === 'i' ? 19 : _context5.t0 === 'c' ? 28 : _context5.t0 === 'd' ? 32 : _context5.t0 === 'D' ? 40 : _context5.t0 === 'e' ? 49 : _context5.t0 === 'p' ? 65 : _context5.t0 === 'r' ? 75 : _context5.t0 === 'R' ? 75 : _context5.t0 === 's' ? 80 : 103;
                break;

              case 3:
                process.emit('SIGINT');
                return _context5.abrupt('return');

              case 5:
                clearConsole();
                return _context5.abrupt('return');

              case 7:
                _context5.next = 9;
                return printUsage(projectDir);

              case 9:
                return _context5.abrupt('return');

              case 10:
                clearConsole();
                (0, (_log || _load_log()).default)('Trying to open the project on Android...');
                _context5.next = 14;
                return (_xdl || _load_xdl()).Android.openProjectAsync(projectDir);

              case 14:
                _ref6 = _context5.sent;
                success = _ref6.success;
                error = _ref6.error;

                printHelp();
                return _context5.abrupt('return');

              case 19:
                clearConsole();
                (0, (_log || _load_log()).default)('Trying to open the project in iOS simulator...');
                _context5.next = 23;
                return (_xdl || _load_xdl()).Simulator.openProjectAsync(projectDir);

              case 23:
                _ref7 = _context5.sent;
                _success = _ref7.success;
                msg = _ref7.msg;

                printHelp();
                return _context5.abrupt('return');

              case 28:
                clearConsole();
                _context5.next = 31;
                return printServerInfo(projectDir);

              case 31:
                return _context5.abrupt('return');

              case 32:
                _context5.next = 34;
                return (_xdl || _load_xdl()).ProjectSettings.readPackagerInfoAsync(projectDir);

              case 34:
                _ref8 = _context5.sent;
                devToolsPort = _ref8.devToolsPort;

                (0, (_log || _load_log()).default)('Opening DevTools in the browser...');
                (0, (_opn || _load_opn()).default)('http://localhost:' + devToolsPort, { wait: false });
                printHelp();
                return _context5.abrupt('return');

              case 40:
                clearConsole();
                _context5.next = 43;
                return (_xdl || _load_xdl()).UserSettings.getAsync('openDevToolsAtStartup', true);

              case 43:
                enabled = !_context5.sent;
                _context5.next = 46;
                return (_xdl || _load_xdl()).UserSettings.setAsync('openDevToolsAtStartup', enabled);

              case 46:
                (0, (_log || _load_log()).default)('Automatically opening DevTools ' + b(enabled ? 'enabled' : 'disabled') + '.\nPress ' + b(_templateObject5) + ' to open DevTools now.');
                printHelp();
                return _context5.abrupt('return');

              case 49:
                stopWaitingForCommand();
                _context5.next = 52;
                return (_xdl || _load_xdl()).UrlUtils.constructManifestUrlAsync(projectDir, {
                  hostType: 'lan'
                });

              case 52:
                lanAddress = _context5.sent;
                _context5.next = 55;
                return (_xdl || _load_xdl()).UserSettings.getAsync('sendTo', null);

              case 55:
                defaultRecipient = _context5.sent;
                rl = _readline.default.createInterface({
                  input: process.stdin,
                  output: process.stdout
                });

                _handleKeypress = function _handleKeypress(chr, key) {
                  if (key && key.name === 'escape') {
                    _cleanup();
                    _cancel();
                  }
                };

                _cleanup = function _cleanup() {
                  rl.close();
                  process.stdin.removeListener('keypress', _handleKeypress);
                  startWaitingForCommand();
                };

                _cancel = function () {
                  var _ref9 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3() {
                    return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            clearConsole();
                            printHelp();

                          case 2:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this);
                  }));

                  return function _cancel() {
                    return _ref9.apply(this, arguments);
                  };
                }();

                clearConsole();
                process.stdin.addListener('keypress', _handleKeypress);
                (0, (_log || _load_log()).default)('Please enter your phone number or email address (press ESC to cancel) ');
                rl.question(defaultRecipient ? '[default: ' + defaultRecipient + ']> ' : '> ', function () {
                  var _ref10 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee4(sendTo) {
                    var sent;
                    return (_regenerator || _load_regenerator()).default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _cleanup();
                            if (!sendTo && defaultRecipient) {
                              sendTo = defaultRecipient;
                            }
                            sendTo = sendTo && sendTo.trim();

                            if (sendTo) {
                              _context4.next = 6;
                              break;
                            }

                            _cancel();
                            return _context4.abrupt('return');

                          case 6:
                            (0, (_log || _load_log()).default)('Sending ' + lanAddress + ' to ' + sendTo + '...');

                            sent = false;
                            _context4.prev = 8;
                            _context4.next = 11;
                            return (_xdl || _load_xdl()).Exp.sendAsync(sendTo, lanAddress);

                          case 11:
                            (0, (_log || _load_log()).default)('Sent link successfully.');
                            sent = true;
                            _context4.next = 18;
                            break;

                          case 15:
                            _context4.prev = 15;
                            _context4.t0 = _context4['catch'](8);

                            (0, (_log || _load_log()).default)('Could not send link. ' + _context4.t0);

                          case 18:
                            printHelp();

                            if (!sent) {
                              _context4.next = 22;
                              break;
                            }

                            _context4.next = 22;
                            return (_xdl || _load_xdl()).UserSettings.setAsync('sendTo', sendTo);

                          case 22:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this, [[8, 15]]);
                  }));

                  return function (_x5) {
                    return _ref10.apply(this, arguments);
                  };
                }());
                return _context5.abrupt('return');

              case 65:
                clearConsole();
                _context5.next = 68;
                return (_xdl || _load_xdl()).ProjectSettings.readAsync(projectDir);

              case 68:
                projectSettings = _context5.sent;
                dev = !projectSettings.dev;
                _context5.next = 72;
                return (_xdl || _load_xdl()).ProjectSettings.setAsync(projectDir, { dev: dev, minify: !dev });

              case 72:
                (0, (_log || _load_log()).default)('Metro Bundler is now running in ' + (_chalk || _load_chalk()).default.bold(dev ? 'development' : 'production') + (_chalk || _load_chalk()).default.reset(' mode.') + '\nPlease reload the project in the Expo app for the change to take effect.');
                printHelp();
                return _context5.abrupt('return');

              case 75:
                clearConsole();
                reset = key === 'R';

                if (reset) {
                  (0, (_log || _load_log()).default)('Restarting Metro Bundler and clearing cache...');
                } else {
                  (0, (_log || _load_log()).default)('Restarting Metro Bundler...');
                }
                (_xdl || _load_xdl()).Project.startAsync(projectDir, { reset: reset });
                return _context5.abrupt('return');

              case 80:
                _context5.next = 82;
                return (_xdl || _load_xdl()).User.getSessionAsync();

              case 82:
                authSession = _context5.sent;

                if (!authSession) {
                  _context5.next = 89;
                  break;
                }

                _context5.next = 86;
                return (_xdl || _load_xdl()).User.logoutAsync();

              case 86:
                (0, (_log || _load_log()).default)('Signed out.');
                _context5.next = 101;
                break;

              case 89:
                stopWaitingForCommand();
                _context5.prev = 90;
                _context5.next = 93;
                return (0, (_accounts || _load_accounts()).loginOrRegisterIfLoggedOut)();

              case 93:
                _context5.next = 98;
                break;

              case 95:
                _context5.prev = 95;
                _context5.t1 = _context5['catch'](90);

                (_log || _load_log()).default.error(_context5.t1);

              case 98:
                _context5.prev = 98;

                startWaitingForCommand();
                return _context5.finish(98);

              case 101:
                printHelp();
                return _context5.abrupt('return');

              case 103:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[90, 95, 98, 101]]);
      }));

      return function handleKeypress(_x4) {
        return _ref5.apply(this, arguments);
      };
    }();

    var _process, stdin, startWaitingForCommand, stopWaitingForCommand;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _process = process, stdin = _process.stdin;

            startWaitingForCommand = function startWaitingForCommand() {
              stdin.setRawMode(true);
              stdin.resume();
              stdin.setEncoding('utf8');
              stdin.on('data', handleKeypress);
            };

            stopWaitingForCommand = function stopWaitingForCommand() {
              stdin.removeListener('data', handleKeypress);
              stdin.setRawMode(false);
              stdin.resume();
            };

            startWaitingForCommand();

            _context6.next = 6;
            return printServerInfo(projectDir);

          case 6:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function startAsync(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
//# sourceMappingURL=../../__sourcemaps__/expo_commands/start/TerminalUI.js.map
