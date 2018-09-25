'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeConfigJsonAsync = exports.readConfigJsonAsync = exports.setCustomConfigPath = exports.readExpRcAsync = exports.configFilenameAsync = exports.findConfigFileAsync = exports.fileExistsAsync = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let fileExistsAsync = exports.fileExistsAsync = (() => {
  var _ref = _asyncToGenerator(function* (file) {
    try {
      return (yield (_fsExtra || _load_fsExtra()).default.stat(file)).isFile();
    } catch (e) {
      return false;
    }
  });

  return function fileExistsAsync(_x) {
    return _ref.apply(this, arguments);
  };
})();

let _findConfigPathAsync = (() => {
  var _ref2 = _asyncToGenerator(function* (projectRoot) {
    const appJson = _path.default.join(projectRoot, 'app.json');
    const expJson = _path.default.join(projectRoot, 'exp.json');
    if (yield fileExistsAsync(appJson)) {
      return appJson;
    } else if (yield fileExistsAsync(expJson)) {
      return expJson;
    } else {
      return appJson;
    }
  });

  return function _findConfigPathAsync(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

let findConfigFileAsync = exports.findConfigFileAsync = (() => {
  var _ref3 = _asyncToGenerator(function* (projectRoot) {
    let configPath;
    if (customConfigPaths[projectRoot]) {
      configPath = customConfigPaths[projectRoot];
    } else {
      configPath = yield _findConfigPathAsync(projectRoot);
    }
    const configName = _path.default.basename(configPath);
    const configNamespace = configName !== 'exp.json' ? 'expo' : null;
    return { configPath, configName, configNamespace };
  });

  return function findConfigFileAsync(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

let configFilenameAsync = exports.configFilenameAsync = (() => {
  var _ref4 = _asyncToGenerator(function* (projectRoot) {
    return (yield findConfigFileAsync(projectRoot)).configName;
  });

  return function configFilenameAsync(_x4) {
    return _ref4.apply(this, arguments);
  };
})();

let readExpRcAsync = exports.readExpRcAsync = (() => {
  var _ref5 = _asyncToGenerator(function* (projectRoot) {
    const expRcPath = _path.default.join(projectRoot, '.exprc');

    if (!(_fsExtra || _load_fsExtra()).default.existsSync(expRcPath)) {
      return {};
    }

    try {
      return yield (_jsonFile || _load_jsonFile()).default.readAsync(expRcPath, { json5: true });
    } catch (e) {
      logError(projectRoot, 'expo', `Error parsing JSON file: ${e.toString()}`);
      return {};
    }
  });

  return function readExpRcAsync(_x5) {
    return _ref5.apply(this, arguments);
  };
})();

let setCustomConfigPath = exports.setCustomConfigPath = (() => {
  var _ref6 = _asyncToGenerator(function* (projectRoot, configPath) {
    customConfigPaths[projectRoot] = configPath;
  });

  return function setCustomConfigPath(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
})();

let readConfigJsonAsync = exports.readConfigJsonAsync = (() => {
  var _ref7 = _asyncToGenerator(function* (projectRoot) {
    let exp;
    let pkg;
    let rootConfig;

    const { configPath, configName, configNamespace } = yield findConfigFileAsync(projectRoot);

    try {
      exp = yield (_jsonFile || _load_jsonFile()).default.readAsync(configPath, { json5: true });

      if (configNamespace) {
        // if we're not using exp.json, then we've stashed everything under an expo key
        rootConfig = exp;
        exp = exp[configNamespace];
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        // config missing. might be in package.json
      } else if (e.isJsonFileError) {
        logError(projectRoot, 'expo', e.message);
        return { exp: null, pkg: null };
      }
    }

    try {
      const packageJsonPath = exp && exp.nodeModulesPath ? _path.default.join(_path.default.resolve(projectRoot, exp.nodeModulesPath), 'package.json') : _path.default.join(projectRoot, 'package.json');
      pkg = yield (_jsonFile || _load_jsonFile()).default.readAsync(packageJsonPath);
    } catch (e) {
      if (e.isJsonFileError) {
        logError(projectRoot, 'expo', e.message);
        return { exp: null, pkg: null };
      }

      // pkg missing
    }

    // Easiest bail-out: package.json is missing
    if (!pkg) {
      logError(projectRoot, 'expo', `Error: Can't find package.json`);
      return { exp: null, pkg: null };
    }

    // Grab our exp config from package.json (legacy) or exp.json
    if (!exp && pkg.exp) {
      exp = pkg.exp;
      logError(projectRoot, 'expo', `Error: Move your "exp" config from package.json to exp.json.`);
    } else if (!exp && !pkg.exp) {
      logError(projectRoot, 'expo', `Error: Missing ${configName}. See https://docs.expo.io/`);
      return { exp: null, pkg: null };
    }

    // fill any required fields we might care about

    // TODO(adam) decide if there are other fields we want to provide defaults for

    if (exp && !exp.name) {
      exp.name = pkg.name;
    }

    if (exp && !exp.slug) {
      exp.slug = (0, (_slugify || _load_slugify()).default)(exp.name.toLowerCase());
    }

    if (exp && !exp.version) {
      exp.version = pkg.version;
    }

    return { exp, pkg, rootConfig };
  });

  return function readConfigJsonAsync(_x8) {
    return _ref7.apply(this, arguments);
  };
})();

let writeConfigJsonAsync = exports.writeConfigJsonAsync = (() => {
  var _ref8 = _asyncToGenerator(function* (projectRoot, options) {
    const { configName, configPath, configNamespace } = yield findConfigFileAsync(projectRoot);
    let { exp, pkg, rootConfig } = yield readConfigJsonAsync(projectRoot);
    let config = rootConfig || {};

    if (!exp) {
      throw new Error(`Couldn't read ${configName}`);
    }
    if (!pkg) {
      throw new Error(`Couldn't read package.json`);
    }

    exp = _extends({}, exp, options);

    if (configNamespace) {
      config[configNamespace] = exp;
    } else {
      config = exp;
    }

    yield (_jsonFile || _load_jsonFile()).default.writeAsync(configPath, config, { json5: false });

    return {
      exp,
      pkg,
      rootConfig
    };
  });

  return function writeConfigJsonAsync(_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
})();

exports.logWithLevel = logWithLevel;
exports.logDebug = logDebug;
exports.logInfo = logInfo;
exports.logError = logError;
exports.logWarning = logWarning;
exports.clearNotification = clearNotification;
exports.attachLoggerStream = attachLoggerStream;

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _path = _interopRequireDefault(require('path'));

var _jsonFile;

function _load_jsonFile() {
  return _jsonFile = _interopRequireDefault(require('@expo/json-file'));
}

var _slugify;

function _load_slugify() {
  return _slugify = _interopRequireDefault(require('slugify'));
}

var _Analytics;

function _load_Analytics() {
  return _Analytics = _interopRequireWildcard(require('../Analytics'));
}

var _Config;

function _load_Config() {
  return _Config = _interopRequireDefault(require('../Config'));
}

var _Logger;

function _load_Logger() {
  return _Logger = _interopRequireDefault(require('../Logger'));
}

var _state;

function _load_state() {
  return _state = _interopRequireWildcard(require('../state'));
}

var _Sentry;

function _load_Sentry() {
  return _Sentry = _interopRequireWildcard(require('../Sentry'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const MAX_MESSAGE_LENGTH = 200;
let _projectRootToLogger = {};

function _getLogger(projectRoot) {
  let logger = _projectRootToLogger[projectRoot];
  if (!logger) {
    logger = (_Logger || _load_Logger()).default.child({
      type: 'project',
      project: _path.default.resolve(projectRoot)
    });
    _projectRootToLogger[projectRoot] = logger;
  }

  return logger;
}

function logWithLevel(projectRoot, level, object, msg, id) {
  let useRedux = id && (_Config || _load_Config()).default.useReduxNotifications;

  if (id) {
    object.issueId = id;
  }

  let logger = _getLogger(projectRoot);
  switch (level) {
    case 'debug':
      logger.debug(object, msg);
      break;
    case 'info':
      logger.info(object, msg);
      break;
    case 'warn':
      if (!useRedux) {
        logger.warn(object, msg);
      }
      break;
    case 'error':
      if (!useRedux) {
        logger.error(object, msg);
      }
      break;
    default:
      logger.debug(object, msg);
      break;
  }

  if (useRedux && (level === 'warn' || level === 'error')) {
    (_state || _load_state()).store.dispatch((_state || _load_state()).actions.notifications.add(projectRoot, id, msg, projectRoot, level));
  }
}

function logDebug(projectRoot, tag, message, id) {
  _getLogger(projectRoot).debug({ tag }, message.toString());
}

function logInfo(projectRoot, tag, message, id) {
  if (id && (_Config || _load_Config()).default.useReduxNotifications) {
    (_state || _load_state()).store.dispatch((_state || _load_state()).actions.notifications.add(projectRoot, id, message, tag, 'info'));
  } else {
    const object = { tag };
    if (id) {
      object.issueId = id;
    }
    _getLogger(projectRoot).info(object, message.toString());
  }
}

function logError(projectRoot, tag, message, id) {
  if (id && (_Config || _load_Config()).default.useReduxNotifications) {
    (_state || _load_state()).store.dispatch((_state || _load_state()).actions.notifications.add(projectRoot, id, message, tag, 'error'));
  } else {
    const object = { tag };
    if (id) {
      object.issueId = id;
    }
    _getLogger(projectRoot).error(object, message.toString());
  }

  let truncatedMessage = message.toString();
  if (truncatedMessage.length > MAX_MESSAGE_LENGTH) {
    truncatedMessage = truncatedMessage.substring(0, MAX_MESSAGE_LENGTH);
  }

  // temporarily remove sentry until we can trim events
  // send error to Sentry
  // Sentry.logError(message.toString(), {
  //   tags: { tag },
  // });
}

function logWarning(projectRoot, tag, message, id) {
  if (id && (_Config || _load_Config()).default.useReduxNotifications) {
    (_state || _load_state()).store.dispatch((_state || _load_state()).actions.notifications.add(projectRoot, id, message, tag, 'warn'));
  } else {
    const object = { tag };
    if (id) {
      object.issueId = id;
    }
    _getLogger(projectRoot).warn(object, message.toString());
  }

  let truncatedMessage = message.toString();
  if (truncatedMessage.length > MAX_MESSAGE_LENGTH) {
    truncatedMessage = truncatedMessage.substring(0, MAX_MESSAGE_LENGTH);
  }
  (_Analytics || _load_Analytics()).logEvent('Project Warning', {
    projectRoot,
    tag,
    message: truncatedMessage
  });
}

function clearNotification(projectRoot, id) {
  if ((_Config || _load_Config()).default.useReduxNotifications) {
    (_state || _load_state()).store.dispatch((_state || _load_state()).actions.notifications.clear(projectRoot, id));
  } else {
    _getLogger(projectRoot).info({
      tag: 'expo',
      issueCleared: true,
      issueId: id
    }, `No issue with ${id}`);
  }
}

function attachLoggerStream(projectRoot, stream) {
  _getLogger(projectRoot).addStream(stream);
}

let customConfigPaths = {};
//# sourceMappingURL=../__sourcemaps__/project/ProjectUtils.js.map
