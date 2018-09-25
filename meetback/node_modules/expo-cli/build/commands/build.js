'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _extends2;

function _load_extends() {
  return _extends2 = _interopRequireDefault(require('babel-runtime/helpers/extends'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _BaseBuilder;

function _load_BaseBuilder() {
  return _BaseBuilder = _interopRequireDefault(require('./build/BaseBuilder'));
}

var _IOSBuilder;

function _load_IOSBuilder() {
  return _IOSBuilder = _interopRequireDefault(require('./build/IOSBuilder'));
}

var _AndroidBuilder;

function _load_AndroidBuilder() {
  return _AndroidBuilder = _interopRequireDefault(require('./build/AndroidBuilder'));
}

var _BuildError;

function _load_BuildError() {
  return _BuildError = _interopRequireDefault(require('./build/BuildError'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

var _CommandError;

function _load_CommandError() {
  return _CommandError = _interopRequireDefault(require('../CommandError'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (program) {
  program.command('build:ios [project-dir]').alias('bi').option('-c, --clear-credentials', 'Clear credentials stored on expo servers').option('--clear-app-credentials', 'Remove app related credentials stored on expo servers (iOS)').option('--clear-dist-cert', 'Remove distribution cert stored on expo servers (iOS)').option('-e, --apple-enterprise-account', 'Run as Apple Enterprise account').option('--revoke-apple-dist-certs', 'Revoke distribution certs on developer.apple.com before attempting to make new certs, must use with -c').option('--revoke-apple-push-certs', 'Revoke push certs on developer.apple.com before attempting to make new certs, must use with -c').option('--revoke-apple-provisioning-profile', 'Revoke provisioning profile on developer.apple.com, must use with -c').option('-t --type <build>', 'Type of build: [archive|simulator].', /^(archive|simulator)$/i).option('--release-channel <channel-name>', 'Pull from specified release channel.', 'default').option('--no-publish', 'Disable automatic publishing before building.').option('--no-wait', 'Exit immediately after triggering build.').option('--team-id <apple-teamId>', 'Apple Team ID.').option('--dist-p12-path <dist.p12>', 'Path to your Distribution Certificate P12.').option('--push-p12-path <push.p12>', 'Path to your Push Notification Certificate P12.').option('--provisioning-profile-path <.mobileprovision>', 'Path to your Provisioning Profile.').option('--public-url <url>', 'The URL of an externally hosted manifest (for self-hosted apps).').description('Build a standalone IPA for your project, signed and ready for submission to the Apple App Store.').asyncActionProjectDir(function (projectDir, options) {
    if (options.publicUrl && !(_xdl || _load_xdl()).UrlUtils.isHttps(options.publicUrl)) {
      throw new (_CommandError || _load_CommandError()).default('INVALID_PUBLIC_URL', '--public-url must be a valid HTTPS URL.');
    }
    var channelRe = new RegExp(/^[a-z\d][a-z\d._-]*$/);
    if (!channelRe.test(options.releaseChannel)) {
      (_log || _load_log()).default.error('Release channel name can only contain lowercase letters, numbers and special characters . _ and -');
      process.exit(1);
    }
    if (options.type !== undefined && options.type !== 'archive' && options.type !== 'simulator') {
      (_log || _load_log()).default.error('Build type must be one of {archive, simulator}');
      process.exit(1);
    }
    var iosBuilder = new (_IOSBuilder || _load_IOSBuilder()).default(projectDir, options);
    return iosBuilder.command(options);
  });

  program.command('build:android [project-dir]').alias('ba').option('-c, --clear-credentials', 'Clear stored credentials.').option('--release-channel <channel-name>', 'Pull from specified release channel.', 'default').option('--no-publish', 'Disable automatic publishing before building.').option('--no-wait', 'Exit immediately after triggering build.').option('--keystore-path <app.jks>', 'Path to your Keystore.').option('--keystore-alias <alias>', 'Keystore Alias').option('--public-url <url>', 'The URL of an externally hosted manifest (for self-hosted apps)').description('Build a standalone APK for your project, signed and ready for submission to the Google Play Store.').asyncActionProjectDir(function (projectDir, options) {
    if (options.publicUrl && !(_xdl || _load_xdl()).UrlUtils.isHttps(options.publicUrl)) {
      throw new (_CommandError || _load_CommandError()).default('INVALID_PUBLIC_URL', '--public-url must be a valid HTTPS URL.');
    }
    var channelRe = new RegExp(/^[a-z\d][a-z\d._-]*$/);
    if (!channelRe.test(options.releaseChannel)) {
      (_log || _load_log()).default.error('Release channel name can only contain lowercase letters, numbers and special characters . _ and -');
      process.exit(1);
    }
    var androidBuilder = new (_AndroidBuilder || _load_AndroidBuilder()).default(projectDir, options);
    return androidBuilder.command(options);
  });

  program.command('build:status [project-dir]').alias('bs').option('--public-url <url>', 'The URL of an externally hosted manifest (for self-hosted apps).').description('Gets the status of a current (or most recently finished) build for your project.').asyncActionProjectDir(function () {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, options) {
      var builder;
      return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(options.publicUrl && !(_xdl || _load_xdl()).UrlUtils.isHttps(options.publicUrl))) {
                _context.next = 2;
                break;
              }

              throw new (_CommandError || _load_CommandError()).default('INVALID_PUBLIC_URL', '--public-url must be a valid HTTPS URL.');

            case 2:
              builder = new (_BaseBuilder || _load_BaseBuilder()).default(projectDir, options);
              _context.prev = 3;
              _context.next = 6;
              return builder.checkStatus((0, (_extends2 || _load_extends()).default)({
                platform: 'all',
                current: false
              }, options.publicUrl ? { publicUrl: options.publicUrl } : {}));

            case 6:
              return _context.abrupt('return', _context.sent);

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](3);

              if (!(_context.t0 instanceof (_BuildError || _load_BuildError()).default)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt('return');

            case 13:
              throw _context.t0;

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[3, 9]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }(), /* skipProjectValidation: */true);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/commands/build.js.map
