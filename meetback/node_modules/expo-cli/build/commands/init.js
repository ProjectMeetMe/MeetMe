'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var action = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, options) {
    var parentDir, name, versionsPromise, root, validationResult, _ref2, templateId, versions, wrap, _ref3, projectPath, cdPath;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parentDir = void 0;
            name = void 0;

            // No `await` here, just start fetching versions in the background and block later.

            versionsPromise = (_xdl || _load_xdl()).Api.versionsAsync();

            if (!projectDir) {
              _context.next = 12;
              break;
            }

            root = _path.default.resolve(projectDir);

            parentDir = _path.default.dirname(root);
            name = _path.default.basename(root);
            validationResult = validateName(parentDir, name);

            if (!(validationResult !== true)) {
              _context.next = 10;
              break;
            }

            throw new (_CommandError || _load_CommandError()).default('INVALID_PROJECT_DIR', validationResult);

          case 10:
            _context.next = 17;
            break;

          case 12:
            parentDir = process.cwd();
            _context.next = 15;
            return (0, (_prompt || _load_prompt()).default)({
              name: 'name',
              message: 'Choose a project name:',
              filter: function filter(name) {
                return name.trim();
              },
              validate: function validate(name) {
                return validateName(parentDir, name);
              }
            });

          case 15:
            _ref2 = _context.sent;
            name = _ref2.name;

          case 17:
            templateId = void 0;

            if (!options.template) {
              _context.next = 22;
              break;
            }

            templateId = options.template;
            _context.next = 30;
            break;

          case 22:
            _context.next = 24;
            return versionsPromise;

          case 24:
            versions = _context.sent;
            wrap = (0, (_wordwrap || _load_wordwrap()).default)(2, process.stdout.columns || 80);
            _context.next = 28;
            return (0, (_prompt || _load_prompt()).default)({
              type: 'list',
              name: 'templateId',
              message: 'Choose a template:',
              choices: versions.templatesv2.map(function (template) {
                return {
                  value: template.id,
                  name: (_chalk || _load_chalk()).default.bold(template.id) + '\n' + wrap(template.description),
                  short: template.id
                };
              })
            });

          case 28:
            _ref3 = _context.sent;
            templateId = _ref3.templateId;

          case 30:
            _context.next = 32;
            return downloadAndExtractTemplate(templateId, parentDir, name);

          case 32:
            projectPath = _context.sent;
            cdPath = _path.default.relative(process.cwd(), projectPath);

            if (cdPath.length > projectPath.length) {
              cdPath = projectPath;
            }
            (_log || _load_log()).default.nested('\nYour project is ready at ' + projectPath);
            (_log || _load_log()).default.nested('To get started, you can type:\n');
            if (cdPath) {
              // empty string if project was created in current directory
              (_log || _load_log()).default.nested('  cd ' + cdPath);
            }
            (_log || _load_log()).default.nested('  ' + options.parent.name + ' start\n');

          case 39:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function action(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var downloadAndExtractTemplate = function () {
  var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3(templateId, parentDir, name) {
    var _this = this;

    var bar, showProgress, opts, templateDownload;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            bar = new (_progress || _load_progress()).default('[:bar] :percent', {
              total: 100,
              width: 50,
              clear: true,
              complete: '=',
              incomplete: ' '
            });
            showProgress = true;
            opts = {
              name: name,
              progressFunction: function progressFunction(progress) {
                (_xdl || _load_xdl()).Logger.notifications.info({ code: (_xdl || _load_xdl()).NotificationCode.DOWNLOAD_CLI_PROGRESS }, progress + '%');
                if (showProgress) {
                  bar.update(progress / 100);
                }
              },
              retryFunction: function () {
                var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(cancel) {
                  var _ref6, shouldRestart;

                  return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          bar.terminate();
                          showProgress = false;
                          _context2.next = 4;
                          return (0, (_prompt || _load_prompt()).default)({
                            type: 'confirm',
                            name: 'shouldRestart',
                            message: (_xdl || _load_xdl()).MessageCode.DOWNLOAD_IS_SLOW
                          });

                        case 4:
                          _ref6 = _context2.sent;
                          shouldRestart = _ref6.shouldRestart;

                          if (shouldRestart) {
                            cancel();
                          } else {
                            showProgress = true;
                          }

                        case 7:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this);
                }));

                return function retryFunction(_x6) {
                  return _ref5.apply(this, arguments);
                };
              }()
            };
            _context3.prev = 3;
            _context3.next = 6;
            return (_xdl || _load_xdl()).Exp.downloadTemplateApp(templateId, parentDir, opts);

          case 6:
            templateDownload = _context3.sent;
            return _context3.abrupt('return', (_xdl || _load_xdl()).Exp.extractTemplateApp(templateDownload.starterAppPath, templateDownload.name, templateDownload.root));

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3['catch'](3);

            if (!_context3.t0.__CANCEL__) {
              _context3.next = 17;
              break;
            }

            (0, (_log || _load_log()).default)('Download was canceled. Starting again...');
            return _context3.abrupt('return', downloadAndExtractTemplate(templateId, parentDir, name));

          case 17:
            throw _context3.t0;

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[3, 10]]);
  }));

  return function downloadAndExtractTemplate(_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var _fs = _interopRequireDefault(require('fs'));

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _progress;

function _load_progress() {
  return _progress = _interopRequireDefault(require('progress'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _wordwrap;

function _load_wordwrap() {
  return _wordwrap = _interopRequireDefault(require('wordwrap'));
}

var _prompt;

function _load_prompt() {
  return _prompt = _interopRequireDefault(require('../prompt'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

var _CommandError;

function _load_CommandError() {
  return _CommandError = _interopRequireDefault(require('../CommandError'));
}

var _path = _interopRequireDefault(require('path'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _downloadIsSlowPrompt = false;

function validateName(parentDir, name) {
  if (!/^[a-z0-9@.\-_]+$/i.test(name)) {
    return 'The project name can only contain URL-friendly characters.';
  }
  var dir = _path.default.join(parentDir, name);
  if (!isNonExistentOrEmptyDir(dir)) {
    return 'The path "' + dir + '" already exists.\nPlease choose a different parent directory or project name.';
  }
  return true;
}

function isNonExistentOrEmptyDir(dir) {
  try {
    return _fs.default.statSync(dir).isDirectory() && _fs.default.readdirSync(dir).length === 0;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return true;
    }
    throw error;
  }
}

exports.default = function (program) {
  program.command('init [project-dir]').alias('i').description('Initializes a directory with an example project. Run it without any options and you will be prompted for the name and type.').option('-t, --template [name]', 'Specify which template to use. Run without this option to see all choices.').asyncAction(action);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/commands/init.js.map
