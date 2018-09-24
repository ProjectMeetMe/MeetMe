'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.login = exports.loginOrRegisterIfLoggedOut = undefined;

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var loginOrRegisterIfLoggedOut = exports.loginOrRegisterIfLoggedOut = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee() {
    var user, questions, _ref2, action;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (_xdl || _load_xdl()).User.getCurrentUserAsync();

          case 2:
            user = _context.sent;

            if (!user) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', user);

          case 5:

            (_log || _load_log()).default.warn('An Expo user account is required to proceed.');

            if (!(_commander || _load_commander()).default.nonInteractive) {
              _context.next = 8;
              break;
            }

            throw new (_CommandError || _load_CommandError()).default('NOT_LOGGED_IN', 'Not logged in. Use `' + (_commander || _load_commander()).default.name + ' login -u username -p password` to log in.');

          case 8:
            questions = [{
              type: 'list',
              name: 'action',
              message: 'How would you like to authenticate?',
              choices: [{
                name: 'Make a new Expo account',
                value: 'register'
              }, {
                name: 'Log in with an existing Expo account',
                value: 'existingUser'
              }, {
                name: 'Cancel',
                value: 'cancel'
              }]
            }];
            _context.next = 11;
            return (0, (_prompt || _load_prompt()).default)(questions);

          case 11:
            _ref2 = _context.sent;
            action = _ref2.action;

            if (!(action === 'register')) {
              _context.next = 17;
              break;
            }

            return _context.abrupt('return', register());

          case 17:
            if (!(action === 'existingUser')) {
              _context.next = 21;
              break;
            }

            return _context.abrupt('return', login({}));

          case 21:
            throw new (_CommandError || _load_CommandError()).default('BAD_CHOICE', 'Not logged in.');

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function loginOrRegisterIfLoggedOut() {
    return _ref.apply(this, arguments);
  };
}();

var login = exports.login = function () {
  var _ref3 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(options) {
    var user, nonInteractive, question, _ref4, action;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (_xdl || _load_xdl()).User.getCurrentUserAsync();

          case 2:
            user = _context2.sent;
            nonInteractive = options.parent && options.parent.nonInteractive;

            if (nonInteractive) {
              _context2.next = 16;
              break;
            }

            if (!user) {
              _context2.next = 13;
              break;
            }

            question = [{
              type: 'confirm',
              name: 'action',
              message: 'You are already logged in as ' + (_chalk || _load_chalk()).default.green(user.username) + '. Log in as new user?'
            }];
            _context2.next = 9;
            return (0, (_prompt || _load_prompt()).default)(question);

          case 9:
            _ref4 = _context2.sent;
            action = _ref4.action;

            if (action) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt('return');

          case 13:
            return _context2.abrupt('return', _usernamePasswordAuth(options.username, options.password));

          case 16:
            if (!(options.username && options.password)) {
              _context2.next = 20;
              break;
            }

            return _context2.abrupt('return', _usernamePasswordAuth(options.username, options.password));

          case 20:
            throw new (_CommandError || _load_CommandError()).default('NON_INTERACTIVE', 'Username and password not provided in non-interactive mode.');

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function login(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var _usernamePasswordAuth = function () {
  var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3(username, password) {
    var questions, answers, data, user;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            questions = [];

            if (!username) {
              questions.push({
                type: 'input',
                name: 'username',
                message: 'Username/Email Address:',
                validate: function validate(val) {
                  if (val.trim() === '') {
                    return false;
                  }
                  return true;
                }
              });
            }

            if (!password) {
              questions.push({
                type: 'password',
                name: 'password',
                message: 'Password:',
                validate: function validate(val) {
                  if (val.trim() === '') {
                    return false;
                  }
                  return true;
                }
              });
            }

            _context3.next = 5;
            return (0, (_prompt || _load_prompt()).default)(questions);

          case 5:
            answers = _context3.sent;
            data = {
              username: username || answers.username,
              password: password || answers.password
            };
            _context3.next = 9;
            return (_xdl || _load_xdl()).User.loginAsync('user-pass', data);

          case 9:
            user = _context3.sent;

            if (!user) {
              _context3.next = 15;
              break;
            }

            console.log('\nSuccess. You are now logged in as ' + (_chalk || _load_chalk()).default.green(user.username) + '.');
            return _context3.abrupt('return', user);

          case 15:
            throw new Error('Unexpected Error: No user returned from the API');

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function _usernamePasswordAuth(_x2, _x3) {
    return _ref5.apply(this, arguments);
  };
}();

var register = exports.register = function () {
  var _ref6 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee4() {
    var questions, answers, registeredUser;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log('\nThanks for signing up for Expo!\nJust a few questions:\n');

            questions = [{
              type: 'input',
              name: 'email',
              message: 'E-mail:',
              filter: function filter(val) {
                return val.trim();
              },
              validate: function validate(val) {
                if (val.trim() === '') {
                  return false;
                }
                return true;
              }
            }, {
              type: 'input',
              name: 'username',
              message: 'Username:',
              filter: function filter(val) {
                return val.trim();
              },
              validate: function validate(val) {
                if (val.trim() === '') {
                  return false;
                }
                return true;
              }
            }, {
              type: 'password',
              name: 'password',
              message: 'Password:',
              filter: function filter(val) {
                return val.trim();
              },
              validate: function validate(val) {
                if (val.trim() === '') {
                  return 'Please create a password';
                }
                return true;
              }
            }, {
              type: 'password',
              name: 'passwordRepeat',
              message: 'Confirm Password:',
              validate: function validate(val, answers) {
                if (val.trim() === '') {
                  return false;
                }
                if (val.trim() !== answers.password.trim()) {
                  return 'Passwords don\'t match!';
                }
                return true;
              }
            }];
            _context4.next = 4;
            return (0, (_prompt || _load_prompt()).default)(questions);

          case 4:
            answers = _context4.sent;
            _context4.next = 7;
            return (_xdl || _load_xdl()).User.registerAsync(answers);

          case 7:
            registeredUser = _context4.sent;

            console.log('\nThanks for signing up!');
            return _context4.abrupt('return', registeredUser);

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function register() {
    return _ref6.apply(this, arguments);
  };
}();

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _commander;

function _load_commander() {
  return _commander = _interopRequireDefault(require('commander'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _CommandError;

function _load_CommandError() {
  return _CommandError = _interopRequireDefault(require('./CommandError'));
}

var _prompt;

function _load_prompt() {
  return _prompt = _interopRequireDefault(require('./prompt'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('./log'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(_xdl || _load_xdl()).User.initialize();
//# sourceMappingURL=__sourcemaps__/accounts.js.map
