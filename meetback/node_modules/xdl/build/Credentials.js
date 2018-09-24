'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backupExistingAndroidCredentials = exports.getExistingDistCerts = exports.removeCredentialsForPlatform = exports.updateCredentialsForPlatform = exports.getCredentialsForPlatform = exports.getEncryptedCredentialsForPlatformAsync = exports.credentialsExistForPlatformAsync = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let credentialsExistForPlatformAsync = exports.credentialsExistForPlatformAsync = (() => {
  var _ref = _asyncToGenerator(function* (metadata) {
    const creds = yield fetchCredentials(metadata, false);
    return !!creds; // !! performed on awaited creds
  });

  return function credentialsExistForPlatformAsync(_x) {
    return _ref.apply(this, arguments);
  };
})();

let getEncryptedCredentialsForPlatformAsync = exports.getEncryptedCredentialsForPlatformAsync = (() => {
  var _ref2 = _asyncToGenerator(function* (metadata) {
    return fetchCredentials(metadata, false);
  });

  return function getEncryptedCredentialsForPlatformAsync(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

let getCredentialsForPlatform = exports.getCredentialsForPlatform = (() => {
  var _ref3 = _asyncToGenerator(function* (metadata) {
    return fetchCredentials(metadata, true);
  });

  return function getCredentialsForPlatform(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

let fetchCredentials = (() => {
  var _ref4 = _asyncToGenerator(function* ({ username, experienceName, bundleIdentifier, platform }, decrypt) {
    // this doesn't hit our mac rpc channel, so it needs significantly less debugging
    const { err, credentials } = yield (_Api || _load_Api()).default.callMethodAsync('getCredentials', [], 'post', {
      username,
      experienceName,
      bundleIdentifier,
      platform,
      decrypt
    });

    if (err) {
      throw new Error('Error fetching credentials.');
    }

    return credentials;
  });

  return function fetchCredentials(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
})();

let updateCredentialsForPlatform = exports.updateCredentialsForPlatform = (() => {
  var _ref5 = _asyncToGenerator(function* (platform, newCredentials, metadata) {
    // this doesn't go through the mac rpc, no request id needed
    const { err, credentials } = yield (_Api || _load_Api()).default.callMethodAsync('updateCredentials', [], 'post', _extends({
      credentials: newCredentials,
      platform
    }, metadata));

    if (err || !credentials) {
      throw new Error('Error updating credentials.');
    }
  });

  return function updateCredentialsForPlatform(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
})();

let removeCredentialsForPlatform = exports.removeCredentialsForPlatform = (() => {
  var _ref6 = _asyncToGenerator(function* (platform, metadata) {
    // doesn't go through mac rpc, no request id needed
    const { err } = yield (_Api || _load_Api()).default.callMethodAsync('deleteCredentials', [], 'post', _extends({
      platform
    }, metadata));

    if (err) {
      throw new Error('Error deleting credentials.');
    }
  });

  return function removeCredentialsForPlatform(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
})();

let getExistingDistCerts = exports.getExistingDistCerts = (() => {
  var _ref7 = _asyncToGenerator(function* (username, appleTeamId) {
    const { err, certs } = yield (_Api || _load_Api()).default.callMethodAsync('getExistingDistCerts', [], 'post', {
      username,
      appleTeamId
    });

    if (err) {
      throw new Error('Error getting existing distribution certificates.');
    }

    return certs.map(function (_ref8) {
      let { usedByApps, certP12, certPassword } = _ref8,
          rest = _objectWithoutProperties(_ref8, ['usedByApps', 'certP12', 'certPassword']);

      const serialNumber = certP12 !== undefined && certPassword !== undefined ? (_IosCodeSigning || _load_IosCodeSigning()).findP12CertSerialNumber(certP12, certPassword) : null;
      return _extends({
        usedByApps: usedByApps && usedByApps.split(';'),
        serialNumber
      }, rest);
    });
  });

  return function getExistingDistCerts(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
})();

let backupExistingAndroidCredentials = exports.backupExistingAndroidCredentials = (() => {
  var _ref9 = _asyncToGenerator(function* ({
    outputPath,
    username,
    experienceName,
    log = (_Logger || _load_Logger()).default.info.bind((_Logger || _load_Logger()).default),
    logSecrets = true
  }) {
    const credentialMetadata = { username, experienceName, platform: 'android' };

    log(`Retreiving Android keystore for ${experienceName}`);

    const credentials = yield getCredentialsForPlatform(credentialMetadata);
    if (!credentials) {
      throw new Error('Unable to fetch credentials for this project. Are you sure they exist?');
    }
    const { keystore, keystorePassword, keystoreAlias: keyAlias, keyPassword } = credentials;

    const storeBuf = Buffer.from(keystore, 'base64');
    log(`Writing keystore to ${outputPath}...`);
    (_fsExtra || _load_fsExtra()).default.writeFileSync(outputPath, storeBuf);
    if (logSecrets) {
      log('Done writing keystore to disk.');
      log(`Save these important values as well:

  Keystore password: ${(_chalk || _load_chalk()).default.bold(keystorePassword)}
  Key alias:         ${(_chalk || _load_chalk()).default.bold(keyAlias)}
  Key password:      ${(_chalk || _load_chalk()).default.bold(keyPassword)}
  `);
      log('All done!');
    }
    return {
      keystorePassword,
      keyAlias,
      keyPassword
    };
  });

  return function backupExistingAndroidCredentials(_x13) {
    return _ref9.apply(this, arguments);
  };
})();

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _Api;

function _load_Api() {
  return _Api = _interopRequireDefault(require('./Api'));
}

var _Logger;

function _load_Logger() {
  return _Logger = _interopRequireDefault(require('./Logger'));
}

var _IosCodeSigning;

function _load_IosCodeSigning() {
  return _IosCodeSigning = _interopRequireWildcard(require('./detach/IosCodeSigning'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=__sourcemaps__/Credentials.js.map
