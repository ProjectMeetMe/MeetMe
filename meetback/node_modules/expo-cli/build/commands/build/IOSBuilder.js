'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2;

function _load_objectWithoutProperties() {
  return _objectWithoutProperties2 = _interopRequireDefault(require('babel-runtime/helpers/objectWithoutProperties'));
}

var _set;

function _load_set() {
  return _set = _interopRequireDefault(require('babel-runtime/core-js/set'));
}

var _assign;

function _load_assign() {
  return _assign = _interopRequireDefault(require('babel-runtime/core-js/object/assign'));
}

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _stringify;

function _load_stringify() {
  return _stringify = _interopRequireDefault(require('babel-runtime/core-js/json/stringify'));
}

var _keys;

function _load_keys() {
  return _keys = _interopRequireDefault(require('babel-runtime/core-js/object/keys'));
}

var _getIterator2;

function _load_getIterator() {
  return _getIterator2 = _interopRequireDefault(require('babel-runtime/core-js/get-iterator'));
}

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

var _getPrototypeOf;

function _load_getPrototypeOf() {
  return _getPrototypeOf = _interopRequireDefault(require('babel-runtime/core-js/object/get-prototype-of'));
}

var _classCallCheck2;

function _load_classCallCheck() {
  return _classCallCheck2 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));
}

var _createClass2;

function _load_createClass() {
  return _createClass2 = _interopRequireDefault(require('babel-runtime/helpers/createClass'));
}

var _possibleConstructorReturn2;

function _load_possibleConstructorReturn() {
  return _possibleConstructorReturn2 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
}

var _inherits2;

function _load_inherits() {
  return _inherits2 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));
}

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _path = _interopRequireDefault(require('path'));

var _untildify;

