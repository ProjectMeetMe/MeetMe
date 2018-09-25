'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _stringify;

function _load_stringify() {
  return _stringify = _interopRequireDefault(require('babel-runtime/core-js/json/stringify'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _path = _interopRequireDefault(require('path'));

var _rimraf;

function _load_rimraf() {
  return _rimraf = _interopRequireDefault(require('rimraf'));
}

var _mkdirp;

function _load_mkdirp() {
  return _mkdirp = _interopRequireDefault(require('mkdirp'));
}

var _fs = _interopRequireDefault(require('fs'));

var _IOSBuilder;

function _load_IOSBuilder() {
  return _IOSBuilder = _interopRequireDefault(require('../commands/build/IOSBuilder'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HOME_APP_JSON = {
  expo: {
    name: 'expo-home',
    description: '',
    slug: 'home',
    privacy: 'unlisted',

    // When publishing the sdkVersion needs to be set to the target sdkVersion.
    // The Exponent client will load it as UNVERSIONED, but the server uses this field
    // to know which clients to serve the bundle to.
    sdkVersion: '26.0.0',

    // Update this each time you publish so you're able to relate published
    // bundles to specific commits in the repo
    version: '26.1.0',

    orientation: 'portrait',
    platforms: ['ios', 'android'],
    primaryColor: '#cccccc',
    icon: 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png',
    updates: {
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'host.exp.exponent',
      publishBundlePath: '../ios/Exponent/Supporting/kernel.ios.bundle',
      config: {
        actualBundleIdentifier: 'REPLACEME'
      }
    },
    android: {
      package: 'host.exp.exponent',
      publishBundlePath: '../android/app/src/main/assets/kernel.android.bundle'
    },
    scheme: 'exp',
    isKernel: true,
    kernel: {
      iosManifestPath: '../ios/Exponent/Supporting/kernel-manifest.json',
      androidManifestPath: '../android/app/src/main/assets/kernel-manifest.json'
    },
    extra: {
      amplitudeApiKey: '081e5ec53f869b440b225d5e40ec73f9'
    }
  }
};

var HOME_PKG_JSON = {
  main: 'node_modules/expo/AppEntry.js',
  private: true,
  description: 'The Expo app',
  scripts: {
    test: 'jest'
  },
  author: '650 Industries',
  license: 'Copyright 650 Industries, Inc. All rights reserved.',
  jest: {
    preset: 'jest-expo'
  },
  powertools: {
    group: 'client'
  },
  dependencies: {
    '@expo/ex-navigation': '^2.11.1',
    '@expo/react-native-action-sheet': '^0.3.0',
    '@expo/react-native-fade-in-image': '^1.1.1',
    '@expo/react-native-navigator': '0.5.2',
    '@expo/react-native-responsive-image': '^1.2.1',
    '@expo/react-native-touchable-native-feedback-safe': '^1.1.1',
    'apollo-client': '~1.0.3',
    'autobind-decorator': '^1.3.2',
    dedent: '^0.7.0',
    'es6-error': '^4.0.1',
    expo: '26.0.0-rc.2',
    'graphql-tag': '^1.2.1',
    immutable: '^3.8.1',
    'jwt-decode': '^2.1.0',
    lodash: '^4.17.4',
    'prop-types': '^15.5.10',
    querystring: '^0.2.0',
    react: '16.2.0',
    'react-apollo': '~1.0.1',
    'react-mixin': '^3.0.4',
    'react-native': 'expo/react-native#sdk-26',
    'react-native-deprecated-custom-components': '^0.1.0',
    'react-native-infinite-scroll-view': '^0.4.2',
    'react-redux': '^5.0.1',
    'react-timer-mixin': '^0.13.3',
    redux: '^3.5.1',
    'redux-thunk': '^2.2.0',
    url: '^0.11.0'
  },
  devDependencies: {
    hashids: '^1.1.1',
    'jest-expo': '^25.1.0',
    'jsc-android': '^216113.0.0',
    'node-fetch': '^2.0.0',
    uuid: '^3.0.1'
  }
};

exports.default = function (program) {
  program.command('sandbox:ios').alias('si').option('-c, --clear-credentials', 'Clear credentials stored on expo servers').option('-e, --apple-enterprise-account', 'Run as Apple Enterprise account').option('--no-wait', 'Exit immediately after triggering build.').description('Build a signed IPA of the Expo sandbox app').asyncAction(function () {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(options) {
      var user, username, normalizedUsername, sandboxBundleId, projectDir, modifiedAppJSON, iosBuilder;
      return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (_xdl || _load_xdl()).User.ensureLoggedInAsync();

            case 2:
              user = _context.sent;
              username = user.username;
              normalizedUsername = username.replace(/[^0-9a-zA-Z]/g, '');
              _context.next = 7;
              return (_xdl || _load_xdl()).UserSettings.getAsync('sandboxBundleId', null);

            case 7:
              sandboxBundleId = _context.sent;

              if (sandboxBundleId) {
                _context.next = 12;
                break;
              }

              sandboxBundleId = (_xdl || _load_xdl()).UrlUtils.randomIdentifier(5);
              _context.next = 12;
              return (_xdl || _load_xdl()).UserSettings.mergeAsync({ sandboxBundleId: sandboxBundleId });

            case 12:

              options.type = 'client';
              options.releaseChannel = 'default';
              options.hardcodeRevisionId = 'eb310d00-2af3-11e8-9906-3ba982c41215';

              projectDir = _path.default.join((_xdl || _load_xdl()).UserSettings.dotExpoHomeDirectory(), 'expo-home');

              (_rimraf || _load_rimraf()).default.sync(projectDir);
              (_mkdirp || _load_mkdirp()).default.sync(projectDir);

              modifiedAppJSON = HOME_APP_JSON;

              modifiedAppJSON.expo.ios.bundleIdentifier = 'host.exp.' + normalizedUsername + '-' + sandboxBundleId;
              modifiedAppJSON.expo.ios.config.actualBundleIdentifier = modifiedAppJSON.expo.ios.bundleIdentifier;
              _fs.default.writeFileSync(_path.default.join(projectDir, 'app.json'), (0, (_stringify || _load_stringify()).default)(modifiedAppJSON));
              _fs.default.writeFileSync(_path.default.join(projectDir, 'package.json'), (0, (_stringify || _load_stringify()).default)(HOME_PKG_JSON));

              iosBuilder = new (_IOSBuilder || _load_IOSBuilder()).default(projectDir, options);
              return _context.abrupt('return', iosBuilder.command());

            case 25:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/debug_commands/sandbox.js.map
