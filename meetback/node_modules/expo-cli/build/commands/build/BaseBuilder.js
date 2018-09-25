'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2;

function _load_extends() {
  return _extends2 = _interopRequireDefault(require('babel-runtime/helpers/extends'));
}

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _createClass2;

function _load_createClass() {
  return _createClass2 = _interopRequireDefault(require('babel-runtime/helpers/createClass'));
}

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _fp;

function _load_fp() {
  return _fp = _interopRequireDefault(require('lodash/fp'));
}

var _simpleSpinner;

function _load_simpleSpinner() {
  return _simpleSpinner = _interopRequireDefault(require('@expo/simple-spinner'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../../log'));
}

var _publish;

function _load_publish() {
  return _publish = require('../publish');
}

var _BuildError;

function _load_BuildError() {
  return _BuildError = _interopRequireDefault(require('./BuildError'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sleep = function sleep(ms) {
  return new (_promise || _load_promise()).default(function (res) {
    return setTimeout(res, ms);
  });
};

var secondsToMilliseconds = function secondsToMilliseconds(seconds) {
  return seconds * 1000;
};

var BaseBuilder = function () {
  function BaseBuilder(projectDir, options) {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, BaseBuilder);
    this.projectDir = '';
    this.options = {
      wait: true,
      clearCredentials: false,
      releaseChannel: 'default',
      publish: false
    };

    this.projectDir = projectDir;
    this.options = options;
  }

  (0, (_createClass2 || _load_createClass()).default)(BaseBuilder, [{
    key: 'command',
    value: function () {
      var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(options) {
        return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this._checkProjectConfig();

              case 3:
                _context.next = 5;
                return this.run(options);

              case 5:
                _context.next = 15;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);

                if (_context.t0 instanceof (_BuildError || _load_BuildError()).default) {
                  _context.next = 13;
                  break;
                }

                throw _context.t0;

              case 13:
                (_log || _load_log()).default.error(_context.t0.message);
                process.exit(1);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function command(_x) {
        return _ref.apply(this, arguments);
      }

      return command;
    }()
  }, {
    key: '_checkProjectConfig',
    value: function () {
      var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2() {
        var _ref3, exp;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (_xdl || _load_xdl()).ProjectUtils.readConfigJsonAsync(this.projectDir);

              case 2:
                _ref3 = _context2.sent;
                exp = _ref3.exp;

                if (exp.isDetached) {
                  (_log || _load_log()).default.error('`exp build` is not supported for detached projects.');
                  process.exit(1);
                }

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _checkProjectConfig() {
        return _ref2.apply(this, arguments);
      }

      return _checkProjectConfig;
    }()
  }, {
    key: 'checkStatus',
    value: function () {
      var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3() {
        var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref5$platform = _ref5.platform,
            platform = _ref5$platform === undefined ? 'all' : _ref5$platform,
            _ref5$current = _ref5.current,
            current = _ref5$current === undefined ? true : _ref5$current,
            publicUrl = _ref5.publicUrl;

        var buildStatus;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._checkProjectConfig();

              case 2:

                (0, (_log || _load_log()).default)('Checking if current build exists...\n');

                _context3.next = 5;
                return (_xdl || _load_xdl()).Project.buildAsync(this.projectDir, (0, (_extends2 || _load_extends()).default)({
                  mode: 'status',
                  platform: platform,
                  current: current
                }, publicUrl ? { publicUrl: publicUrl } : {}));

              case 5:
                buildStatus = _context3.sent;

                if (!buildStatus.err) {
                  _context3.next = 8;
                  break;
                }

                throw new Error('Error getting current build status for this project.');

              case 8:
                if (buildStatus.jobs && buildStatus.jobs.length) {
                  _context3.next = 11;
                  break;
                }

                (0, (_log || _load_log()).default)('No currently active or previous builds for this project.');
                return _context3.abrupt('return');

              case 11:

                (_log || _load_log()).default.raw();
                (0, (_log || _load_log()).default)('=================');
                (0, (_log || _load_log()).default)(' Builds Statuses ');
                (0, (_log || _load_log()).default)('=================\n');
                buildStatus.jobs.forEach(function (job, i) {
                  var platform = void 0,
                      packageExtension = void 0;
                  if (job.platform === 'ios') {
                    platform = 'iOS';
                    packageExtension = 'IPA';
                  } else {
                    platform = 'Android';
                    packageExtension = 'APK';
                  }

                  (0, (_log || _load_log()).default)('### ' + i + ' | ' + platform + ' | ' + constructBuildLogsUrl(job.id) + ' ###');

                  var status = void 0;
                  switch (job.status) {
                    case 'pending':
                    case 'sent-to-queue':
                      status = 'Build waiting in queue...\nYou can check the queue length at ' + (_chalk || _load_chalk()).default.underline(constructTurtleStatusUrl());
                      break;
                    case 'started':
                      status = 'Build started...';
                      break;
                    case 'in-progress':
                      status = 'Build in progress...';
                      break;
                    case 'finished':
                      status = 'Build finished.';
                      break;
                    case 'errored':
                      status = 'There was an error with this build.';
                      if (buildStatus.id) {
                        status += '\n\nWhen requesting support, please provide this build ID:\n\n' + buildStatus.id + '\n';
                      }
                      break;
                    default:
                      status = '';
                      break;
                  }

                  (0, (_log || _load_log()).default)(status);
                  if (job.status === 'finished') {
                    if (job.artifacts) {
                      (0, (_log || _load_log()).default)(packageExtension + ': ' + job.artifacts.url);
                    } else {
                      (0, (_log || _load_log()).default)('Problem getting ' + packageExtension + ' URL. Please try to build again.');
                    }
                  }
                  (0, (_log || _load_log()).default)();
                });

                throw new (_BuildError || _load_BuildError()).default('Cannot start new build, as there is a build in progress.');

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function checkStatus() {
        return _ref4.apply(this, arguments);
      }

      return checkStatus;
    }()
  }, {
    key: 'ensureReleaseExists',
    value: function () {
      var _ref6 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee4(platform) {
        var _ref7, ids, url, err, release;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.options.hardcodeRevisionId) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return', [this.options.hardcodeRevisionId]);

              case 2:
                if (!this.options.publish) {
                  _context4.next = 18;
                  break;
                }

                _context4.next = 5;
                return (0, (_publish || _load_publish()).action)(this.projectDir, (0, (_extends2 || _load_extends()).default)({}, this.options, {
                  platform: platform
                }));

              case 5:
                _ref7 = _context4.sent;
                ids = _ref7.ids;
                url = _ref7.url;
                err = _ref7.err;

                if (!err) {
                  _context4.next = 13;
                  break;
                }

                throw new (_BuildError || _load_BuildError()).default('No url was returned from publish. Please try again.\n' + err);

              case 13:
                if (!(!url || url === '')) {
                  _context4.next = 15;
                  break;
                }

                throw new (_BuildError || _load_BuildError()).default('No url was returned from publish. Please try again.');

              case 15:
                return _context4.abrupt('return', ids);

              case 18:
                (0, (_log || _load_log()).default)('Looking for releases...');
                _context4.next = 21;
                return (_xdl || _load_xdl()).Project.getLatestReleaseAsync(this.projectDir, {
                  releaseChannel: this.options.releaseChannel,
                  platform: platform
                });

              case 21:
                release = _context4.sent;

                if (release) {
                  _context4.next = 24;
                  break;
                }

                throw new (_BuildError || _load_BuildError()).default('No releases found. Please create one using `exp publish` first.');

              case 24:
                (0, (_log || _load_log()).default)('Using existing release on channel "' + release.channel + '":\n  publicationId: ' + release.publicationId + '\n  publishedTime: ' + release.publishedTime);
                return _context4.abrupt('return', [release.publicationId]);

              case 26:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function ensureReleaseExists(_x3) {
        return _ref6.apply(this, arguments);
      }

      return ensureReleaseExists;
    }()
  }, {
    key: 'wait',
    value: function () {
      var _ref8 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee5(buildId) {
        var _ref9 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref9$timeout = _ref9.timeout,
            timeout = _ref9$timeout === undefined ? 1200 : _ref9$timeout,
            _ref9$interval = _ref9.interval,
            interval = _ref9$interval === undefined ? 60 : _ref9$interval,
            publicUrl = _ref9.publicUrl;

        var time, endTime, res, job;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                time = new Date().getTime();

                (0, (_log || _load_log()).default)('Waiting for build to complete. You can press Ctrl+C to exit.');
                _context5.next = 4;
                return sleep(secondsToMilliseconds(interval));

              case 4:
                endTime = time + secondsToMilliseconds(timeout);

              case 5:
                if (!(time <= endTime)) {
                  _context5.next = 22;
                  break;
                }

                _context5.next = 8;
                return (_xdl || _load_xdl()).Project.buildAsync(this.projectDir, (0, (_extends2 || _load_extends()).default)({
                  current: false,
                  mode: 'status'
                }, publicUrl ? { publicUrl: publicUrl } : {}));

              case 8:
                res = _context5.sent;
                job = (_fp || _load_fp()).default.compose((_fp || _load_fp()).default.head, (_fp || _load_fp()).default.filter(function (job) {
                  return buildId && job.id === buildId;
                }), (_fp || _load_fp()).default.getOr([], 'jobs'))(res);
                _context5.t0 = job.status;
                _context5.next = _context5.t0 === 'finished' ? 13 : _context5.t0 === 'pending' ? 14 : _context5.t0 === 'sent-to-queue' ? 14 : _context5.t0 === 'started' ? 14 : _context5.t0 === 'in-progress' ? 14 : _context5.t0 === 'errored' ? 15 : 16;
                break;

              case 13:
                return _context5.abrupt('return', job);

              case 14:
                return _context5.abrupt('break', 17);

              case 15:
                throw new (_BuildError || _load_BuildError()).default('Standalone build failed!');

              case 16:
                throw new (_BuildError || _load_BuildError()).default('Unknown status: ' + job.status + ' - aborting!');

              case 17:
                time = new Date().getTime();
                _context5.next = 20;
                return sleep(secondsToMilliseconds(interval));

              case 20:
                _context5.next = 5;
                break;

              case 22:
                throw new (_BuildError || _load_BuildError()).default('Timeout reached! Project is taking longer than expected to finish building, aborting wait...');

              case 23:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function wait(_x4) {
        return _ref8.apply(this, arguments);
      }

      return wait;
    }()
  }, {
    key: 'build',
    value: function () {
      var _ref10 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee6(expIds, platform) {
        var extraArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var opts, _ref11, buildId, waitOpts, completedJob, artifactUrl;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                (0, (_log || _load_log()).default)('Building...');

                opts = (0, (_extends2 || _load_extends()).default)({
                  mode: 'create',
                  expIds: expIds,
                  platform: platform,
                  releaseChannel: this.options.releaseChannel
                }, extraArgs.publicUrl ? { publicUrl: extraArgs.publicUrl } : {});


                if (platform === 'ios') {
                  opts = (0, (_extends2 || _load_extends()).default)({}, opts, {
                    type: this.options.type,
                    bundleIdentifier: extraArgs.bundleIdentifier
                  });
                }

                // call out to build api here with url
                _context6.next = 5;
                return (_xdl || _load_xdl()).Project.buildAsync(this.projectDir, opts);

              case 5:
                _ref11 = _context6.sent;
                buildId = _ref11.id;


                (0, (_log || _load_log()).default)('Build started, it may take a few minutes to complete.');

                if (buildId) {
                  (0, (_log || _load_log()).default)('You can check the queue length at\n ' + (_chalk || _load_chalk()).default.underline(constructTurtleStatusUrl()) + '\n');
                }

                if (buildId) {
                  (0, (_log || _load_log()).default)('You can monitor the build at\n\n ' + (_chalk || _load_chalk()).default.underline(constructBuildLogsUrl(buildId)) + '\n');
                }

                if (!this.options.wait) {
                  _context6.next = 21;
                  break;
                }

                (_simpleSpinner || _load_simpleSpinner()).default.start();
                waitOpts = extraArgs.publicUrl ? { publicUrl: extraArgs.publicUrl } : {};
                _context6.next = 15;
                return this.wait(buildId, waitOpts);

              case 15:
                completedJob = _context6.sent;

                (_simpleSpinner || _load_simpleSpinner()).default.stop();
                artifactUrl = completedJob.artifactId ? constructArtifactUrl(completedJob.artifactId) : completedJob.artifacts.url;

                (0, (_log || _load_log()).default)((_chalk || _load_chalk()).default.green('Successfully built standalone app:') + ' ' + (_chalk || _load_chalk()).default.underline(artifactUrl));
                _context6.next = 22;
                break;

              case 21:
                (0, (_log || _load_log()).default)('Alternatively, run `exp build:status` to monitor it from the command line.');

              case 22:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function build(_x6, _x7) {
        return _ref10.apply(this, arguments);
      }

      return build;
    }()
  }, {
    key: 'checkIfSdkIsSupported',
    value: function () {
      var _ref12 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee7(sdkVersion, platform) {
        var isSupported, storeName;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return (_xdl || _load_xdl()).Versions.canTurtleBuildSdkVersion(sdkVersion, platform);

              case 2:
                isSupported = _context7.sent;

                if (!isSupported) {
                  storeName = platform === 'ios' ? 'Apple App Store' : 'Google Play Store';

                  (_log || _load_log()).default.error((_chalk || _load_chalk()).default.red('Unsupported SDK version: our app builders don\'t have support for ' + sdkVersion + ' version yet. Submitting the app to the ' + storeName + ' may result in an unexpected behaviour'));
                }

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function checkIfSdkIsSupported(_x9, _x10) {
        return _ref12.apply(this, arguments);
      }

      return checkIfSdkIsSupported;
    }()
  }]);
  return BaseBuilder;
}();

exports.default = BaseBuilder;


function constructBuildLogsUrl(buildId) {
  return getExpoDomainUrl() + '/builds/' + buildId;
}

function constructTurtleStatusUrl() {
  return getExpoDomainUrl() + '/turtle-status';
}

function constructArtifactUrl(artifactId) {
  return getExpoDomainUrl() + '/artifacts/' + artifactId;
}

function getExpoDomainUrl() {
  if (process.env.EXPO_STAGING) {
    return 'https://staging.expo.io';
  } else if (process.env.EXPO_LOCAL) {
    return 'http://expo.test';
  } else {
    return 'https://expo.io';
  }
}
module.exports = exports['default'];
//# sourceMappingURL=../../__sourcemaps__/commands/build/BaseBuilder.js.map
