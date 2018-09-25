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

var action = function () {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(projectDir, options) {
    var url;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (_urlOpts || _load_urlOpts()).default.optsAsync(projectDir, options);

          case 2:
            _context2.next = 4;
            return (_xdl || _load_xdl()).Project.currentStatus(projectDir);

          case 4:
            _context2.t0 = _context2.sent;

            if (!(_context2.t0 !== 'running')) {
              _context2.next = 7;
              break;
            }

            throw new (_CommandError || _load_CommandError()).default('NOT_RUNNING', 'Project is not running. Please start it with `' + options.parent.name + ' start`.');

          case 7:
            _context2.next = 9;
            return (_xdl || _load_xdl()).UrlUtils.constructManifestUrlAsync(projectDir);

          case 9:
            url = _context2.sent;


            (_log || _load_log()).default.newLine();
            (_urlOpts || _load_urlOpts()).default.printQRCode(url);

            (0, (_log || _load_log()).default)('Your URL is\n\n' + (_chalk || _load_chalk()).default.underline(url) + '\n');
            (_log || _load_log()).default.raw(url);

            _context2.next = 16;
            return (0, (_printRunInstructionsAsync || _load_printRunInstructionsAsync()).default)();

          case 16:
            _context2.next = 18;
            return (_urlOpts || _load_urlOpts()).default.handleMobileOptsAsync(projectDir, options);

          case 18:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function action(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _fp;

function _load_fp() {
  return _fp = _interopRequireDefault(require('lodash/fp'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _CommandError;

function _load_CommandError() {
  return _CommandError = _interopRequireDefault(require('../CommandError'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

var _urlOpts;

function _load_urlOpts() {
  return _urlOpts = _interopRequireDefault(require('../urlOpts'));
}

var _printRunInstructionsAsync;

function _load_printRunInstructionsAsync() {
  return _printRunInstructionsAsync = _interopRequireDefault(require('../printRunInstructionsAsync'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logArtifactUrl = function logArtifactUrl(platform) {
  return function () {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, options) {
      var res, url;
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
              _context.next = 4;
              return (_xdl || _load_xdl()).Project.buildAsync(projectDir, (0, (_extends2 || _load_extends()).default)({
                current: false,
                mode: 'status'
              }, options.publicUrl ? { publicUrl: options.publicUrl } : {}));

            case 4:
              res = _context.sent;
              url = (_fp || _load_fp()).default.compose((_fp || _load_fp()).default.get(['artifacts', 'url']), (_fp || _load_fp()).default.head, (_fp || _load_fp()).default.filter(function (job) {
                return platform && job.platform === platform;
              }), (_fp || _load_fp()).default.getOr([], 'jobs'))(res);

              if (!url) {
                _context.next = 10;
                break;
              }

              (_log || _load_log()).default.nested(url);
              _context.next = 11;
              break;

            case 10:
              throw new Error('No ' + platform + ' binary file found. Use "exp build:' + platform + '" to create one.');

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.default = function (program) {
  program.command('url [project-dir]').alias('u').description('Displays the URL you can use to view your project in Expo').urlOpts().allowOffline().asyncActionProjectDir(action, /* skipProjectValidation: */true, /* skipAuthCheck: */true);

  program.command('url:ipa [project-dir]').option('--public-url <url>', 'The URL of an externally hosted manifest (for self-hosted apps)').description('Displays the standalone iOS binary URL you can use to download your app binary').asyncActionProjectDir(logArtifactUrl('ios'), true);

  program.command('url:apk [project-dir]').option('--public-url <url>', 'The URL of an externally hosted manifest (for self-hosted apps)').description('Displays the standalone Android binary URL you can use to download your app binary').asyncActionProjectDir(logArtifactUrl('android'), true);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/commands/url.js.map
