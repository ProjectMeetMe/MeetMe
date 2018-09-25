'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAndWriteIconsToPathAsync = undefined;

let _saveDefaultIconToPathAsync = (() => {
  var _ref = _asyncToGenerator(function* (context, path) {
    if (context.type === 'user') {
      if (context.data.exp.icon) {
        yield (0, (_ExponentTools || _load_ExponentTools()).saveImageToPathAsync)(context.data.projectPath, context.data.exp.icon, path);
      } else {
        throw new Error('Cannot save icon because app.json has no exp.icon key.');
      }
    } else {
      if (context.data.manifest.ios && context.data.manifest.ios.iconUrl) {
        yield (0, (_ExponentTools || _load_ExponentTools()).saveUrlToPathAsync)(context.data.manifest.ios.iconUrl, path);
      } else if (context.data.manifest.iconUrl) {
        yield (0, (_ExponentTools || _load_ExponentTools()).saveUrlToPathAsync)(context.data.manifest.iconUrl, path);
      } else {
        throw new Error('Cannot save icon because manifest has no iconUrl or ios.iconUrl key.');
      }
    }
  });

  return function _saveDefaultIconToPathAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Based on keys in the given context.config,
 * ensure that the proper iOS icon images exist -- assuming Info.plist already
 * points at them under CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles.
 *
 * This only works on MacOS (as far as I know) because it uses the sips utility.
 */


let createAndWriteIconsToPathAsync = (() => {
  var _ref2 = _asyncToGenerator(function* (context, destinationIconPath) {
    let defaultIconFilename = 'exp-icon.png';
    try {
      yield _saveDefaultIconToPathAsync(context, _path.default.join(destinationIconPath, defaultIconFilename));
    } catch (e) {
      defaultIconFilename = null;
      (_Logger || _load_Logger()).default.warn(e.message);
    }

    const iconSizes = [1024, 20, 29, 40, 60, 76, 83.5];

    yield Promise.all(iconSizes.map((() => {
      var _ref3 = _asyncToGenerator(function* (iconSize) {
        let iconResolutions;
        if (iconSize === 76) {
          // iPad has 1x and 2x icons for this size only
          iconResolutions = [1, 2];
        } else if (iconSize == 1024) {
          // marketing icon is weird
          iconResolutions = [1];
        } else if (iconSize === 83.5) {
          iconResolutions = [2];
        } else {
          iconResolutions = [2, 3];
        }

        // We need to wait for all of these to finish!
        yield Promise.all(iconResolutions.map((() => {
          var _ref4 = _asyncToGenerator(function* (iconResolution) {
            let iconQualifier = _getAppleIconQualifier(iconSize, iconResolution);
            let iconKey = `iconUrl${iconQualifier}`;
            let rawIconFilename;
            let usesDefault = false;
            if (context.type === 'service') {
              // TODO(nikki): Support local paths for these icons
              const manifest = context.data.manifest;
              if (manifest.ios && manifest.ios.hasOwnProperty(iconKey)) {
                // manifest specifies an image just for this size/resolution, use that
                rawIconFilename = `exp-icon${iconQualifier}.png`;
                yield (0, (_ExponentTools || _load_ExponentTools()).saveUrlToPathAsync)(manifest.ios[iconKey], `${destinationIconPath}/${rawIconFilename}`);
              }
            }
            if (!rawIconFilename) {
              // use default iconUrl
              usesDefault = true;
              if (defaultIconFilename) {
                rawIconFilename = defaultIconFilename;
              } else {
                (_Logger || _load_Logger()).default.warn(`Project does not specify ios.${iconKey} nor a default iconUrl. Bundle will use the Expo logo.`);
                return;
              }
            }

            let iconFilename = `AppIcon${iconQualifier}.png`;
            let iconSizePx = iconSize * iconResolution;
            yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('/bin/cp', [rawIconFilename, iconFilename], {
              stdio: 'inherit',
              cwd: destinationIconPath
            });
            try {
              yield (0, (_ImageUtils || _load_ImageUtils()).resizeImageAsync)(iconSizePx, iconFilename, destinationIconPath);
            } catch (e) {
              throw new Error(`Failed to resize image: ${iconFilename}. (${e})`);
            }

            // reject non-square icons (because Apple will if we don't)
            const dims = yield (0, (_ImageUtils || _load_ImageUtils()).getImageDimensionsMacOSAsync)(destinationIconPath, iconFilename);
            if (!dims || dims.length < 2 || dims[0] !== dims[1]) {
              if (!dims) {
                throw new Error(`Unable to read the dimensions of ${iconFilename}`);
              } else {
                throw new Error(`iOS icons must be square, the dimensions of ${iconFilename} are ${dims}`);
              }
            }

            if (!usesDefault) {
              // non-default icon used, clean up the downloaded version
              yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('/bin/rm', [_path.default.join(destinationIconPath, rawIconFilename)]);
            }
          });

          return function (_x6) {
            return _ref4.apply(this, arguments);
          };
        })()));
      });

      return function (_x5) {
        return _ref3.apply(this, arguments);
      };
    })()));

    // clean up default icon
    if (defaultIconFilename) {
      yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('/bin/rm', [_path.default.join(destinationIconPath, defaultIconFilename)]);
    }
  });

  return function createAndWriteIconsToPathAsync(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

var _path = _interopRequireDefault(require('path'));

var _ExponentTools;

function _load_ExponentTools() {
  return _ExponentTools = require('./ExponentTools');
}

var _StandaloneContext;

function _load_StandaloneContext() {
  return _StandaloneContext = _interopRequireDefault(require('./StandaloneContext'));
}

var _ImageUtils;

function _load_ImageUtils() {
  return _ImageUtils = require('../tools/ImageUtils');
}

var _Logger;

function _load_Logger() {
  return _Logger = _interopRequireDefault(require('./Logger'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _getAppleIconQualifier(iconSize, iconResolution) {
  let iconQualifier;
  if (iconResolution !== 1) {
    // e.g. "29x29@3x"
    iconQualifier = `${iconSize}x${iconSize}@${iconResolution}x`;
  } else {
    iconQualifier = `${iconSize}x${iconSize}`;
  }
  if (iconSize === 76 || iconSize === 83.5) {
    // ipad sizes require ~ipad at the end
    iconQualifier = `${iconQualifier}~ipad`;
  }
  return iconQualifier;
}

exports.createAndWriteIconsToPathAsync = createAndWriteIconsToPathAsync;
//# sourceMappingURL=../__sourcemaps__/detach/IosIcons.js.map
