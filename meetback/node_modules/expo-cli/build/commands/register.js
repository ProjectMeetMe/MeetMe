'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _accounts;

function _load_accounts() {
  return _accounts = require('../accounts');
}

exports.default = function (program) {
  program.command('register').description('Sign up for a new Expo account').asyncAction(function () {
    return (0, (_accounts || _load_accounts()).register)();
  });
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/commands/register.js.map
