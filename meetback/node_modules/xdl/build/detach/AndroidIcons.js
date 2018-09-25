'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAndWriteIconsToPathAsync = undefined;

let _regexFileInResSubfoldersAsync = (() => {
  var _ref = _asyncToGenerator(function* (oldText, newText, resDirPath, folderPrefix, folderSuffix, fileName) {
    return Promise.all(Object.keys(iconScales).map((() => {
      var _ref2 = _asyncToGenerator(function* (key) {
        return (0, (_ExponentTools || _load_ExponentTools()).regexFileAsync)(oldText, newText, _path.default.join(resDirPath, `${folderPrefix}${key}${folderSuffix}`, fileName));
      });

      return function (_x7) {
        return _ref2.apply(this, arguments);
      };
    })()));
  });

  return function _regexFileInResSubfoldersAsync(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
})();

let _resizeIconsAsync = (() => {
  var _ref3 = _asyncToGenerator(function* (context, resPath, prefix, mdpiSize, filename, url, isDetached) {
    let baseImagePath = _path.default.join(resPath, filename);

    try {
      if (isDetached) {
        yield (0, (_ExponentTools || _load_ExponentTools()).saveImageToPathAsync)(context.data.projectPath, url, baseImagePath);
      } else {
        yield (0, (_ExponentTools || _load_ExponentTools()).saveUrlToPathAsync)(url, baseImagePath);
      }
    } catch (e) {
      throw new Error(`Failed to save icon file to disk. (${e})`);
    }

    yield Promise.all(Object.entries(iconScales).map((() => {
      var _ref4 = _asyncToGenerator(function* ([folderSuffix, iconScale]) {
        // adaptive icons (mdpiSize 108) must be placed in a -v26 folder
        let subdirectoryName = `${prefix}${folderSuffix}${mdpiSize === 108 ? '-v26' : ''}`;
        let destinationPath = _path.default.join(resPath, subdirectoryName);
        yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('/bin/cp', [baseImagePath, filename], {
          stdio: 'inherit',
          cwd: destinationPath
        });

        try {
          yield (0, (_ImageUtils || _load_ImageUtils()).resizeImageAsync)(mdpiSize * iconScale, filename, destinationPath);
        } catch (e) {
          // Turtle should be able to resize images, so if it fails we want it to throw.
          // However, `sips` does not exist on Windows or Linux machines, so we expect
          // resizing images to error on these OSes and want the detach process to continue anyway.
          if (isDetached) {
            if (!_hasShownResizeErrorWindowsLinux) {
              console.warn('Failed to resize app icons. Your full size icon will be copied to all android/app/src/main/res directories. For best quality, we recommend providing downscaled versions.');
              _hasShownResizeErrorWindowsLinux = true;
            }
          } else {
            throw new Error(`Failed to resize image: ${filename}. ${e}`);
          }
        }

        // reject non-square icons
        const dims = yield (0, (_ImageUtils || _load_ImageUtils()).getImageDimensionsMacOSAsync)(destinationPath, filename);
        if (!dims || dims.length < 2 || dims[0] !== dims[1]) {
          if (!dims) {
            // Again, only throw this error on Turtle -- we expect that this will fail
            // for some detach users but we don't want this to stop the whole process.
            if (!isDetached) {
              throw new Error(`Unable to read the dimensions of ${filename}`);
            }
          } else {
            throw new Error(`Android icons must be square, the dimensions of ${filename} are ${dims}`);
          }
        }
      });

      return function (_x15) {
        return _ref4.apply(this, arguments);
      };
    })()));

    yield (0, (_ExponentTools || _load_ExponentTools()).spawnAsyncThrowError)('/bin/rm', [baseImagePath]);
  });

  return function _resizeIconsAsync(_x8, _x9, _x10, _x11, _x12, _x13, _x14) {
    return _ref3.apply(this, arguments);
  };
})();

let createAndWriteIconsToPathAsync = (() => {
  var _ref5 = _asyncToGenerator(function* (context, resPath, isDetached) {
    let manifest = context.config; // manifest or app.json
    let iconUrl = manifest.android && manifest.android.iconUrl ? manifest.android.iconUrl : manifest.iconUrl;
    let notificationIconUrl = manifest.notification ? manifest.notification.iconUrl : null;

    if (isDetached) {
      // manifest is actually just app.json in this case, so iconUrl fields don't exist
      iconUrl = manifest.android && manifest.android.icon ? manifest.android.icon : manifest.icon;
      notificationIconUrl = manifest.notification ? manifest.notification.icon : null;
    }

    let iconBackgroundUrl;
    let iconBackgroundColor;
    let iconForegroundUrl;
    if (manifest.android && manifest.android.adaptiveIcon) {
      iconBackgroundColor = manifest.android.adaptiveIcon.backgroundColor;
      if (isDetached) {
        iconForegroundUrl = manifest.android.adaptiveIcon.foregroundImage;
        iconBackgroundUrl = manifest.android.adaptiveIcon.backgroundImage;
      } else {
        iconForegroundUrl = manifest.android.adaptiveIcon.foregroundImageUrl;
        iconBackgroundUrl = manifest.android.adaptiveIcon.backgroundImageUrl;
      }
    }

    if (iconUrl || iconForegroundUrl) {
      // Android 7 and below icon
      if (iconUrl) {
        (yield (0, (_globby || _load_globby()).default)(['**/ic_launcher.png'], {
          cwd: resPath,
          absolute: true
        })).forEach(function (filePath) {
          (_fsExtra || _load_fsExtra()).default.removeSync(filePath);
        });

        yield _resizeIconsAsync(context, resPath, 'mipmap-', 48, 'ic_launcher.png', iconUrl, isDetached);
      }

      // Adaptive icon foreground image
      if (iconForegroundUrl) {
        (yield (0, (_globby || _load_globby()).default)(['**/ic_foreground.png'], {
          cwd: resPath,
          absolute: true
        })).forEach(function (filePath) {
          (_fsExtra || _load_fsExtra()).default.removeSync(filePath);
        });

        yield _resizeIconsAsync(context, resPath, 'mipmap-', 108, 'ic_foreground.png', iconForegroundUrl, isDetached);
      } else {
        // the OS's default method of coercing normal app icons to adaptive
        // makes them look quite different from using an actual adaptive icon (with xml)
        // so we need to support falling back to the old version on Android 8
        (yield (0, (_globby || _load_globby()).default)(['**/mipmap-*-v26/*'], {
          cwd: resPath,
          absolute: true,
          dot: true
        })).forEach(function (filePath) {
          (_fsExtra || _load_fsExtra()).default.removeSync(filePath);
        });

        try {
          (yield (0, (_globby || _load_globby()).default)(['**/mipmap-*-v26'], {
            cwd: resPath,
            absolute: true
          })).forEach(function (filePath) {
            (_fsExtra || _load_fsExtra()).default.rmdirSync(filePath);
          });
        } catch (e) {
          // we don't want the entire detach script to fail if node
          // can't remove the directories for whatever reason.
          // people can remove the directories themselves if they need
          // so just fail silently here
        }
      }
    }

    // Adaptive icon background image or color
    if (iconBackgroundUrl) {
      yield _resizeIconsAsync(context, resPath, 'mipmap-', 108, 'ic_background.png', iconBackgroundUrl, isDetached);

      yield _regexFileInResSubfoldersAsync('@color/iconBackground', '@mipmap/ic_background', resPath, 'mipmap-', '-v26', 'ic_launcher.xml');
    } else if (iconBackgroundColor) {
      yield (0, (_ExponentTools || _load_ExponentTools()).regexFileAsync)('"iconBackground">#FFFFFF', `"iconBackground">${iconBackgroundColor}`, _path.default.join(resPath, 'values', 'colors.xml'));
    }

    // Notification icon
    if (notificationIconUrl) {
      (yield (0, (_globby || _load_globby()).default)(['**/shell_notification_icon.png'], {
        cwd: resPath,
        absolute: true
      })).forEach(function (filePath) {
        (_fsExtra || _load_fsExtra()).default.removeSync(filePath);
      });

      yield _resizeIconsAsync(context, resPath, 'drawable-', 24, 'shell_notification_icon.png', notificationIconUrl, isDetached);
    }
  });

  return function createAndWriteIconsToPathAsync(_x16, _x17, _x18) {
    return _ref5.apply(this, arguments);
  };
})();

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _path = _interopRequireDefault(require('path'));

var _globby;

function _load_globby() {
  return _globby = _interopRequireDefault(require('globby'));
}

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const iconScales = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4
};

let _hasShownResizeErrorWindowsLinux = false;

exports.createAndWriteIconsToPathAsync = createAndWriteIconsToPathAsync;
//# sourceMappingURL=../__sourcemaps__/detach/AndroidIcons.js.map
