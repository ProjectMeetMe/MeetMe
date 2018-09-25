'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prompt;

var _commander;

function _load_commander() {
  return _commander = _interopRequireDefault(require('commander'));
}

var _inquirer;

function _load_inquirer() {
  return _inquirer = _interopRequireDefault(require('inquirer'));
}

var _CommandError;

function _load_CommandError() {
  return _CommandError = _interopRequireDefault(require('./CommandError'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt(questions) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      nonInteractiveHelp = _ref.nonInteractiveHelp;

  if ((_commander || _load_commander()).default.nonInteractive && questions.length !== 0) {
    var message = 'Input is required, but ' + (_commander || _load_commander()).default.name + ' is in non-interactive mode.\n';
    if (nonInteractiveHelp) {
      message += nonInteractiveHelp;
    } else {
      var question = Array.isArray(questions) ? questions[0] : questions;
      message += 'Required input:\n' + question.message.trim().replace(/^/gm, '> ');
    }
    throw new (_CommandError || _load_CommandError()).default('NON_INTERACTIVE', message);
  }
  return (_inquirer || _load_inquirer()).default.prompt(questions);
}
module.exports = exports['default'];
//# sourceMappingURL=__sourcemaps__/prompt.js.map
