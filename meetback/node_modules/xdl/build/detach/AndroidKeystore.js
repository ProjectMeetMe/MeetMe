'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createKeystore = undefined;

let createKeystore = exports.createKeystore = (() => {
  var _ref = _asyncToGenerator(function* ({
    keystorePassword,
    keyPassword,
    keystoreFilename,
    keystoreAlias,
    androidPackage
  }) {
    const spawn = (0, (_ExponentTools || _load_ExponentTools()).createSpawner)(BUILD_PHASE);
    return spawn('keytool', '-genkey', '-v', '-storepass', keystorePassword, '-keypass', keyPassword, '-keystore', keystoreFilename, '-alias', keystoreAlias, '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000', '-dname', `CN=${androidPackage},OU=,O=,L=,S=,C=US`, {
      stdoutOnly: true
    });
  });

  return function createKeystore(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _ExponentTools;

function _load_ExponentTools() {
  return _ExponentTools = require('./ExponentTools');
}

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const BUILD_PHASE = 'generating keystore';
//# sourceMappingURL=../__sourcemaps__/detach/AndroidKeystore.js.map
