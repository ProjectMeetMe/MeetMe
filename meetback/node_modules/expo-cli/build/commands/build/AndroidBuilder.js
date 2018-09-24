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

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../../log'));
}

var _BaseBuilder2;

function _load_BaseBuilder() {
  return _BaseBuilder2 = _interopRequireDefault(require('./BaseBuilder'));
}

var _prompt;

function _load_prompt() {
  return _prompt = _interopRequireDefault(require('../../prompt'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AndroidBuilder = function (_BaseBuilder) {
  (0, (_inherits2 || _load_inherits()).default)(AndroidBuilder, _BaseBuilder);

  function AndroidBuilder() {
    (0, (_classCallCheck2 || _load_classCallCheck()).default)(this, AndroidBuilder);
    return (0, (_possibleConstructorReturn2 || _load_possibleConstructorReturn()).default)(this, (AndroidBuilder.__proto__ || (0, (_getPrototypeOf || _load_getPrototypeOf()).default)(AndroidBuilder)).apply(this, arguments));
  }

  (0, (_createClass2 || _load_createClass()).default)(AndroidBuilder, [{
    key: 'run',
    value: function () {
      var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(options) {
        var buildOptions, publishedExpIds;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                buildOptions = options.publicUrl ? { publicUrl: options.publicUrl } : {};
                // Check the status of any current builds

                _context.next = 3;
                return this.checkStatus((0, (_extends2 || _load_extends()).default)({ platform: 'android' }, buildOptions));

              case 3:
                _context.next = 5;
                return this.validateProject(buildOptions);

              case 5:
                _context.next = 7;
                return this.collectAndValidateCredentials(buildOptions);

              case 7:
                if (!options.publicUrl) {
                  _context.next = 11;
                  break;
                }

                _context.t0 = undefined;
                _context.next = 14;
                break;

              case 11:
                _context.next = 13;
                return this.ensureReleaseExists('android');

              case 13:
                _context.t0 = _context.sent;

              case 14:
                publishedExpIds = _context.t0;
                _context.next = 17;
                return this.build(publishedExpIds, 'android', buildOptions);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run(_x) {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: '_clearCredentials',
    value: function () {
      var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var publicUrl, _ref3, _ref3$args, username, remotePackageName, experienceName, credentialMetadata, questions, answers, backupKeystoreOutputPath;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                publicUrl = options.publicUrl;

                if (!publicUrl) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 4;
                return (_xdl || _load_xdl()).Exp.getThirdPartyInfoAsync(publicUrl);

              case 4:
                _context2.t0 = _context2.sent;
                _context2.next = 10;
                break;

              case 7:
                _context2.next = 9;
                return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(this.projectDir);

              case 9:
                _context2.t0 = _context2.sent;

              case 10:
                _ref3 = _context2.t0;
                _ref3$args = _ref3.args;
                username = _ref3$args.username;
                remotePackageName = _ref3$args.remotePackageName;
                experienceName = _ref3$args.remoteFullPackageName;
                credentialMetadata = {
                  username: username,
                  experienceName: experienceName,
                  platform: 'android'
                };


                (_log || _load_log()).default.warn('Clearing your Android build credentials from our build servers is a ' + (_chalk || _load_chalk()).default.red('PERMANENT and IRREVERSIBLE action.'));
                (_log || _load_log()).default.warn('Android keystores must be identical to the one previously used to submit your app to the Google Play Store.');
                (_log || _load_log()).default.warn('Please read https://docs.expo.io/versions/latest/guides/building-standalone-apps.html#if-you-choose-to-build-for-android for more info before proceeding.');
                (_log || _load_log()).default.warn("We'll store a backup of your Android keystore in this directory in case you decide to delete it from our servers.");
                questions = [{
                  type: 'confirm',
                  name: 'confirm',
                  message: 'Permanently delete the Android build credentials from our servers?'
                }];
                _context2.next = 23;
                return (0, (_prompt || _load_prompt()).default)(questions);

              case 23:
                answers = _context2.sent;

                if (!answers.confirm) {
                  _context2.next = 32;
                  break;
                }

                (0, (_log || _load_log()).default)('Backing up your Android keystore now...');
                backupKeystoreOutputPath = _path.default.resolve(this.projectDir, remotePackageName + '.jks.bak');
                _context2.next = 29;
                return (_xdl || _load_xdl()).Credentials.backupExistingAndroidCredentials({
                  outputPath: backupKeystoreOutputPath,
                  username: username,
                  experienceName: experienceName,
                  log: (_log || _load_log()).default
                });

              case 29:
                _context2.next = 31;
                return (_xdl || _load_xdl()).Credentials.removeCredentialsForPlatform('android', credentialMetadata);

              case 31:
                (_log || _load_log()).default.warn('Removed existing credentials from Expo servers');

              case 32:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _clearCredentials() {
        return _ref2.apply(this, arguments);
      }

      return _clearCredentials;
    }()
  }, {
    key: 'collectAndValidateCredentials',
    value: function () {
      var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee4() {
        var _this2 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var publicUrl, _ref5, _ref5$args, username, experienceName, credentialMetadata, credentialsExist, questions, answers, keystorePath, keystoreAlias, keystorePassword, keyPassword, keystoreData, credentials;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                publicUrl = options.publicUrl;

                if (!publicUrl) {
                  _context4.next = 7;
                  break;
                }

                _context4.next = 4;
                return (_xdl || _load_xdl()).Exp.getThirdPartyInfoAsync(publicUrl);

              case 4:
                _context4.t0 = _context4.sent;
                _context4.next = 10;
                break;

              case 7:
                _context4.next = 9;
                return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(this.projectDir);

              case 9:
                _context4.t0 = _context4.sent;

              case 10:
                _ref5 = _context4.t0;
                _ref5$args = _ref5.args;
                username = _ref5$args.username;
                experienceName = _ref5$args.remoteFullPackageName;
                credentialMetadata = {
                  username: username,
                  experienceName: experienceName,
                  platform: 'android'
                };
                _context4.next = 17;
                return (_xdl || _load_xdl()).Credentials.credentialsExistForPlatformAsync(credentialMetadata);

              case 17:
                credentialsExist = _context4.sent;

                if (!this.checkEnv()) {
                  _context4.next = 23;
                  break;
                }

                _context4.next = 21;
                return this.collectAndValidateCredentialsFromCI(credentialMetadata);

              case 21:
                _context4.next = 42;
                break;

              case 23:
                if (!(this.options.clearCredentials || !credentialsExist)) {
                  _context4.next = 42;
                  break;
                }

                console.log('');
                questions = [{
                  type: 'rawlist',
                  name: 'uploadKeystore',
                  message: 'Would you like to upload a keystore or have us generate one for you?\nIf you don\'t know what this means, let us handle it! :)\n',
                  choices: [{ name: 'Let Expo handle the process!', value: false }, { name: 'I want to upload my own keystore!', value: true }]
                }, {
                  type: 'input',
                  name: 'keystorePath',
                  message: 'Path to keystore:',
                  validate: function () {
                    var _ref6 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3(keystorePath) {
                      var keystorePathStats;
                      return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _context3.prev = 0;
                              _context3.next = 3;
                              return (_fsExtra || _load_fsExtra()).default.stat(keystorePath);

                            case 3:
                              keystorePathStats = _context3.sent;
                              return _context3.abrupt('return', keystorePathStats.isFile());

                            case 7:
                              _context3.prev = 7;
                              _context3.t0 = _context3['catch'](0);

                              // file does not exist
                              console.log('\nFile does not exist.');
                              return _context3.abrupt('return', false);

                            case 11:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, _callee3, _this2, [[0, 7]]);
                    }));

                    return function validate(_x4) {
                      return _ref6.apply(this, arguments);
                    };
                  }(),
                  filter: function filter(keystorePath) {
                    keystorePath = (0, (_untildify || _load_untildify()).default)(keystorePath);
                    if (!_path.default.isAbsolute(keystorePath)) {
                      keystorePath = _path.default.resolve(keystorePath);
                    }
                    return keystorePath;
                  },
                  when: function when(answers) {
                    return answers.uploadKeystore;
                  }
                }, {
                  type: 'input',
                  name: 'keystoreAlias',
                  message: 'Keystore Alias:',
                  validate: function validate(val) {
                    return val !== '';
                  },
                  when: function when(answers) {
                    return answers.uploadKeystore;
                  }
                }, {
                  type: 'password',
                  name: 'keystorePassword',
                  message: 'Keystore Password:',
                  validate: function validate(val) {
                    return val !== '';
                  },
                  when: function when(answers) {
                    return answers.uploadKeystore;
                  }
                }, {
                  type: 'password',
                  name: 'keyPassword',
                  message: 'Key Password:',
                  validate: function validate(password, answers) {
                    if (password === '') {
                      return false;
                    }
                    // Todo validate keystore passwords
                    return true;
                  },
                  when: function when(answers) {
                    return answers.uploadKeystore;
                  }
                }];
                _context4.next = 28;
                return (0, (_prompt || _load_prompt()).default)(questions);

              case 28:
                answers = _context4.sent;

                if (answers.uploadKeystore) {
                  _context4.next = 35;
                  break;
                }

                if (!(this.options.clearCredentials && credentialsExist)) {
                  _context4.next = 33;
                  break;
                }

                _context4.next = 33;
                return this._clearCredentials(options);

              case 33:
                _context4.next = 42;
                break;

              case 35:
                keystorePath = answers.keystorePath, keystoreAlias = answers.keystoreAlias, keystorePassword = answers.keystorePassword, keyPassword = answers.keyPassword;

                // read the keystore

                _context4.next = 38;
                return (_fsExtra || _load_fsExtra()).default.readFile(keystorePath);

              case 38:
                keystoreData = _context4.sent;
                credentials = {
                  keystore: keystoreData.toString('base64'),
                  keystoreAlias: keystoreAlias,
                  keystorePassword: keystorePassword,
                  keyPassword: keyPassword
                };
                _context4.next = 42;
                return (_xdl || _load_xdl()).Credentials.updateCredentialsForPlatform('android', credentials, credentialMetadata);

              case 42:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function collectAndValidateCredentials() {
        return _ref4.apply(this, arguments);
      }

      return collectAndValidateCredentials;
    }()
  }, {
    key: 'checkEnv',
    value: function checkEnv() {
      return this.options.keystorePath && this.options.keystoreAlias && process.env.EXPO_ANDROID_KEYSTORE_PASSWORD && process.env.EXPO_ANDROID_KEY_PASSWORD;
    }
  }, {
    key: 'collectAndValidateCredentialsFromCI',
    value: function () {
      var _ref7 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee5(credentialMetadata) {
        var credentials;
        return (_regenerator || _load_regenerator()).default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (_fsExtra || _load_fsExtra()).default.readFile(this.options.keystorePath);

              case 2:
                _context5.t0 = _context5.sent.toString('base64');
                _context5.t1 = this.options.keystoreAlias;
                _context5.t2 = process.env.EXPO_ANDROID_KEYSTORE_PASSWORD;
                _context5.t3 = process.env.EXPO_ANDROID_KEY_PASSWORD;
                credentials = {
                  keystore: _context5.t0,
                  keystoreAlias: _context5.t1,
                  keystorePassword: _context5.t2,
                  keyPassword: _context5.t3
                };
                _context5.next = 9;
                return (_xdl || _load_xdl()).Credentials.updateCredentialsForPlatform('android', credentials, credentialMetadata);

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function collectAndValidateCredentialsFromCI(_x5) {
        return _ref7.apply(this, arguments);
      }

      return collectAndValidateCredentialsFromCI;
    }()
  }, {
    key: 'validateProject',
    value: function () {
      var _ref8 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee6(options) {
        var publicUrl, _ref9, sdkVersion;

        return (_regenerator || _load_regenerator()).default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                publicUrl = options.publicUrl;

                if (!publicUrl) {
                  _context6.next = 7;
                  break;
                }

                _context6.next = 4;
                return (_xdl || _load_xdl()).Exp.getThirdPartyInfoAsync(publicUrl);

              case 4:
                _context6.t0 = _context6.sent;
                _context6.next = 10;
                break;

              case 7:
                _context6.next = 9;
                return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(this.projectDir);

              case 9:
                _context6.t0 = _context6.sent;

              case 10:
                _ref9 = _context6.t0;
                sdkVersion = _ref9.args.sdkVersion;
                _context6.next = 14;
                return this.checkIfSdkIsSupported(sdkVersion, 'android');

              case 14:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function validateProject(_x6) {
        return _ref8.apply(this, arguments);
      }

      return validateProject;
    }()
  }]);
  return AndroidBuilder;
}((_BaseBuilder2 || _load_BaseBuilder()).default);

exports.default = AndroidBuilder;
module.exports = exports['default'];
//# sourceMappingURL=../../__sourcemaps__/commands/build/AndroidBuilder.js.map
