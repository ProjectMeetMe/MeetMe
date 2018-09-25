'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanUpKeychains = exports.importIntoKeychain = exports.deleteKeychain = exports.createKeychain = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let createKeychain = exports.createKeychain = (() => {
  var _ref = _asyncToGenerator(function* (appUUID, saveResultToFile = true) {
    const BUILD_PHASE = 'creating keychain';
    const logger = (_Logger || _load_Logger()).default.withFields({ buildPhase: BUILD_PHASE });
    const spawn = (0, (_ExponentTools || _load_ExponentTools()).createSpawner)(BUILD_PHASE, logger);

    const name = (0, (_v || _load_v()).default)();
    const password = (0, (_v || _load_v()).default)();
    const path = getKeychainPath(name);

    logger.info('creating new keychain...');
    yield runFastlane(['run', 'create_keychain', `path:${path}`, `password:${password}`, 'unlock:true', 'timeout:360000']);
    yield spawn('security', 'show-keychain-info', path, { stdoutOnly: true });

    logger.info('created new keychain');
    const keychainInfo = {
      name,
      path,
      password
    };

    if (saveResultToFile) {
      const keychainInfoPath = getKeychainInfoPath(appUUID);
      yield (_fsExtra || _load_fsExtra()).default.writeFile(keychainInfoPath, JSON.stringify(keychainInfo));
      logger.info('saved keychain info to %s', keychainInfoPath);
    }

    return keychainInfo;
  });

  return function createKeychain(_x) {
    return _ref.apply(this, arguments);
  };
})();

let deleteKeychain = exports.deleteKeychain = (() => {
  var _ref2 = _asyncToGenerator(function* ({ path, appUUID }) {
    const BUILD_PHASE = 'deleting keychain';
    const logger = (_Logger || _load_Logger()).default.withFields({ buildPhase: BUILD_PHASE });

    logger.info('deleting keychain...');
    yield runFastlane(['run', 'delete_keychain', `keychain_path:${path}`]);

    if (appUUID) {
      const keychainInfoPath = getKeychainInfoPath(appUUID);
      yield (_fsExtra || _load_fsExtra()).default.remove(keychainInfoPath);
    }
  });

  return function deleteKeychain(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

let importIntoKeychain = exports.importIntoKeychain = (() => {
  var _ref3 = _asyncToGenerator(function* ({ keychainPath, certPath, certPassword }) {
    const BUILD_PHASE = 'importing certificate into keychain';
    const logger = (_Logger || _load_Logger()).default.withFields({ buildPhase: BUILD_PHASE });
    const spawn = (0, (_ExponentTools || _load_ExponentTools()).createSpawner)(BUILD_PHASE);

    logger.info('importing certificate into keychain...');
    const args = ['import', certPath, '-A', '-k', keychainPath, '-f', 'pkcs12'];
    if (certPassword) {
      logger.info('certificate has password');
      args.push('-P', certPassword);
    } else {
      logger.info("certificate doesn't have password");
    }
    yield spawn('security', ...args);
    logger.info('imported certificate into keychain');
  });

  return function importIntoKeychain(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

let cleanUpKeychains = exports.cleanUpKeychains = (() => {
  var _ref4 = _asyncToGenerator(function* () {
    try {
      (_Logger || _load_Logger()).default.info('Cleaning up keychains...');
      const { stdout: keychainsListRaw } = yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('security', ['list-keychains'], { stdio: 'pipe' });
      const allKeychainsList = keychainsListRaw.match(/"(.*)"/g).map(function (i) {
        return i.slice(1, i.length - 1);
      });
      const turtleKeychainsList = keychainsListRaw.match(/\/private\/tmp\/xdl\/(.*).keychain/g);
      let shouldCleanSearchList = false;
      if (turtleKeychainsList) {
        for (const keychainPath of turtleKeychainsList) {
          try {
            yield deleteKeychain({ path: keychainPath });
          } catch (err) {
            (_Logger || _load_Logger()).default.warn(`Failed to delete keychain: ${keychainPath}`, err);
            shouldCleanSearchList = true;
          }
        }

        if (shouldCleanSearchList) {
          const newSearchList = (_lodash || _load_lodash()).default.difference(allKeychainsList, turtleKeychainsList);
          yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('security', ['list-keychains', '-s', ...newSearchList], {
            stdio: 'pipe'
          });
        }
      }
      (_Logger || _load_Logger()).default.info('Cleaned up keychains');
    } catch (err) {
      (_Logger || _load_Logger()).default.error(err);
      throw new Error('Failed to clean up keychains');
    }
  });

  return function cleanUpKeychains() {
    return _ref4.apply(this, arguments);
  };
})();

let runFastlane = (() => {
  var _ref5 = _asyncToGenerator(function* (fastlaneArgs) {
    const fastlaneEnvVars = {
      FASTLANE_DISABLE_COLORS: 1,
      FASTLANE_SKIP_UPDATE_CHECK: 1,
      CI: 1,
      LC_ALL: 'en_US.UTF-8'
    };
    yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('fastlane', fastlaneArgs, {
      env: _extends({}, process.env, fastlaneEnvVars)
    });
  });

  return function runFastlane(_x4) {
    return _ref5.apply(this, arguments);
  };
})();

var _v;

function _load_v() {
  return _v = _interopRequireDefault(require('uuid/v1'));
}

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _Logger;

function _load_Logger() {
  return _Logger = _interopRequireDefault(require('./Logger'));
}

var _ExponentTools;

function _load_ExponentTools() {
  return _ExponentTools = require('./ExponentTools');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getKeychainPath = name => `/private/tmp/xdl/${name}.keychain`;
const getKeychainInfoPath = appUUID => `/private/tmp/${appUUID}-keychain-info.json`;
//# sourceMappingURL=../__sourcemaps__/detach/IosKeychain.js.map
