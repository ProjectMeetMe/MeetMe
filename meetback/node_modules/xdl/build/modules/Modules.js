'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getAllForPlatform = getAllForPlatform;
exports.getAllNativeForExpoClientOnPlatform = getAllNativeForExpoClientOnPlatform;
exports.getVersionableModulesForPlatform = getVersionableModulesForPlatform;
exports.getDetachableModulesForPlatformAndSdkVersion = getDetachableModulesForPlatformAndSdkVersion;
exports.getPublishableModules = getPublishableModules;

var _semver;

function _load_semver() {
  return _semver = _interopRequireDefault(require('semver'));
}

var _config;

function _load_config() {
  return _config = require('./config');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapForPlatform(platform) {
  return moduleConfig => _extends({}, moduleConfig, moduleConfig.config[platform]);
}

function getAllForPlatform(platform) {
  return (_config || _load_config()).expoSdkUniversalModulesConfigs.map(mapForPlatform(platform));
}

function getAllNativeForExpoClientOnPlatform(platform) {
  return getAllForPlatform(platform).filter(moduleConfig => moduleConfig.includeInExpoClient && moduleConfig.isNativeModule);
}

function getVersionableModulesForPlatform(platform) {
  return getAllNativeForExpoClientOnPlatform(platform).filter(moduleConfig => {
    return moduleConfig.versionable;
  });
}

function getDetachableModulesForPlatformAndSdkVersion(platform, sdkVersion) {
  return getAllForPlatform(platform).filter(moduleConfig => {
    return moduleConfig.isNativeModule && moduleConfig.detachable && (_semver || _load_semver()).default.satisfies(sdkVersion, moduleConfig.sdkVersions);
  });
}

function getPublishableModules() {
  return (_config || _load_config()).expoSdkUniversalModulesConfigs.filter(moduleConfig => !!moduleConfig.libName);
}
//# sourceMappingURL=../__sourcemaps__/modules/Modules.js.map