function _load_untildify() {
  return _untildify = _interopRequireDefault(require('untildify'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _ora;

function _load_ora() {
  return _ora = _interopRequireDefault(require('ora'));
}

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _BaseBuilder2;

function _load_BaseBuilder() {
  return _BaseBuilder2 = _interopRequireDefault(require('./BaseBuilder'));
}

var _prompt;

function _load_prompt() {
  return _prompt = _interopRequireDefault(require('../../prompt'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../../log'));
}

var _auth;

function _load_auth() {
  return _auth = _interopRequireWildcard(require('./auth'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nonEmptyInput = function nonEmptyInput(val) {
  return val !== '';
};

var expertPrompt = '\nWARNING! In this mode, we won\'t be able to make sure your certificates,\nor provisioning profile are valid. Please double check that you\'re\nuploading valid files for your app otherwise you may encounter strange errors!\n\nMake sure you\'ve created your app ID on the developer portal, that your app ID\nis in app.json as `bundleIdentifier`, and that the provisioning profile you\nupload matches that team ID and app ID.\n';

var produceAbsolutePath = function produceAbsolutePath(p12Path) {
  p12Path = (0, (_untildify || _load_untildify()).default)(p12Path);
  if (!_path.default.isAbsolute(p12Path)) {
    p12Path = _path.default.resolve(p12Path);
  }
  return p12Path;
};

var runAsExpertQuestion = {
  type: 'list',
  name: 'isExpoManaged',
  message: 'How would you like to upload your credentials?\n',
  choices: [{ name: 'Expo handles all credentials, you can still provide overrides', value: true }, {
    name: 'I will provide all the credentials and files needed, Expo does limited validation',
    value: false
  }]
};

var OBLIGATORY_CREDS_KEYS = {
  pushP12: 'pushCert',
  pushPassword: 'pushCert',
  provisioningProfile: 'provisioningProfile',
  teamId: 'teamId'
};

var OBLIGATORY_DIST_CERT_CREDS_KEYS = {
  certP12: 'distCert',
  certPassword: 'distCert'
};

var LET_EXPO_HANDLE = 'Let Expo handle the process';

var I_PROVIDE_FILE = 'I want to upload my own file';

var OVERRIDE_CHOICES = [{ name: LET_EXPO_HANDLE, value: true }, { name: I_PROVIDE_FILE, value: false }];

var whatToOverride = [{
  type: 'list',
  name: 'distCert',
  message: 'Will you provide your own Distribution Certificate?',
  choices: OVERRIDE_CHOICES
}, {
  type: 'list',
  name: 'pushCert',
  message: 'Will you provide your own Push Certificate?',
  choices: OVERRIDE_CHOICES
}];

var provisionProfilePath = {
  type: 'input',
  name: 'pathToProvisioningProfile',
  message: 'Path to your .mobile provisioning Profile',
  validate: (_auth || _load_auth()).doesFileProvidedExist.bind(null, true),
  filter: produceAbsolutePath
};

var sharedQuestions = [{
  type: 'input',
  name: 'pathToP12',
  message: 'Path to P12 file:',
  validate: (_auth || _load_auth()).doesFileProvidedExist.bind(null, true),
  filter: produceAbsolutePath
}, {
  type: 'password',
  name: 'p12Password',
  message: 'P12 password:',
  validate: function validate(password) {
    return password.length > 0;
  }
}];

var appleCredsQuestions = [{
  type: 'input',
  name: 'appleId',
  message: 'What\'s your Apple ID?',
  validate: nonEmptyInput
}, {
  type: 'password',
  name: 'password',
  message: 'Password?',
  validate: nonEmptyInput
}];

var createChooseDistCertPrompt = function createChooseDistCertPrompt(choices) {
  return {
    type: 'list',
    name: 'distCert',
    message: 'Would you like to reuse Distribution Certificate from another app?',
    choices: choices
  };
};

var IOSBuilder = function (_BaseBuilder) {
  (0, (_inherits2 || _load_inherits()).default)(IOSBuilder, _BaseBuilder);

  function IOSBuilder() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, IOSBuilder);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, (IOSBuilder.__proto__ || (0, (_getPrototypeOf || _load_getPrototypeOf()).default)(IOSBuilder)).apply(this, arguments));
  }

  (0, (_createClass2 || _load_createClass()).default)(IOSBuilder, [{
    key: 'run',
    value: function () {
      var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(options) {
        var publicUrl, buildOptions, _ref2, _ref2$args, username, experienceName, bundleIdentifier, sdkVersion, credentialMetadata, clearOnly, publishedExpIds;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                publicUrl = options.publicUrl;
                buildOptions = (0, (_extends2 || _load_extends()).default)({}, publicUrl ? { publicUrl: publicUrl } : {});
                // validate bundleIdentifier before hitting the network to check build status

                if (!publicUrl) {
                  _context.next = 8;
                  break;
                }

                _context.next = 5;
                return (_xdl || _load_xdl()).Exp.getThirdPartyInfoAsync(publicUrl);

              case 5:
                _context.t0 = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.next = 10;
                return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(this.projectDir);

              case 10:
                _context.t0 = _context.sent;

              case 11:
                _ref2 = _context.t0;
                _ref2$args = _ref2.args;
                username = _ref2$args.username;
                experienceName = _ref2$args.remoteFullPackageName;
                bundleIdentifier = _ref2$args.bundleIdentifierIOS;
                sdkVersion = _ref2$args.sdkVersion;
                _context.next = 19;
                return this.checkIfSdkIsSupported(sdkVersion, 'ios');

              case 19:
                if (bundleIdentifier) {
                  _context.next = 21;
                  break;
                }

                throw new (_xdl || _load_xdl()).XDLError((_xdl || _load_xdl()).ErrorCode.INVALID_OPTIONS, 'Your project must have a bundleIdentifier set in app.json.\nSee https://docs.expo.io/versions/latest/guides/building-standalone-apps.html');

              case 21:
                _context.next = 23;
                return this.checkStatus((0, (_extends2 || _load_extends()).default)({ platform: 'ios' }, buildOptions));

              case 23:
                credentialMetadata = { username: username, experienceName: experienceName, bundleIdentifier: bundleIdentifier, platform: 'ios' };
                clearOnly = {};

                if (this.options.clearCredentials) {
                  clearOnly.distCert = true;
                  clearOnly.appCredentials = true;
                } else {
                  if (this.options.clearAppCredentials) {
                    clearOnly.appCredentials = true;
                  }
                  if (this.options.clearDistCert) {
                    clearOnly.distCert = true;
                  }
                }
                // Clear credentials if they want to:

                if ((_lodash || _load_lodash()).default.isEmpty(clearOnly)) {
                  _context.next = 30;
                  break;
                }

                _context.next = 29;
                return (_xdl || _load_xdl()).Credentials.removeCredentialsForPlatform('ios', (0, (_extends2 || _load_extends()).default)({}, credentialMetadata, {
                  only: clearOnly
                }));

              case 29:
                (_log || _load_log()).default.warn('Removed existing credentials from expo servers');

              case 30:
                if (!(this.options.type !== 'simulator')) {
                  _context.next = 43;
                  break;
                }

                _context.prev = 31;
                _context.next = 34;
                return (_auth || _load_auth()).prepareLocalAuth();

              case 34:
                _context.next = 36;
                return this.runLocalAuth(credentialMetadata);

              case 36:
                _context.next = 43;
                break;

              case 38:
                _context.prev = 38;
                _context.t1 = _context['catch'](31);

                (_log || _load_log()).default.error('Error while gathering & validating credentials');
                if ((_auth || _load_auth()).DEBUG) {
                  if (_context.t1.stdout !== undefined) {
                    // sometimes WSL adds null characters
                    (_log || _load_log()).default.error(_context.t1.stdout.replace(/\0/g, ''));
                  } else {
                    (_log || _load_log()).default.error(_context.t1);
                  }
                }
                throw _context.t1;

              case 43:
                if (!this.options.publicUrl) {
                  _context.next = 47;
                  break;
                }

                _context.t2 = undefined;
                _context.next = 50;
                break;

              case 47:
                _context.next = 49;
                return this.ensureReleaseExists('ios');

              case 49:
                _context.t2 = _context.sent;

              case 50:
                publishedExpIds = _context.t2;
                _context.next = 53;
                return this.build(publishedExpIds, 'ios', (0, (_extends2 || _load_extends()).default)({ bundleIdentifier: bundleIdentifier }, buildOptions));

              case 53:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[31, 38]]);
      }));

      function run(_x) {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'checkEnv',
    value: function checkEnv() {
      return this.options.teamId && this.options.distP12Path && process.env.EXPO_IOS_DIST_P12_PASSWORD && this.options.pushP12Path && process.env.EXPO_IOS_PUSH_P12_PASSWORD && this.options.provisioningProfilePath;
    }
  }, {
    key: 'runningAsCI',
    value: function () {
      var _ref3 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(credsStarter, credsMetadata) {
        var creds;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                creds = {
                  teamId: this.options.teamId,
                  certP12: this.options.distP12Path,
                  certPassword: process.env.EXPO_IOS_DIST_P12_PASSWORD,
                  pushP12: this.options.pushP12Path,
                  pushPassword: process.env.EXPO_IOS_PUSH_P12_PASSWORD,
                  provisioningProfile: this.options.provisioningProfilePath
                };
                _context2.t0 = this;
                _context2.t1 = credsStarter;
                _context2.t2 = (_extends2 || _load_extends()).default;
                _context2.t3 = {};
                _context2.t4 = creds;
                _context2.next = 8;
                return (_fsExtra || _load_fsExtra()).default.readFile(creds.provisioningProfile);

              case 8:
                _context2.t5 = _context2.sent.toString('base64');
                _context2.next = 11;
                return (_fsExtra || _load_fsExtra()).default.readFile(creds.certP12);

              case 11:
                _context2.t6 = _context2.sent.toString('base64');
                _context2.next = 14;
                return (_fsExtra || _load_fsExtra()).default.readFile(creds.pushP12);

              case 14:
                _context2.t7 = _context2.sent.toString('base64');
                _context2.t8 = {
                  provisioningProfile: _context2.t5,
                  certP12: _context2.t6,
                  pushP12: _context2.t7
                };
                _context2.t9 = (0, _context2.t2)(_context2.t3, _context2.t4, _context2.t8);

                _context2.t0._copyOverAsString.call(_context2.t0, _context2.t1, _context2.t9);

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function runningAsCI(_x2, _x3) {
        return _ref3.apply(this, arguments);
      }

      return runningAsCI;
    }()
  }, {
    key: 'runningAsExpert',
    value: function () {
      var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3(credsStarter, credsMetadata) {
        var credentialsToAskFor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['distCert', 'pushCert', 'provisioningProfile'];

        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, choice;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                (0, (_log || _load_log()).default)(expertPrompt);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 4;
                _iterator = (0, (_getIterator2 || _load_getIterator()).default)(credentialsToAskFor);

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 13;
                  break;
                }

                choice = _step.value;
                _context3.next = 10;
                return this.userProvidedOverride(credsStarter, choice, credsMetadata);

              case 10:
                _iteratorNormalCompletion = true;
                _context3.next = 6;
                break;

              case 13:
                _context3.next = 19;
                break;

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 19:
                _context3.prev = 19;
                _context3.prev = 20;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 22:
                _context3.prev = 22;

                if (!_didIteratorError) {
                  _context3.next = 25;
                  break;
                }

                throw _iteratorError;

              case 25:
                return _context3.finish(22);

              case 26:
                return _context3.finish(19);

              case 27:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[4, 15, 19, 27], [20,, 22, 26]]);
      }));

      function runningAsExpert(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return runningAsExpert;
    }()

    // End user wants to override these credentials, that is, they want
    // to provide their own creds

  }, {
    key: 'userProvidedOverride',
    value: function () {
      var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee4(credsStarter, choice, credsMetadata) {
        var distCertValues, certP12Buffer, certPassword, pushCertValues, _ref6, pathToProvisioningProfile;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.t0 = choice;
                _context4.next = _context4.t0 === 'distCert' ? 3 : _context4.t0 === 'pushCert' ? 14 : _context4.t0 === 'provisioningProfile' ? 27 : 40;
                break;

              case 3:
                (0, (_log || _load_log()).default)('Please provide your distribution certificate P12:');
                _context4.next = 6;
                return (0, (_prompt || _load_prompt()).default)(sharedQuestions);

              case 6:
                distCertValues = _context4.sent;
                _context4.next = 9;
                return (_fsExtra || _load_fsExtra()).default.readFile(distCertValues.pathToP12);

              case 9:
                certP12Buffer = _context4.sent;
                certPassword = distCertValues.p12Password;

                credsMetadata.distCertSerialNumber = (_xdl || _load_xdl()).IosCodeSigning.findP12CertSerialNumber(certP12Buffer, certPassword);
                this._copyOverAsString(credsStarter, {
                  certP12: certP12Buffer.toString('base64'),
                  certPassword: certPassword
                });
                return _context4.abrupt('break', 41);

              case 14:
                (0, (_log || _load_log()).default)('Please provide the path to your push notification cert P12');
                _context4.next = 17;
                return (0, (_prompt || _load_prompt()).default)(sharedQuestions);

              case 17:
                pushCertValues = _context4.sent;
                _context4.t1 = this;
                _context4.t2 = credsStarter;
                _context4.next = 22;
                return (_fsExtra || _load_fsExtra()).default.readFile(pushCertValues.pathToP12);

              case 22:
                _context4.t3 = _context4.sent.toString('base64');
                _context4.t4 = pushCertValues.p12Password;
                _context4.t5 = {
                  pushP12: _context4.t3,
                  pushPassword: _context4.t4
                };

                _context4.t1._copyOverAsString.call(_context4.t1, _context4.t2, _context4.t5);

                return _context4.abrupt('break', 41);

              case 27:
                (0, (_log || _load_log()).default)('Please provide the path to your .mobile provisioning profile');
                _context4.next = 30;
                return (0, (_prompt || _load_prompt()).default)(provisionProfilePath);

              case 30:
                _ref6 = _context4.sent;
                pathToProvisioningProfile = _ref6.pathToProvisioningProfile;
                _context4.t6 = this;
                _context4.t7 = credsStarter;
                _context4.next = 36;
                return (_fsExtra || _load_fsExtra()).default.readFile(pathToProvisioningProfile);

              case 36:
                _context4.t8 = _context4.sent.toString('base64');
                _context4.t9 = {
                  provisioningProfile: _context4.t8
                };

                _context4.t6._copyOverAsString.call(_context4.t6, _context4.t7, _context4.t9);

                return _context4.abrupt('break', 41);

              case 40:
                throw new Error('Unknown choice to override: ' + choice);

              case 41:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function userProvidedOverride(_x7, _x8, _x9) {
        return _ref5.apply(this, arguments);
      }

      return userProvidedOverride;
    }()
  }, {
    key: '_copyOverAsString',
    value: function _copyOverAsString(credsStarter, authActionAttempt) {
      (0, (_keys || _load_keys()).default)(authActionAttempt).forEach(function (k) {
        var isString = typeof authActionAttempt[k] === 'string';
        if (isString) {
          credsStarter[k] = authActionAttempt[k];
        } else {
          credsStarter[k] = (0, (_stringify || _load_stringify()).default)(authActionAttempt[k]);
        }
      });
    }
  }, {
    key: '_ensureAppExists',
    value: function () {
      var _ref7 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee5(appleCreds, credsMetadata, teamId, credsStarter) {
        var checkAppExistenceAttempt;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (_auth || _load_auth()).ensureAppIdLocally(appleCreds, credsMetadata, teamId);

              case 2:
                checkAppExistenceAttempt = _context5.sent;

                if (!(checkAppExistenceAttempt.result === 'failure' && checkAppExistenceAttempt.reason.startsWith((_auth || _load_auth()).NO_BUNDLE_ID))) {
                  _context5.next = 7;
                  break;
                }

                _context5.next = 6;
                return (_auth || _load_auth()).createAppOnPortal(appleCreds, credsMetadata, teamId);

              case 6:
                checkAppExistenceAttempt = _context5.sent;

              case 7:
                this._throwIfFailureWithReasonDump(checkAppExistenceAttempt);
                this._copyOverAsString(credsStarter, checkAppExistenceAttempt);

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _ensureAppExists(_x10, _x11, _x12, _x13) {
        return _ref7.apply(this, arguments);
      }

      return _ensureAppExists;
    }()
  }, {
    key: 'produceProvisionProfile',
    value: function () {
      var _ref8 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee6(appleCreds, credsMetadata, teamId, credsStarter, isEnterprise) {
        var produceProvisionProfileAttempt;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return (_auth || _load_auth()).produceProvisionProfile(appleCreds, credsMetadata, teamId, isEnterprise);

              case 2:
                produceProvisionProfileAttempt = _context6.sent;

                if (produceProvisionProfileAttempt.result === 'failure' && produceProvisionProfileAttempt.reason.startsWith((_auth || _load_auth()).MULTIPLE_PROFILES)) {
                  (_log || _load_log()).default.warn((_auth || _load_auth()).APPLE_ERRORS);
                }
                this._throwIfFailureWithReasonDump(produceProvisionProfileAttempt);
                this._copyOverAsString(credsStarter, produceProvisionProfileAttempt);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function produceProvisionProfile(_x14, _x15, _x16, _x17, _x18) {
        return _ref8.apply(this, arguments);
      }

      return produceProvisionProfile;
    }()
  }, {
    key: 'expoManagedResource',
    value: function () {
      var _ref9 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee7(credsStarter, choice, appleCreds, teamId, credsMetadata, isEnterprise) {
        var produceCertAttempt, producePushCertsAttempt;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.t0 = choice;
                _context7.next = _context7.t0 === 'distCert' ? 3 : _context7.t0 === 'pushCert' ? 10 : _context7.t0 === 'provisioningProfile' ? 16 : 19;
                break;

              case 3:
                _context7.next = 5;
                return (_auth || _load_auth()).produceCerts(appleCreds, teamId, isEnterprise);

              case 5:
                produceCertAttempt = _context7.sent;

                this._throwIfFailureWithReasonDump(produceCertAttempt);
                credsMetadata.distCertSerialNumber = (_xdl || _load_xdl()).IosCodeSigning.findP12CertSerialNumber(produceCertAttempt.certP12, produceCertAttempt.certPassword);
                this._copyOverAsString(credsStarter, produceCertAttempt);
                return _context7.abrupt('break', 20);

              case 10:
                _context7.next = 12;
                return (_auth || _load_auth()).producePushCerts(appleCreds, credsMetadata, teamId, isEnterprise);

              case 12:
                producePushCertsAttempt = _context7.sent;

                this._throwIfFailureWithReasonDump(producePushCertsAttempt);
                this._copyOverAsString(credsStarter, producePushCertsAttempt);
                return _context7.abrupt('break', 20);

              case 16:
                _context7.next = 18;
                return this.produceProvisionProfile(appleCreds, credsMetadata, teamId, credsStarter, isEnterprise);

              case 18:
                return _context7.abrupt('break', 20);

              case 19:
                throw new Error('Unknown manage resource choice requested: ' + choice);

              case 20:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function expoManagedResource(_x19, _x20, _x21, _x22, _x23, _x24) {
        return _ref9.apply(this, arguments);
      }

      return expoManagedResource;
    }()
  }, {
    key: '_revokeHelper',
    value: function () {
      var _ref10 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee8(appleCredentials, credsMetadata, teamId, isEnterprise, distOrPush) {
        var revokeWhat, revokeAttempt;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return (_auth || _load_auth()).askWhichCertsToDump(appleCredentials, credsMetadata, teamId, distOrPush, isEnterprise);

              case 2:
                revokeWhat = _context8.sent;

                if (!(revokeWhat.length !== 0)) {
                  _context8.next = 8;
                  break;
                }

                _context8.next = 6;
                return (_auth || _load_auth()).revokeCredentialsOnApple(appleCredentials, credsMetadata, revokeWhat, teamId);

              case 6:
                revokeAttempt = _context8.sent;

                if (revokeAttempt.result === 'success') {
                  (0, (_log || _load_log()).default)('Revoked ' + revokeAttempt.revokeCount + ' existing certs on developer.apple.com');
                } else {
                  (_log || _load_log()).default.warn('Could not revoke certs: ' + revokeAttempt.reason);
                }

              case 8:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _revokeHelper(_x25, _x26, _x27, _x28, _x29) {
        return _ref10.apply(this, arguments);
      }

      return _revokeHelper;
    }()
  }, {
    key: '_handleRevokes',
    value: function () {
      var _ref11 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee9(appleCredentials, credsStarter, credsMetadata, teamId, isEnterprise) {
        var f, revokeAttempt;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                f = this._revokeHelper.bind(null, appleCredentials, credsMetadata, teamId, isEnterprise);

                if (!this.options.revokeAppleDistCerts) {
                  _context9.next = 5;
                  break;
                }

                (_log || _load_log()).default.warn('ATTENTION: Revoking your Apple Distribution Certificates is permanent');
                _context9.next = 5;
                return f('distCert');

              case 5:
                if (!this.options.revokeApplePushCerts) {
                  _context9.next = 9;
                  break;
                }

                (_log || _load_log()).default.warn('ATTENTION: Revoking your Apple Push Certificates is permanent');
                _context9.next = 9;
                return f('pushCert');

              case 9:
                if (!this.options.revokeAppleProvisioningProfile) {
                  _context9.next = 17;
                  break;
                }

                _context9.next = 12;
                return new (_promise || _load_promise()).default(function (r) {
                  return setTimeout(function () {
                    return r();
                  }, 400);
                });

              case 12:
                (_log || _load_log()).default.warn('ATTENTION: Revoking your Apple Provisioning Profile for ' + credsMetadata.bundleIdentifier + ' is permanent');
                _context9.next = 15;
                return (_auth || _load_auth()).revokeProvisioningProfile(appleCredentials, credsMetadata, teamId);

              case 15:
                revokeAttempt = _context9.sent;

                if (revokeAttempt.result === 'success') {
                  (_log || _load_log()).default.warn(revokeAttempt.msg);
                } else {
                  (_log || _load_log()).default.warn('Could not revoke provisioning profile: ' + revokeAttempt.reason + ' rawDump:' + (0, (_stringify || _load_stringify()).default)(revokeAttempt));
                }

              case 17:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function _handleRevokes(_x30, _x31, _x32, _x33, _x34) {
        return _ref11.apply(this, arguments);
      }

      return _handleRevokes;
    }()
  }, {
    key: '_validateCredsEnsureAppExists',
    value: function () {
      var _ref12 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee10(credsStarter, credsMetadata, justTeamId, isEnterprise) {
        var appleCredentials, checkCredsAttempt;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.askForAppleCreds(justTeamId);

              case 2:
                appleCredentials = _context10.sent;

                (0, (_log || _load_log()).default)('Validating Credentials...');
                _context10.next = 6;
                return (_auth || _load_auth()).validateCredentialsProduceTeamId(appleCredentials);

              case 6:
                checkCredsAttempt = _context10.sent;

                this._throwIfFailureWithReasonDump(checkCredsAttempt);
                credsStarter.teamId = checkCredsAttempt.teamId;
                credsStarter.teamName = checkCredsAttempt.teamName;
                _context10.next = 12;
                return this._handleRevokes(appleCredentials, credsStarter, credsMetadata, checkCredsAttempt.teamId, isEnterprise);

              case 12:
                _context10.next = 14;
                return this._ensureAppExists(appleCredentials, credsMetadata, checkCredsAttempt.teamId, credsStarter);

              case 14:
                return _context10.abrupt('return', appleCredentials);

              case 15:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function _validateCredsEnsureAppExists(_x35, _x36, _x37, _x38) {
        return _ref12.apply(this, arguments);
      }

      return _validateCredsEnsureAppExists;
    }()
  }, {
    key: 'runningAsExpoManaged',
    value: function () {
      var _ref13 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee11(appleCredentials, credsStarter, credsMetadata, isEnterprise) {
        var credsMissing = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ['distCert', 'pushCert', 'provisioningProfile'];

        var whatToOverrideFiltered, whatToOverrideResult, expoManages, _ref15, userCredentialId, serialNumber, toCopy, spinner, choices, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, choice;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                // (dsokal)
                // This function and generally - IOSBuilder is unnecessarily overcomplicated.
                // It would be good to refactor it some day, because changing anything here always takes me more time than I think it should.
                //
                // There are only two possible scenarios here:
                //  - all of credentials are missing
                //  - distribution certificate is missing (we have to regenerate provisioning profile)

                if ((_lodash || _load_lodash()).default.includes(credsMissing, 'distCert') && !(_lodash || _load_lodash()).default.includes(credsMissing, 'provisioningProfile')) {
                  credsMissing.push('provisioningProfile');
                }

                whatToOverrideFiltered = whatToOverride.filter(function (_ref14) {
                  var name = _ref14.name;
                  return (_lodash || _load_lodash()).default.includes(credsMissing, name);
                });
                _context11.next = 4;
                return (0, (_prompt || _load_prompt()).default)(whatToOverrideFiltered);

              case 4:
                whatToOverrideResult = _context11.sent;
                expoManages = { provisioningProfile: true };

                if (!whatToOverrideResult.distCert) {
                  _context11.next = 12;
                  break;
                }

                _context11.next = 9;
                return this._chooseDistCert(credsMetadata.username, credsStarter.teamId);

              case 9:
                _context11.t0 = _context11.sent;
                _context11.next = 13;
                break;

              case 12:
                _context11.t0 = {};

              case 13:
                _ref15 = _context11.t0;
                userCredentialId = _ref15.userCredentialId;
                serialNumber = _ref15.serialNumber;
                toCopy = userCredentialId ? (_lodash || _load_lodash()).default.omit(whatToOverrideResult, 'distCert') : whatToOverrideResult;

                (0, (_assign || _load_assign()).default)(expoManages, toCopy);

                if (userCredentialId) {
                  credsStarter.userCredentialId = userCredentialId;
                  credsMetadata.distCertSerialNumber = serialNumber;
                }

                spinner = (0, (_ora || _load_ora()).default)('Running local authentication and producing required credentials').start();
                choices = (_lodash || _load_lodash()).default.intersection(credsMissing, (0, (_keys || _load_keys()).default)(expoManages));
                _context11.prev = 21;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context11.prev = 25;
                _iterator2 = (0, (_getIterator2 || _load_getIterator()).default)(choices);

              case 27:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context11.next = 42;
                  break;
                }

                choice = _step2.value;

                spinner.text = 'Now producing files for ' + choice;

                if (!expoManages[choice]) {
                  _context11.next = 36;
                  break;
                }

                spinner.start();
                _context11.next = 34;
                return this.expoManagedResource(credsStarter, choice, appleCredentials, credsStarter.teamId, credsMetadata, isEnterprise);

              case 34:
                _context11.next = 39;
                break;

              case 36:
                spinner.stop();
                _context11.next = 39;
                return this.userProvidedOverride(credsStarter, choice, credsMetadata);

              case 39:
                _iteratorNormalCompletion2 = true;
                _context11.next = 27;
                break;

              case 42:
                _context11.next = 48;
                break;

              case 44:
                _context11.prev = 44;
                _context11.t1 = _context11['catch'](25);
                _didIteratorError2 = true;
                _iteratorError2 = _context11.t1;

              case 48:
                _context11.prev = 48;
                _context11.prev = 49;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 51:
                _context11.prev = 51;

                if (!_didIteratorError2) {
                  _context11.next = 54;
                  break;
                }

                throw _iteratorError2;

              case 54:
                return _context11.finish(51);

              case 55:
                return _context11.finish(48);

              case 56:
                _context11.next = 61;
                break;

              case 58:
                _context11.prev = 58;
                _context11.t2 = _context11['catch'](21);
                throw _context11.t2;

              case 61:
                _context11.prev = 61;

                spinner.stop();
                return _context11.finish(61);

              case 64:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[21, 58, 61, 64], [25, 44, 48, 56], [49,, 51, 55]]);
      }));

      function runningAsExpoManaged(_x39, _x40, _x41, _x42) {
        return _ref13.apply(this, arguments);
      }

      return runningAsExpoManaged;
    }()
  }, {
    key: '_chooseDistCert',
    value: function () {
      var _ref16 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee12(username, teamId) {
        var certs, choices, _ref18, distCert;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return (_xdl || _load_xdl()).Credentials.getExistingDistCerts(username, teamId);

              case 2:
                certs = _context12.sent;

                if (!(certs.length > 0)) {
                  _context12.next = 13;
                  break;
                }

                choices = certs.map(function (_ref17) {
                  var userCredentialId = _ref17.userCredentialId,
                      certId = _ref17.certId,
                      serialNumber = _ref17.serialNumber,
                      usedByApps = _ref17.usedByApps;

                  var name = 'Serial number: ' + (serialNumber || 'unknown');

                  if (certId) {
                    name = name + ', Certificate ID: ' + certId;
                  }

                  if (usedByApps) {
                    name = 'Used in apps: ' + usedByApps.join(', ') + ' (' + name + ')';
                  }

                  return {
                    name: name,
                    value: {
                      userCredentialId: userCredentialId,
                      serialNumber: serialNumber
                    }
                  };
                });

                choices.push({
                  name: 'No, please create a new one',
                  value: null
                });
                _context12.next = 8;
                return (0, (_prompt || _load_prompt()).default)(createChooseDistCertPrompt(choices));

              case 8:
                _ref18 = _context12.sent;
                distCert = _ref18.distCert;
                return _context12.abrupt('return', {
                  userCredentialId: distCert && String(distCert.userCredentialId),
                  serialNumber: distCert && distCert.serialNumber
                });

              case 13:
                return _context12.abrupt('return', {});

              case 14:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function _chooseDistCert(_x44, _x45) {
        return _ref16.apply(this, arguments);
      }

      return _chooseDistCert;
    }()
  }, {
    key: '_areCredsMissing',
    value: function _areCredsMissing(creds, action) {
      var clientHas = new (_set || _load_set()).default((0, (_keys || _load_keys()).default)(creds));
      var credsMissing = [];
      var obligatoryCreds = clientHas.has('userCredentialId') ? OBLIGATORY_CREDS_KEYS : (0, (_extends2 || _load_extends()).default)({}, OBLIGATORY_CREDS_KEYS, OBLIGATORY_DIST_CERT_CREDS_KEYS);
      var obligatoryKeys = new (_set || _load_set()).default((0, (_keys || _load_keys()).default)(obligatoryCreds));

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, (_getIterator2 || _load_getIterator()).default)(obligatoryKeys.keys()), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var k = _step3.value;

          if (clientHas.has(k) === false) {
            credsMissing.push(k);
            action !== undefined && action();
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (credsMissing.length !== 0) {
        (_log || _load_log()).default.warn('We do not have some credentials for you, ' + credsMissing);
        return (_lodash || _load_lodash()).default.chain(credsMissing).map(function (k) {
          return obligatoryCreds[k];
        }).uniq().value();
      }
    }
  }, {
    key: 'runLocalAuth',
    value: function () {
      var _ref19 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee13(credsMetadata) {
        var credsStarter, clientHasAllNeededCreds, credsMissing, strategy, isEnterprise, appleCredentials, _credsStarter, result, creds, withoutEncrypted;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return (_xdl || _load_xdl()).Credentials.getEncryptedCredentialsForPlatformAsync(credsMetadata);

              case 2:
                credsStarter = _context13.sent;
                clientHasAllNeededCreds = false;
                credsMissing = void 0;

                if (credsStarter !== undefined) {
                  clientHasAllNeededCreds = true;
                  credsMissing = this._areCredsMissing(credsStarter, function () {
                    return clientHasAllNeededCreds = false;
                  });
                } else {
                  credsStarter = {};
                }

                if (!this.checkEnv()) {
                  _context13.next = 15;
                  break;
                }

                _context13.next = 9;
                return this.runningAsCI(credsStarter, credsMetadata);

              case 9:
                this._areCredsMissing(credsStarter);
                _context13.next = 12;
                return (_xdl || _load_xdl()).Credentials.updateCredentialsForPlatform('ios', credsStarter, credsMetadata);

              case 12:
                (_log || _load_log()).default.warn('Encrypted ' + (0, (_keys || _load_keys()).default)(OBLIGATORY_CREDS_KEYS) + ' and saved to expo servers');
                _context13.next = 39;
                break;

              case 15:
                if (!(clientHasAllNeededCreds === false)) {
                  _context13.next = 38;
                  break;
                }

                _context13.next = 18;
                return (0, (_prompt || _load_prompt()).default)(runAsExpertQuestion);

              case 18:
                strategy = _context13.sent;
                isEnterprise = this.options.appleEnterpriseAccount !== undefined;

                credsStarter.enterpriseAccount = isEnterprise ? 'true' : 'false';
                _context13.next = 23;
                return this._validateCredsEnsureAppExists(credsStarter, credsMetadata, !strategy.isExpoManaged, isEnterprise);

              case 23:
                appleCredentials = _context13.sent;

                if (!strategy.isExpoManaged) {
                  _context13.next = 29;
                  break;
                }

                _context13.next = 27;
                return this.runningAsExpoManaged(appleCredentials, credsStarter, credsMetadata, isEnterprise, credsMissing);

              case 27:
                _context13.next = 31;
                break;

              case 29:
                _context13.next = 31;
                return this.runningAsExpert(credsStarter, credsMetadata, credsMissing);

              case 31:
                _credsStarter = credsStarter, result = _credsStarter.result, creds = (0, (_objectWithoutProperties2 || _load_objectWithoutProperties()).default)(_credsStarter, ['result']);

                this._areCredsMissing(creds);

                withoutEncrypted = (_lodash || _load_lodash()).default.pickBy(creds, function (v) {
                  return v !== 'encrypted';
                });
                _context13.next = 36;
                return (_xdl || _load_xdl()).Credentials.updateCredentialsForPlatform('ios', withoutEncrypted, credsMetadata);

              case 36:
                _context13.next = 39;
                break;

              case 38:
                (0, (_log || _load_log()).default)('Using existing credentials for this build');

              case 39:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function runLocalAuth(_x46) {
        return _ref19.apply(this, arguments);
      }

      return runLocalAuth;
    }()
  }, {
    key: '_throwIfFailureWithReasonDump',
    value: function _throwIfFailureWithReasonDump(replyAttempt) {
      if (replyAttempt.result === 'failure') {
        var reason = replyAttempt.reason,
            rawDump = replyAttempt.rawDump;

        throw new Error('Reason:' + reason + ', raw:' + (0, (_stringify || _load_stringify()).default)(rawDump));
      }
    }
  }, {
    key: 'askForAppleCreds',
    value: function () {
      var _ref20 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee14() {
        var justTeamId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (justTeamId === false) {
                  console.log('\nWe need your Apple ID/password to manage certificates and\nprovisioning profiles from your Apple Developer account.\n\nNote: Expo does not keep your Apple ID or your Apple password.\n    ');
                } else {
                  console.log('\nWe need your Apple ID/password to ensure the correct teamID and appID\n\nNote: Expo does not keep your Apple ID or your Apple password.\n    ');
                }
                return _context14.abrupt('return', (0, (_prompt || _load_prompt()).default)(appleCredsQuestions));

              case 2:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function askForAppleCreds() {
        return _ref20.apply(this, arguments);
      }

      return askForAppleCreds;
    }()
  }]);
  return IOSBuilder;
}((_BaseBuilder2 || _load_BaseBuilder()).default);

exports.default = IOSBuilder;
module.exports = exports['default'];
//# sourceMappingURL=../../__sourcemaps__/commands/build/IOSBuilder.js.map
