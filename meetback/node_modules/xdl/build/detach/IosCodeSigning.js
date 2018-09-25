'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resignIPA = exports.createEntitlementsFile = exports.resolveExportMethod = exports.buildIPA = exports.writeExportOptionsPlistFile = exports.validateProvisioningProfile = exports.findP12CertSerialNumber = exports.ensureCertificateValid = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let ensureCertificateValid = (() => {
  var _ref = _asyncToGenerator(function* ({ certPath, certPassword, teamID }) {
    const certData = yield (_fsExtra || _load_fsExtra()).default.readFile(certPath);
    const fingerprint = _genP12CertFingerprint(certData, certPassword);
    const identities = yield _findIdentitiesByTeamID(teamID);
    const isValid = identities.indexOf(fingerprint) !== -1;
    if (!isValid) {
      throw new Error(`codesign ident not present in find-identity: ${fingerprint}\n${identities}`);
    }
    return fingerprint;
  });

  return function ensureCertificateValid(_x) {
    return _ref.apply(this, arguments);
  };
})();

let _findIdentitiesByTeamID = (() => {
  var _ref2 = _asyncToGenerator(function* (teamID) {
    const { output } = yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('security', ['find-identity', '-v', '-s', `(${teamID})`], {
      stdio: 'pipe'
    });
    return output.join('');
  });

  return function _findIdentitiesByTeamID(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

let writeExportOptionsPlistFile = (() => {
  var _ref3 = _asyncToGenerator(function* (plistPath, data) {
    const toWrite = createExportOptionsPlist(data);
    yield (_fsExtra || _load_fsExtra()).default.writeFile(plistPath, toWrite);
  });

  return function writeExportOptionsPlistFile(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
})();

let buildIPA = (() => {
  var _ref4 = _asyncToGenerator(function* ({
    ipaPath,
    workspace,
    archivePath,
    codeSignIdentity,
    exportOptionsPlistPath,
    plistData,
    keychainPath,
    exportMethod
  }, credentials, client = false) {
    if (client) {
      yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('xcodebuild', ['-exportArchive', '-archivePath', archivePath, '-exportOptionsPlist', exportOptionsPlistPath, '-exportPath', _path.default.Dir(ipaPath), `OTHER_CODE_SIGN_FLAGS="--keychain ${keychainPath}"`], {
        env: _extends({}, process.env, { CI: 1 })
      });
    } else {
      yield runFastlane(credentials, ['gym', '-n', _path.default.basename(ipaPath), '--workspace', workspace, '--scheme', 'ExpoKitApp', '--archive_path', archivePath, '--skip_build_archive', 'true', '-i', codeSignIdentity, '--export_options', exportOptionsPlistPath, '--export_method', exportMethod, '--export_xcargs', `OTHER_CODE_SIGN_FLAGS="--keychain ${keychainPath}"`, '-o', _path.default.dirname(ipaPath), '--verbose'], { buildPhase: 'building and signing IPA' });
    }
  });

  return function buildIPA(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
})();

let createEntitlementsFile = (() => {
  var _ref5 = _asyncToGenerator(function* ({
    generatedEntitlementsPath,
    plistData,
    archivePath,
    manifest
  }) {
    const decodedProvisioningProfileEntitlements = plistData.Entitlements;

    const entitlementsPattern = _path.default.join(archivePath, 'Products/Applications/ExpoKitApp.app/*.entitlements');
    const entitlementsPaths = yield (0, (_globPromise || _load_globPromise()).default)(entitlementsPattern);
    if (entitlementsPaths.length === 0) {
      throw new Error("Didn't find any generated entitlements file in archive.");
    } else if (entitlementsPaths.length !== 1) {
      throw new Error('Found more than one entitlements file.');
    }
    const archiveEntitlementsPath = entitlementsPaths[0];
    const archiveEntitlementsRaw = yield (_fsExtra || _load_fsExtra()).default.readFile(archiveEntitlementsPath);
    const archiveEntitlementsData = (_lodash || _load_lodash()).default.attempt((_plist || _load_plist()).default.parse, String(archiveEntitlementsRaw));
    if ((_lodash || _load_lodash()).default.isError(archiveEntitlementsData)) {
      throw new Error(`Error when parsing plist: ${archiveEntitlementsData.message}`);
    }

    const entitlements = _extends({}, decodedProvisioningProfileEntitlements);

    entitlementTransferRules.forEach(function (rule) {
      if (rule in archiveEntitlementsData) {
        entitlements[rule] = archiveEntitlementsData[rule];
      }
    });

    let generatedEntitlements = (_lodash || _load_lodash()).default.omit(entitlements, blacklistedEntitlementKeys);

    if (!manifest.ios.usesIcloudStorage) {
      generatedEntitlements = (_lodash || _load_lodash()).default.omit(generatedEntitlements, blacklistedEntitlementKeysWithoutICloud);
    } else {
      const ubiquityKvKey = 'com.apple.developer.ubiquity-kvstore-identifier';
      if (generatedEntitlements[ubiquityKvKey]) {
        const teamId = generatedEntitlements[ubiquityKvKey].split('.')[0];
        generatedEntitlements[ubiquityKvKey] = `${teamId}.${manifest.ios.bundleIdentifier}`;
      }
      generatedEntitlements['com.apple.developer.icloud-services'] = ['CloudDocuments'];
    }
    if (!manifest.ios.associatedDomains) {
      generatedEntitlements = (_lodash || _load_lodash()).default.omit(generatedEntitlements, 'com.apple.developer.associated-domains');
    }
    if (generatedEntitlements[icloudContainerEnvKey]) {
      const envs = generatedEntitlements[icloudContainerEnvKey].filter(function (i) {
        return i === 'Production';
      });
      generatedEntitlements[icloudContainerEnvKey] = envs;
    }

    const generatedEntitlementsPlistData = (_lodash || _load_lodash()).default.attempt((_plist || _load_plist()).default.build, generatedEntitlements);
    yield (_fsExtra || _load_fsExtra()).default.writeFile(generatedEntitlementsPath, generatedEntitlementsPlistData, {
      mode: 0o755
    });
    const { output } = yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('/usr/libexec/PlistBuddy', ['-x', '-c', 'Print', generatedEntitlementsPath], {
      stdio: 'pipe'
    });
    const plistDataReformatted = output.join('');
    yield (_fsExtra || _load_fsExtra()).default.writeFile(generatedEntitlementsPath, plistDataReformatted, {
      mode: 0o755
    });
  });

  return function createEntitlementsFile(_x7) {
    return _ref5.apply(this, arguments);
  };
})();

let resignIPA = (() => {
  var _ref6 = _asyncToGenerator(function* ({
    codeSignIdentity,
    entitlementsPath,
    provisioningProfilePath,
    sourceIpaPath,
    destIpaPath,
    keychainPath
  }, credentials) {
    yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('cp', ['-rf', sourceIpaPath, destIpaPath]);
    yield runFastlane(credentials, ['sigh', 'resign', '--verbose', '--entitlements', entitlementsPath, '--signing_identity', codeSignIdentity, '--keychain_path', keychainPath, '--provisioning_profile', provisioningProfilePath, destIpaPath], { buildPhase: 'building and signing IPA' });
  });

  return function resignIPA(_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
})();

let runFastlane = (() => {
  var _ref7 = _asyncToGenerator(function* ({ teamID }, fastlaneArgs, loggerFields) {
    const fastlaneEnvVars = {
      FASTLANE_SKIP_UPDATE_CHECK: 1,
      FASTLANE_DISABLE_COLORS: 1,
      FASTLANE_TEAM_ID: teamID,
      CI: 1,
      LC_ALL: 'en_US.UTF-8'
    };

    yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('fastlane', fastlaneArgs, {
      env: _extends({}, process.env, fastlaneEnvVars),
      pipeToLogger: true,
      dontShowStdout: false,
      loggerFields
    });
  });

  return function runFastlane(_x10, _x11, _x12) {
    return _ref7.apply(this, arguments);
  };
})();

var _nodeForge;

function _load_nodeForge() {
  return _nodeForge = _interopRequireDefault(require('node-forge'));
}

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _path = _interopRequireDefault(require('path'));

var _globPromise;

function _load_globPromise() {
  return _globPromise = _interopRequireDefault(require('glob-promise'));
}

var _plist;

function _load_plist() {
  return _plist = _interopRequireDefault(require('plist'));
}

var _crypto = _interopRequireDefault(require('crypto'));

var _ExponentTools;

function _load_ExponentTools() {
  return _ExponentTools = require('./ExponentTools');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _genP12CertFingerprint(p12Buffer, passwordRaw) {
  const certData = _getCertData(p12Buffer, passwordRaw);
  const certAsn1 = (_nodeForge || _load_nodeForge()).default.pki.certificateToAsn1(certData);
  const certDer = (_nodeForge || _load_nodeForge()).default.asn1.toDer(certAsn1).getBytes();
  return (_nodeForge || _load_nodeForge()).default.md.sha1.create().update(certDer).digest().toHex().toUpperCase();
}

function findP12CertSerialNumber(p12Buffer, passwordRaw) {
  const certData = _getCertData(p12Buffer, passwordRaw);
  const { serialNumber } = certData;
  return serialNumber ? certData.serialNumber.replace(/^0+/, '').toUpperCase() : null;
}

function _getCertData(p12Buffer, passwordRaw) {
  if (Buffer.isBuffer(p12Buffer)) {
    p12Buffer = p12Buffer.toString('base64');
  } else if (typeof p12Buffer !== 'string') {
    throw new Error('_getCertData only takes strings and buffers.');
  }

  const password = String(passwordRaw || '');
  const p12Der = (_nodeForge || _load_nodeForge()).default.util.decode64(p12Buffer);
  const p12Asn1 = (_nodeForge || _load_nodeForge()).default.asn1.fromDer(p12Der);
  const p12 = (_nodeForge || _load_nodeForge()).default.pkcs12.pkcs12FromAsn1(p12Asn1, password);
  const certBagType = (_nodeForge || _load_nodeForge()).default.pki.oids.certBag;
  const certData = (_lodash || _load_lodash()).default.get(p12.getBags({ bagType: certBagType }), [certBagType, 0, 'cert']);
  if (!certData) {
    throw new Error("_getCertData: couldn't find cert bag");
  }
  return certData;
}

function validateProvisioningProfile(plistData, { distCertFingerprint, bundleIdentifier }) {
  _ensureDeveloperCertificateIsValid(plistData, distCertFingerprint);
  _ensureBundleIdentifierIsValid(plistData, bundleIdentifier);
}

function _ensureDeveloperCertificateIsValid(plistData, distCertFingerprint) {
  const devCertBase64 = plistData.DeveloperCertificates[0];
  const devCertFingerprint = _genDerCertFingerprint(devCertBase64);
  if (devCertFingerprint !== distCertFingerprint) {
    throw new Error('validateProvisioningProfile: provisioning profile is not associated with uploaded distribution certificate');
  }
}

function _genDerCertFingerprint(certBase64) {
  const certBuffer = Buffer.from(certBase64, 'base64');
  return _crypto.default.createHash('sha1').update(certBuffer).digest('hex').toUpperCase();
}

function _ensureBundleIdentifierIsValid(plistData, expectedBundleIdentifier) {
  const actualApplicationIdentifier = plistData.Entitlements['application-identifier'];
  const actualBundleIdentifier = /\.(.+)/.exec(actualApplicationIdentifier)[1];

  if (expectedBundleIdentifier !== actualBundleIdentifier) {
    throw new Error(`validateProvisioningProfile: wrong bundleIdentifier found in provisioning profile; expected: ${expectedBundleIdentifier}, found (in provisioning profile): ${actualBundleIdentifier}`);
  }
}

const createExportOptionsPlist = ({
  bundleIdentifier,
  provisioningProfileUUID,
  exportMethod,
  teamID
}) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>method</key>
    <string>${exportMethod}</string>
    <key>teamID</key>
    <string>${teamID}</string>
    <key>provisioningProfiles</key>
    <dict>
      <key>${bundleIdentifier}</key>
      <string>${provisioningProfileUUID}</string>
    </dict>
  </dict>
</plist>`;

const resolveExportMethod = plistData => {
  if (plistData.ProvisionedDevices) {
    return 'ad-hoc';
  } else if (plistData.ProvisionsAllDevices === true) {
    return 'enterprise';
  } else {
    return 'app-store';
  }
};

const entitlementTransferRules = ['com.apple.developer.associated-domains', 'com.apple.developer.healthkit', 'com.apple.developer.homekit', 'com.apple.developer.icloud-container-identifiers', 'com.apple.developer.icloud-services', 'com.apple.developer.in-app-payments', 'com.apple.developer.networking.vpn.api', 'com.apple.developer.ubiquity-container-identifiers', 'com.apple.developer.ubiquity-kvstore-identifier', 'com.apple.external-accessory.wireless-configuration', 'com.apple.security.application-groups', 'inter-app-audio', 'keychain-access-groups'];

const blacklistedEntitlementKeysWithoutICloud = ['com.apple.developer.icloud-container-environment', 'com.apple.developer.icloud-container-identifiers', 'com.apple.developer.icloud-services', 'com.apple.developer.ubiquity-container-identifiers', 'com.apple.developer.ubiquity-kvstore-identifier'];

const blacklistedEntitlementKeys = ['com.apple.developer.icloud-container-development-container-identifiers', 'com.apple.developer.restricted-resource-mode', 'inter-app-audio', 'com.apple.developer.homekit', 'com.apple.developer.healthkit', 'com.apple.developer.in-app-payments', 'com.apple.developer.maps', 'com.apple.external-accessory.wireless-configuration'];

const icloudContainerEnvKey = 'com.apple.developer.icloud-container-environment';

exports.ensureCertificateValid = ensureCertificateValid;
exports.findP12CertSerialNumber = findP12CertSerialNumber;
exports.validateProvisioningProfile = validateProvisioningProfile;
exports.writeExportOptionsPlistFile = writeExportOptionsPlistFile;
exports.buildIPA = buildIPA;
exports.resolveExportMethod = resolveExportMethod;
exports.createEntitlementsFile = createEntitlementsFile;
exports.resignIPA = resignIPA;
//# sourceMappingURL=../__sourcemaps__/detach/IosCodeSigning.js.map
