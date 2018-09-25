'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = undefined;

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var action = exports.action = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var status, startedOurOwn, startOpts, exportOptions, absoluteOutputDir;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (options.publicUrl) {
              _context.next = 2;
              break;
            }

            throw new (_CommandError || _load_CommandError()).default('MISSING_PUBLIC_URL', 'Missing required option: --public-url');

          case 2:
            if (!(!options.dev && !(_xdl || _load_xdl()).UrlUtils.isHttps(options.publicUrl))) {
              _context.next = 6;
              break;
            }

            throw new (_CommandError || _load_CommandError()).default('INVALID_PUBLIC_URL', '--public-url must be a valid HTTPS URL.');

          case 6:
            if (!(_validator || _load_validator()).default.isURL(options.publicUrl, { protocols: ['http', 'https'] })) {
              console.warn('Dev Mode: publicUrl ' + options.publicUrl + ' does not conform to HTTP format.');
            }

          case 7:
            _context.next = 9;
            return (_xdl || _load_xdl()).Project.currentStatus(projectDir);

          case 9:
            status = _context.sent;
            startedOurOwn = false;

            if (!(status !== 'running')) {
              _context.next = 20;
              break;
            }

            (0, (_log || _load_log()).default)('Unable to find an existing ' + options.parent.name + ' instance for this directory, starting a new one...');

            (0, (_exit || _load_exit()).installExitHooks)(projectDir);

            startOpts = { reset: options.clear, nonPersistent: true };

            if (options.maxWorkers) {
              startOpts.maxWorkers = options.maxWorkers;
            }
            (0, (_log || _load_log()).default)('Exporting your app...');
            _context.next = 19;
            return (_xdl || _load_xdl()).Project.startAsync(projectDir, startOpts, !options.quiet);

          case 19:
            startedOurOwn = true;

          case 20:

            // Make outputDir an absolute path if it isnt already
            exportOptions = {
              dumpAssetmap: options.dumpAssetmap,
              dumpSourcemap: options.dumpSourcemap,
              isDev: options.dev
            };
            absoluteOutputDir = _path.default.resolve(process.cwd(), options.outputDir);
            _context.next = 24;
            return (_xdl || _load_xdl()).Project.exportForAppHosting(projectDir, options.publicUrl, options.assetUrl, absoluteOutputDir, exportOptions);

          case 24:
            if (!startedOurOwn) {
              _context.next = 28;
              break;
            }

            (0, (_log || _load_log()).default)('Terminating server processes.');
            _context.next = 28;
            return (_xdl || _load_xdl()).Project.stopAsync(projectDir);

          case 28:
            (0, (_log || _load_log()).default)('Export was successful. Your exported files can be found in ' + options.outputDir);

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function action(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _validator;

function _load_validator() {
  return _validator = _interopRequireDefault(require('validator'));
}

var _path = _interopRequireDefault(require('path'));

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

var _exit;

function _load_exit() {
  return _exit = require('../exit');
}

var _CommandError;

function _load_CommandError() {
  return _CommandError = _interopRequireDefault(require('../CommandError'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (program) {
  program.command('export [project-dir]').description('Exports the static files of the app for hosting it on a web server.').option('-p, --public-url <url>', 'The public url that will host the static files. (Required)').option('--output-dir <dir>', 'The directory to export the static files to. Default directory is `dist`', 'dist').option('-a, --asset-url <url>', "The absolute or relative url that will host the asset files. Default is './assets', which will be resolved against the public-url.", './assets').option('-d, --dump-assetmap', 'Dump the asset map for further processing.').option('--dev', 'Configures static files for developing locally using a non-https server').option('--s, --dump-sourcemap', 'Dump the source map for debugging the JS bundle.').option('-q, --quiet', 'Suppress verbose output from the React Native packager.').option('--max-workers [num]', 'Maximum number of tasks to allow Metro to spawn.').asyncActionProjectDir(action, false, true);
};
//# sourceMappingURL=../__sourcemaps__/commands/export.js.map
