'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.pipeOutputToLogger = pipeOutputToLogger;

var _bunyan;

function _load_bunyan() {
  return _bunyan = _interopRequireDefault(require('@expo/bunyan'));
}

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PRINT_JSON_LOGS = process.env.JSON_LOGS === '1';
const LOGGER_NAME = 'xdl-detach';
const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

const logger = {
  init(levels) {
    this.loggerObj = PRINT_JSON_LOGS ? (_bunyan || _load_bunyan()).default.createLogger({ name: LOGGER_NAME }) : console;
    this.configured = PRINT_JSON_LOGS;
    this.selfConfigured = this.configured && true;
    this.extraFields = {};
    levels.forEach(level => {
      this[level] = function (...args) {
        this.logLine(level, ...args);
      };
    });
  },
  configure(loggerObj) {
    this.loggerObj = loggerObj;
    this.configured = true;
    this.selfConfigured = false;
  },
  withFields(extraFields) {
    return Object.assign({}, this, { extraFields: _extends({}, this.extraFields, extraFields) });
  },
  logLine(level, ...args) {
    const argsToLog = [...args];
    const extraFieldsFromArgsExist = (_lodash || _load_lodash()).default.isPlainObject((_lodash || _load_lodash()).default.first(args));
    const extraFieldsFromArgs = extraFieldsFromArgsExist ? args[0] : {};
    if (extraFieldsFromArgsExist) {
      argsToLog.shift();
    }
    const extraFields = _extends({}, extraFieldsFromArgs, this.extraFields);
    if (!(_lodash || _load_lodash()).default.isEmpty(extraFields)) {
      argsToLog.unshift(extraFields);
    }
    this.loggerObj[level](...argsToLog);
  }
};

logger.init(LEVELS);

exports.default = logger;
function pipeOutputToLogger({ stdout, stderr } = {}, extraFields = {}, { stdoutOnly = false, dontShowStdout = false } = {}) {
  if (stdout) {
    const stdoutExtraFields = _extends({}, extraFields);
    if (dontShowStdout) {
      stdoutExtraFields.dontShowStdout = true;
    }
    stdout.on('data', line => logMultiline(line, _extends({}, stdoutExtraFields, { source: 'stdout' })));
  }
  if (stderr) {
    const source = stdoutOnly ? 'stdout' : 'stderr';
    stderr.on('data', line => logMultiline(line, _extends({}, extraFields, { source })));
  }
}

function logMultiline(data, extraFields) {
  if (!data) {
    return;
  }
  const lines = String(data).split('\n');
  lines.forEach(line => {
    if (line) {
      const args = [line];
      if (logger.configured) {
        args.unshift(extraFields);
      }
      const shouldntLogMessage = extraFields.source === 'stdout' && extraFields.dontShowStdout && logger.configured && !logger.selfConfigured;
      if (!shouldntLogMessage) {
        logger.info(...args);
      }
    }
  });
}
//# sourceMappingURL=../__sourcemaps__/detach/Logger.js.map
