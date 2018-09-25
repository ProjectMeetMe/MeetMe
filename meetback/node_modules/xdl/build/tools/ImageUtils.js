'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setGetImageDimensionsFunction = exports.setResizeImageFunction = exports.resizeImageAsync = exports.getImageDimensionsMacOSAsync = undefined;

/**
 *  @return array [ width, height ] or null if that fails for some reason.
 */
let getImageDimensionsMacOSAsync = (() => {
  var _ref = _asyncToGenerator(function* (dirname, basename) {
    if (process.platform !== 'darwin') {
      (_Logger || _load_Logger()).default.warn('`sips` utility may or may not work outside of macOS');
    }
    let dimensions = null;
    try {
      dimensions = yield _getImageDimensionsAsync(basename, dirname);
    } catch (_) {}
    return dimensions;
  });

  return function getImageDimensionsMacOSAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let resizeImageAsync = (() => {
  var _ref2 = _asyncToGenerator(function* (iconSizePx, iconFilename, destinationIconPath) {
    if (process.platform !== 'darwin' && _resizeImageAsync === _resizeImageWithSipsAsync && !_hasWarned) {
      (_Logger || _load_Logger()).default.warn('`sips` utility may or may not work outside of macOS');
      _hasWarned = true;
    }
    return _resizeImageAsync(iconSizePx, iconFilename, destinationIconPath);
  });

  return function resizeImageAsync(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})();

let _resizeImageWithSipsAsync = (() => {
  var _ref3 = _asyncToGenerator(function* (iconSizePx, iconFilename, destinationIconPath) {
    return (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('sips', ['-Z', iconSizePx, iconFilename], {
      stdio: ['ignore', 'ignore', 'inherit'], // only stderr
      cwd: destinationIconPath
    });
  });

  return function _resizeImageWithSipsAsync(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
})();

let _getImageDimensionsWithSipsAsync = (() => {
  var _ref4 = _asyncToGenerator(function* (basename, dirname) {
    let childProcess = yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', basename], {
      cwd: dirname
    });
    // stdout looks something like 'pixelWidth: 1200\n pixelHeight: 800'
    const components = childProcess.stdout.split(/(\s+)/);
    return components.map(function (c) {
      return parseInt(c, 10);
    }).filter(function (n) {
      return !isNaN(n);
    });
  });

  return function _getImageDimensionsWithSipsAsync(_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
})();

// Allow us to swap out the default implementations of image functions


var _ExponentTools;

function _load_ExponentTools() {
  return _ExponentTools = require('../detach/ExponentTools');
}

var _Logger;

function _load_Logger() {
  return _Logger = _interopRequireDefault(require('../detach/Logger'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let _hasWarned = false;
let _resizeImageAsync = _resizeImageWithSipsAsync;
let _getImageDimensionsAsync = _getImageDimensionsWithSipsAsync;

// Allow users to provide an alternate implementation for our image resize function.
// This is used internally in order to use sharp instead of sips in standalone builder.
function setResizeImageFunction(fn) {
  _resizeImageAsync = fn;
}

// Allow users to provide an alternate implementation for our image dimensions function.
// This is used internally in order to use sharp instead of sips in standalone builder.
function setGetImageDimensionsFunction(fn) {
  _getImageDimensionsAsync = fn;
}

exports.getImageDimensionsMacOSAsync = getImageDimensionsMacOSAsync;
exports.resizeImageAsync = resizeImageAsync;
exports.setResizeImageFunction = setResizeImageFunction;
exports.setGetImageDimensionsFunction = setGetImageDimensionsFunction;
//# sourceMappingURL=../__sourcemaps__/tools/ImageUtils.js.map
