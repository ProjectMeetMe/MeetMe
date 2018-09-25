'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundleAsync = undefined;

let bundleAsync = exports.bundleAsync = (() => {
  var _ref = _asyncToGenerator(function* (assets, dest, oldFormat = false) {
    if (!assets) {
      return;
    }
    // Compat with exp 46.x.x, can remove when this version is phasing out.
    if (typeof assets[0] === 'object') {
      assets = assets.reduce(function (res, cur) {
        return res.concat(cur.fileHashes.map(function (h) {
          return 'asset_' + h + (cur.type ? '.' + cur.type : '');
        }));
      }, []);
    }

    yield (_fsExtra || _load_fsExtra()).default.ensureDir(dest);

    const batches = (_lodash || _load_lodash()).default.chunk(assets, 5);
    for (const batch of batches) {
      yield Promise.all(batch.map((() => {
        var _ref2 = _asyncToGenerator(function* (asset) {
          const extensionIndex = asset.lastIndexOf('.');
          const prefixLength = 'asset_'.length;
          const hash = extensionIndex >= 0 ? asset.substring(prefixLength, extensionIndex) : asset.substring(prefixLength);
          yield (0, (_ExponentTools || _load_ExponentTools()).saveUrlToPathAsync)('https://d1wp6m56sqw74a.cloudfront.net/~assets/' + hash,
          // For sdk24 the runtime expects only the hash as the filename.
          _path.default.join(dest, oldFormat ? hash : asset));
        });

        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      })()));
    }
  });

  return function bundleAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _path = _interopRequireDefault(require('path'));

var _ExponentTools;

function _load_ExponentTools() {
  return _ExponentTools = require('./ExponentTools');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // Copyright 2015-present 650 Industries. All rights reserved.
//# sourceMappingURL=../__sourcemaps__/detach/AssetBundle.js.map
