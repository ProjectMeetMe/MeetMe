'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _accounts;

function _load_accounts() {
  return _accounts = require('../accounts');
}

exports.default = function (program) {
  program.command('login').alias('signin').description('Login with your Expo account').option('-u, --username [string]', 'Username').option('-p, --password [string]', 'Password').asyncAction((_accounts || _load_accounts()).login);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/commands/login.js.map
