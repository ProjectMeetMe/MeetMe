// Copyright 2015-present 650 Industries. All rights reserved.

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSpawner = exports.deleteLinesInFileAsync = exports.regexFileAsync = exports.getResolvedLocalesAsync = exports.manifestUsesSplashApi = exports.transformFileContentsAsync = exports.spawnAsync = exports.spawnAsyncThrowError = exports.rimrafDontThrow = exports.getManifestAsync = exports.saveImageToPathAsync = exports.saveUrlToPathAsync = exports.parseSdkMajorVersion = exports.isDirectory = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let getManifestAsync = (() => {
  var _ref = _asyncToGenerator(function* (url, headers) {
    const buildPhaseLogger = (_Logger || _load_Logger()).default.withFields({ buildPhase: 'reading manifest' });
    const requestOptions = {
      url: url.replace('exp://', 'http://'),
      headers
    };

    let response;
    try {
      response = yield _retryPromise(function () {
        return request(requestOptions);
      });
    } catch (err) {
      buildPhaseLogger.error(err);
      throw new Error('Failed to fetch manifest from www');
    }
    const responseBody = response.body;
    buildPhaseLogger.info('Using manifest:', responseBody);
    let manifest;
    try {
      manifest = JSON.parse(responseBody);
    } catch (e) {
      throw new Error(`Unable to parse manifest: ${e}`);
    }

    return manifest;
  });

  return function getManifestAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let _retryPromise = (() => {
  var _ref2 = _asyncToGenerator(function* (fn, retries = 5) {
    try {
      return yield fn();
    } catch (err) {
      if (retries-- > 0) {
        return yield _retryPromise(fn, retries);
      } else {
        throw err;
      }
    }
  });

  return function _retryPromise(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

let spawnAsyncThrowError = (() => {
  var _ref3 = _asyncToGenerator(function* (...args) {
    if (args.length === 2) {
      return (0, (_spawnAsync || _load_spawnAsync()).default)(args[0], args[1], {
        stdio: 'inherit',
        cwd: process.cwd()
      });
    } else {
      const options = args[2];
      const { pipeToLogger } = options;
      if (pipeToLogger) {
        options.stdio = 'pipe';
        options.cwd = options.cwd || process.cwd();
      }
      const promise = (0, (_spawnAsync || _load_spawnAsync()).default)(...args);
      if (pipeToLogger && promise.child) {
        const streamsKeys = (_lodash || _load_lodash()).default.isObject(pipeToLogger) ? (_lodash || _load_lodash()).default.keys((_lodash || _load_lodash()).default.pickBy(pipeToLogger, (_lodash || _load_lodash()).default.identity)) : ['stdout', 'stderr'];
        const streamsToLogs = (_lodash || _load_lodash()).default.pick(promise.child, streamsKeys);
        (0, (_Logger2 || _load_Logger2()).pipeOutputToLogger)(streamsToLogs, options.loggerFields, options);
      }
      return promise;
    }
  });

  return function spawnAsyncThrowError() {
    return _ref3.apply(this, arguments);
  };
})();

let spawnAsync = (() => {
  var _ref4 = _asyncToGenerator(function* (...args) {
    try {
      return yield spawnAsyncThrowError(...args);
    } catch (e) {
      (_Logger || _load_Logger()).default.error(e.message);
    }
  });

  return function spawnAsync() {
    return _ref4.apply(this, arguments);
  };
})();

let transformFileContentsAsync = (() => {
  var _ref5 = _asyncToGenerator(function* (filename, transform) {
    let fileString = yield (_fsExtra || _load_fsExtra()).default.readFile(filename, 'utf8');
    let newFileString = transform(fileString);
    if (newFileString !== null) {
      yield (_fsExtra || _load_fsExtra()).default.writeFile(filename, newFileString);
    }
  });

  return function transformFileContentsAsync(_x4, _x5) {
    return _ref5.apply(this, arguments);
  };
})();

let getResolvedLocalesAsync = (() => {
  var _ref6 = _asyncToGenerator(function* (inMemoryManifest) {
    const locales = {};
    if (inMemoryManifest.locales !== undefined) {
      for (const [lang, path] of Object.entries(inMemoryManifest.locales)) {
        const s = yield (_fsExtra || _load_fsExtra()).default.readFile(path, 'utf8');
        try {
          locales[lang] = JSON.parse(s);
        } catch (e) {
          throw new (_XDLError || _load_XDLError()).default((_ErrorCode || _load_ErrorCode()).default.INVALID_JSON, JSON.stringify(e));
        }
      }
    }
    return locales;
  });

  return function getResolvedLocalesAsync(_x6) {
    return _ref6.apply(this, arguments);
  };
})();

let regexFileAsync = (() => {
  var _ref7 = _asyncToGenerator(function* (regex, replace, filename) {
    let file = yield (_fsExtra || _load_fsExtra()).default.readFile(filename);
    let fileString = file.toString();
    yield (_fsExtra || _load_fsExtra()).default.writeFile(filename, fileString.replace(regex, replace));
  });

  return function regexFileAsync(_x7, _x8, _x9) {
    return _ref7.apply(this, arguments);
  };
})();

// Matches sed /d behavior


let deleteLinesInFileAsync = (() => {
  var _ref8 = _asyncToGenerator(function* (startRegex, endRegex, filename) {
    let file = yield (_fsExtra || _load_fsExtra()).default.readFile(filename);
    let fileString = file.toString();
    let lines = fileString.split(/\r?\n/);
    let filteredLines = [];
    let inDeleteRange = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(startRegex)) {
        inDeleteRange = true;
      }

      if (!inDeleteRange) {
        filteredLines.push(lines[i]);
      }

      if (inDeleteRange && lines[i].match(endRegex)) {
        inDeleteRange = false;
      }
    }
    yield (_fsExtra || _load_fsExtra()).default.writeFile(filename, filteredLines.join('\n'));
  });

  return function deleteLinesInFileAsync(_x10, _x11, _x12) {
    return _ref8.apply(this, arguments);
  };
})();

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _path = _interopRequireDefault(require('path'));

var _requestPromiseNative;

function _load_requestPromiseNative() {
  return _requestPromiseNative = _interopRequireDefault(require('request-promise-native'));
}

var _request;

function _load_request() {
  return _request = _interopRequireDefault(require('request'));
}

var _rimraf;

function _load_rimraf() {
  return _rimraf = _interopRequireDefault(require('rimraf'));
}

var _spawnAsync;

function _load_spawnAsync() {
  return _spawnAsync = _interopRequireDefault(require('@expo/spawn-async'));
}

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _Logger;

function _load_Logger() {
  return _Logger = _interopRequireDefault(require('./Logger'));
}

var _Logger2;

function _load_Logger2() {
  return _Logger2 = require('./Logger');
}

var _XDLError;

function _load_XDLError() {
  return _XDLError = _interopRequireDefault(require('../XDLError'));
}

var _ErrorCode;

function _load_ErrorCode() {
  return _ErrorCode = _interopRequireDefault(require('../ErrorCode'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// `request-promise-native` discourages using pipe. Noticed some issues with
// error handling so when using pipe use the original request lib instead.


const request = (_requestPromiseNative || _load_requestPromiseNative()).default.defaults({
  resolveWithFullResponse: true
});

function _getFilesizeInBytes(path) {
  let stats = (_fsExtra || _load_fsExtra()).default.statSync(path);
  let fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
}

function parseSdkMajorVersion(expSdkVersion) {
  // We assume that the unversioned SDK is the latest
  if (expSdkVersion === 'UNVERSIONED') {
    return Infinity;
  }

  let sdkMajorVersion = 0;
  try {
    let versionComponents = expSdkVersion.split('.').map(number => parseInt(number, 10));
    sdkMajorVersion = versionComponents[0];
  } catch (_) {}
  return sdkMajorVersion;
}

function saveUrlToPathAsync(url, path) {
  return new Promise(function (resolve, reject) {
    let stream = (_fsExtra || _load_fsExtra()).default.createWriteStream(path);
    stream.on('close', () => {
      if (_getFilesizeInBytes(path) < 10) {
        throw new Error(`{filename} is too small`);
      }
      resolve();
    });
    stream.on('error', reject);
    (0, (_request || _load_request()).default)(url).pipe(stream);
  });
}

function saveImageToPathAsync(projectRoot, pathOrURL, outPath) {
  const localPath = _path.default.resolve(projectRoot, pathOrURL);
  return new Promise(function (resolve, reject) {
    let stream = (_fsExtra || _load_fsExtra()).default.createWriteStream(outPath);
    stream.on('close', () => {
      if (_getFilesizeInBytes(outPath) < 10) {
        throw new Error(`{filename} is too small`);
      }
      resolve();
    });
    stream.on('error', reject);
    if ((_fsExtra || _load_fsExtra()).default.existsSync(localPath)) {
      (_fsExtra || _load_fsExtra()).default.createReadStream(localPath).pipe(stream);
    } else {
      (0, (_request || _load_request()).default)(pathOrURL).pipe(stream);
    }
  });
}

function createSpawner(buildPhase, logger) {
  return (command, ...args) => {
    const lastArg = (_lodash || _load_lodash()).default.last(args);
    const optionsFromArg = (_lodash || _load_lodash()).default.isObject(lastArg) ? args.pop() : {};

    const options = _extends({}, optionsFromArg, { pipeToLogger: true });
    if (buildPhase) {
      options.loggerFields = options.loggerFields ? options.loggerFields : {};
      options.loggerFields = _extends({}, options.loggerFields, { buildPhase });
    }

    if (logger) {
      logger.info('Executing command:', command, ...args);
    }
    return spawnAsyncThrowError(command, args, options);
  };
}

function manifestUsesSplashApi(manifest, platform) {
  if (platform === 'ios') {
    return manifest.splash || manifest.ios && manifest.ios.splash;
  }
  if (platform === 'android') {
    return manifest.splash || manifest.android && manifest.android.splash;
  }
  return false;
}

function rimrafDontThrow(directory) {
  try {
    (_rimraf || _load_rimraf()).default.sync(directory);
  } catch (e) {
    (_Logger || _load_Logger()).default.warn(`There was an issue cleaning up, but your project should still work. You may need to manually remove ${directory}. (${e})`);
  }
}

function isDirectory(dir) {
  try {
    if ((_fsExtra || _load_fsExtra()).default.statSync(dir).isDirectory()) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

exports.isDirectory = isDirectory;
exports.parseSdkMajorVersion = parseSdkMajorVersion;
exports.saveUrlToPathAsync = saveUrlToPathAsync;
exports.saveImageToPathAsync = saveImageToPathAsync;
exports.getManifestAsync = getManifestAsync;
exports.rimrafDontThrow = rimrafDontThrow;
exports.spawnAsyncThrowError = spawnAsyncThrowError;
exports.spawnAsync = spawnAsync;
exports.transformFileContentsAsync = transformFileContentsAsync;
exports.manifestUsesSplashApi = manifestUsesSplashApi;
exports.getResolvedLocalesAsync = getResolvedLocalesAsync;
exports.regexFileAsync = regexFileAsync;
exports.deleteLinesInFileAsync = deleteLinesInFileAsync;
exports.createSpawner = createSpawner;
//# sourceMappingURL=../__sourcemaps__/detach/ExponentTools.js.map
