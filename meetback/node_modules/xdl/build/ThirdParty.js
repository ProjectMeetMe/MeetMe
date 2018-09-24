'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getManifest = undefined;

let getManifest = exports.getManifest = (() => {
  var _ref = _asyncToGenerator(function* (publicUrl, opts = {}) {
    const req = {
      url: publicUrl,
      method: 'get',
      headers: { Accept: 'application/expo+json,application/json' }
    };

    let exp;
    try {
      const resp = yield (_axios || _load_axios()).default.request(req);
      exp = resp.data;
    } catch (e) {
      throw new (_XDLError || _load_XDLError()).default((_ErrorCode || _load_ErrorCode()).default.INVALID_MANIFEST, `Unable to fetch manifest from ${publicUrl}. ` + e.toString());
    }
    exp = yield _extractManifest(exp, publicUrl);
    if (opts.platform && exp.platform !== opts.platform && opts.platform !== 'all') {
      throw new (_XDLError || _load_XDLError()).default((_ErrorCode || _load_ErrorCode()).default.INVALID_MANIFEST, `Manifest from ${publicUrl} is not compatible with the ${opts.platform} platform`);
    }
    return exp;
  });

  return function getManifest(_x) {
    return _ref.apply(this, arguments);
  };
})();

// Third party publicUrls can return an array of manifests
// We need to choose the first compatible one


let _extractManifest = (() => {
  var _ref2 = _asyncToGenerator(function* (expOrArray, publicUrl) {
    // if its not an array, assume it was a single manifest obj
    if (!Array.isArray(expOrArray)) {
      return expOrArray;
    }

    const { sdkVersions } = yield (_Versions || _load_Versions()).versionsAsync();
    for (let i = 0; i < expOrArray.length; i++) {
      const manifestCandidate = expOrArray[i];
      const sdkVersion = manifestCandidate.sdkVersion;
      if (!sdkVersion) {
        continue;
      }
      const versionObj = sdkVersions[sdkVersion];
      if (!versionObj) {
        continue;
      }

      const isDeprecated = versionObj.isDeprecated || false;
      if (!isDeprecated) {
        return manifestCandidate;
      }
    }
    const supportedVersions = Object.keys(sdkVersions);
    throw new (_XDLError || _load_XDLError()).default((_ErrorCode || _load_ErrorCode()).default.INVALID_MANIFEST, `No compatible manifest found at ${publicUrl}. Please use one of the SDK versions supported: ${JSON.stringify(supportedVersions)}`);
  });

  return function _extractManifest(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var _axios;

function _load_axios() {
  return _axios = _interopRequireDefault(require('axios'));
}

var _ErrorCode;

function _load_ErrorCode() {
  return _ErrorCode = _interopRequireDefault(require('./ErrorCode'));
}

var _Versions;

function _load_Versions() {
  return _Versions = _interopRequireWildcard(require('./Versions'));
}

var _XDLError;

function _load_XDLError() {
  return _XDLError = _interopRequireDefault(require('./XDLError'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=__sourcemaps__/ThirdParty.js.map
