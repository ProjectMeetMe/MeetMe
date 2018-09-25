'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.revokeCredentialsOnApple = exports.askWhichCertsToDump = exports.revokeProvisioningProfile = exports.prepareLocalAuth = exports.validateCredentialsProduceTeamId = exports.doFastlaneActionsExist = exports.doesFileProvidedExist = exports.DEBUG = exports.MULTIPLE_PROFILES = exports.APPLE_ERRORS = exports.NO_BUNDLE_ID = undefined;

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _stringify;

function _load_stringify() {
  return _stringify = _interopRequireDefault(require('babel-runtime/core-js/json/stringify'));
}

var _keys;

function _load_keys() {
  return _keys = _interopRequireDefault(require('babel-runtime/core-js/object/keys'));
}

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _regenerator;

function _load_regenerator() {
  return _regenerator = _interopRequireDefault(require('babel-runtime/regenerator'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var validateCredentialsProduceTeamId = exports.validateCredentialsProduceTeamId = function () {
  var _ref6 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee4(creds) {
    var getTeamsAttempt, reason, rawDump, teams, _teams, team, teamChoices, answers, chosenTeam;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return spawnAndCollectJSONOutputAsync(FASTLANE.validate_apple_credentials, [creds.appleId, creds.password]);

          case 2:
            getTeamsAttempt = _context4.sent;

            if (!(getTeamsAttempt.result === 'failure')) {
              _context4.next = 7;
              break;
            }

            reason = getTeamsAttempt.reason, rawDump = getTeamsAttempt.rawDump;
            // TODO: remove this after upgrading fastlane in @expo/traveling-fastlane-*

            findCommonFastlaneErrors(rawDump);
            throw new Error('Reason:' + reason + ', raw:' + (0, (_stringify || _load_stringify()).default)(rawDump));

          case 7:
            teams = getTeamsAttempt.teams;

            if (!(teams.length === 0)) {
              _context4.next = 10;
              break;
            }

            throw new Error(NO_TEAM_ID);

          case 10:
            if (!(teams.length === 1)) {
              _context4.next = 16;
              break;
            }

            (0, (_log || _load_log()).default)('Only 1 team associated with your account, using Team ID: ' + teams[0].teamId);
            _teams = (0, (_slicedToArray2 || _load_slicedToArray()).default)(teams, 1), team = _teams[0];
            return _context4.abrupt('return', {
              teamId: team.teamId,
              teamName: team.name + ' (' + team.type + ')'
            });

          case 16:
            (0, (_log || _load_log()).default)('You have ' + teams.length + ' teams');
            teamChoices = teams.map(function (team, i) {
              return i + 1 + ') ' + team['teamId'] + ' "' + team['name'] + '" (' + team['type'] + ')';
            });

            teamChoices.forEach(function (choice) {
              return console.log(choice);
            });
            _context4.next = 21;
            return (0, (_prompt || _load_prompt()).default)({
              type: 'list',
              name: 'choice',
              message: 'Which Team ID to use?',
              choices: teamChoices
            });

          case 21:
            answers = _context4.sent;
            chosenTeam = teams[teamChoices.indexOf(answers.choice)];
            return _context4.abrupt('return', {
              teamId: chosenTeam.teamId,
              teamName: chosenTeam.name + ' (' + chosenTeam.type + ')'
            });

          case 24:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function validateCredentialsProduceTeamId(_x4) {
    return _ref6.apply(this, arguments);
  };
}();

// TODO: remove this after upgrading fastlane in @expo/traveling-fastlane-*


var prepareLocalAuth = exports.prepareLocalAuth = function () {
  var _ref7 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee5() {
    var _release$match, _release$match2, version, _userInfo, username;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (DEBUG) {
              (_log || _load_log()).default.warn(APPLE_ERRORS);
            }

            if (!(process.platform === 'win32')) {
              _context5.next = 14;
              break;
            }

            _release$match = (0, _os.release)().match(/\d./), _release$match2 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_release$match, 1), version = _release$match2[0];

            if (version !== '10') {
              (_log || _load_log()).default.warn('Must be on at least Windows version 10 for WSL support to work');
            }
            _userInfo = (0, _os.userInfo)(), username = _userInfo.username;

            if (username && username.split(' ').length !== 1) {
              (_log || _load_log()).default.warn('Your username should not have empty space in it, exp might fail');
            }
            // Does bash.exe exist?
            _context5.prev = 6;
            _context5.next = 9;
            return (_fsExtra || _load_fsExtra()).default.access(WSL_BASH, (_fsExtra || _load_fsExtra()).default.constants.F_OK);

          case 9:
            _context5.next = 14;
            break;

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5['catch'](6);

            (_log || _load_log()).default.warn(ENABLE_WSL);

          case 14:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[6, 11]]);
  }));

  return function prepareLocalAuth() {
    return _ref7.apply(this, arguments);
  };
}();

var revokeProvisioningProfile = exports.revokeProvisioningProfile = function () {
  var _ref8 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee6(creds, metadata, teamId) {
    var args;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            args = ['revokeProvisioningProfile', creds.appleId, creds.password, teamId, metadata.bundleIdentifier, metadata.experienceName, '[]', 'false'];
            return _context6.abrupt('return', spawnAndCollectJSONOutputAsync(FASTLANE.app_management, args));

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function revokeProvisioningProfile(_x5, _x6, _x7) {
    return _ref8.apply(this, arguments);
  };
}();

var askWhichCertsToDump = exports.askWhichCertsToDump = function () {
  var _ref9 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee7(creds, metadata, teamId, distOrPush, isEnterprise) {
    var args, dumpExistingCertsAttempt, certs, trimmedOneLiners, _ref10, revokeTheseCerts, certIds;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            args = [distOrPush === 'distCert' && 'dumpDistCert' || distOrPush === 'pushCert' && 'dumpPushCert', creds.appleId, creds.password, teamId, metadata.bundleIdentifier, metadata.experienceName, '[]', isEnterprise ? 'true' : 'false'];
            _context7.next = 3;
            return spawnAndCollectJSONOutputAsync(FASTLANE.app_management, args);

          case 3:
            dumpExistingCertsAttempt = _context7.sent;

            if (!(dumpExistingCertsAttempt.result === 'success')) {
              _context7.next = 18;
              break;
            }

            certs = dumpExistingCertsAttempt.certs;
            trimmedOneLiners = certs.map(function (s) {
              return s.split('\n').map(function (i) {
                return i.trim().replace(',', '');
              }).join(' ');
            });

            if (!(trimmedOneLiners.length === 0)) {
              _context7.next = 10;
              break;
            }

            (_log || _load_log()).default.warn('No certs on developer.apple.com available to revoke');
            return _context7.abrupt('return', []);

          case 10:
            _context7.next = 12;
            return (0, (_prompt || _load_prompt()).default)({
              type: 'checkbox',
              name: 'revokeTheseCerts',
              message: 'Which Certs to revoke?',
              choices: trimmedOneLiners
            });

          case 12:
            _ref10 = _context7.sent;
            revokeTheseCerts = _ref10.revokeTheseCerts;
            certIds = revokeTheseCerts.map(function (s) {
              return trimmedOneLiners[trimmedOneLiners.indexOf(s)];
            }).map(function (s) {
              return s.split(' ')[1].split('=')[1];
            }).map(function (s) {
              return s.slice(1, s.length - 1);
            });
            return _context7.abrupt('return', certIds);

          case 18:
            (_log || _load_log()).default.warn('Unable to dump existing Apple Developer files: ' + (0, (_stringify || _load_stringify()).default)(dumpExistingCertsAttempt.reason));
            return _context7.abrupt('return', []);

          case 20:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function askWhichCertsToDump(_x8, _x9, _x10, _x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();

var revokeCredentialsOnApple = exports.revokeCredentialsOnApple = function () {
  var _ref11 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee8(creds, metadata, ids, teamId) {
    var args;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            args = ['revokeCerts', creds.appleId, creds.password, teamId, metadata.bundleIdentifier, metadata.experienceName];

            if (process.platform === 'win32') {
              args.push(ids.length === 0 ? '[]' : '[' + ids.map(function (i) {
                return '\\"' + i + '\\"';
              }).join(',') + ']');
            } else {
              args.push(ids.length === 0 ? '[]' : '[' + ids.map(function (i) {
                return '"' + i + '"';
              }).join(',') + ']');
            }

            return _context8.abrupt('return', spawnAndCollectJSONOutputAsync(FASTLANE.app_management, args));

          case 3:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function revokeCredentialsOnApple(_x13, _x14, _x15, _x16) {
    return _ref11.apply(this, arguments);
  };
}();

var spawnAndCollectJSONOutputAsync = function () {
  var _ref12 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee9(program, args) {
    var prgm, cmd;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            prgm = program;
            cmd = args;
            return _context9.abrupt('return', (_promise || _load_promise()).default.race([new (_promise || _load_promise()).default(function (resolve, reject) {
              setTimeout(function () {
                return reject(new Error(timeout_msg(prgm, cmd)));
              }, TIMEOUT);
            }), new (_promise || _load_promise()).default(function (resolve, reject) {
              var jsonContent = [];
              try {
                if (process.platform === 'win32') {
                  prgm = WSL_BASH;
                  cmd = ['-c', WSL_ONLY_PATH + ' /mnt/c' + windowsToWSLPath(program) + ' "' + args.join(' ') + '"'];
                  if (DEBUG) {
                    (_log || _load_log()).default.warn('Running: bash.exe ' + cmd.join(' '));
                  }
                  var child = _child_process.default.spawn(prgm, cmd, opts);
                } else {
                  var wrapped = ['' + cmd.join(' ')];
                  var child = _child_process.default.spawn(prgm, wrapped, opts);
                }
              } catch (e) {
                return reject(e);
              }
              child.stdout.on('data', function (d) {
                return console.log(d.toString());
              });
              // This is where we get our replies back from the ruby code
              child.stderr.on('data', function (d) {
                return jsonContent.push(d);
              });
              child.stdout.on('end', function () {
                var rawDump = Buffer.concat(jsonContent).toString();
                try {
                  resolve(JSON.parse(rawDump));
                } catch (e) {
                  reject({
                    result: 'failure',
                    reason: 'Could not understand JSON reply from Ruby based local auth scripts',
                    rawDump: rawDump
                  });
                }
              });
            })]));

          case 3:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function spawnAndCollectJSONOutputAsync(_x17, _x18) {
    return _ref12.apply(this, arguments);
  };
}();

exports.createAppOnPortal = createAppOnPortal;
exports.ensureAppIdLocally = ensureAppIdLocally;
exports.produceProvisionProfile = produceProvisionProfile;
exports.producePushCerts = producePushCerts;
exports.produceCerts = produceCerts;

var _child_process = _interopRequireDefault(require('child_process'));

var _slash;

function _load_slash() {
  return _slash = _interopRequireDefault(require('slash'));
}

var _fsExtra;

function _load_fsExtra() {
  return _fsExtra = _interopRequireDefault(require('fs-extra'));
}

var _os = require('os');

var _lodash;

function _load_lodash() {
  return _lodash = _interopRequireDefault(require('lodash'));
}

var _prompt;

function _load_prompt() {
  return _prompt = _interopRequireDefault(require('../../prompt'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../../log'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FASTLANE = process.platform === 'darwin' ? require('@expo/traveling-fastlane-darwin')() : require('@expo/traveling-fastlane-linux')(); // Getting an undefined anywhere here probably means a ruby script is throwing an exception


var WSL_BASH = 'C:\\Windows\\system32\\bash.exe';

var WSL_ONLY_PATH = 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';

var NO_BUNDLE_ID = exports.NO_BUNDLE_ID = 'App could not be found for bundle id';

var APPLE_ERRORS = exports.APPLE_ERRORS = 'If you get errors about\n\n\'Maximum number of certificates generated\' or \'duplicate profiles\'\n\nthen consider using the flags --revoke-apple-dist-certs, --revoke-apple-push-certs,\nand --revoke-apple-provisioning-profile or go to developer.apple.com\nand revoke those credentials manually\n';

var MULTIPLE_PROFILES = exports.MULTIPLE_PROFILES = 'Multiple profiles found with the name';

var DEBUG = exports.DEBUG = process.env.EXPO_DEBUG && process.env.EXPO_DEBUG === 'true';

var ENABLE_WSL = '\nDoes not seem like WSL enabled on this machine. Download from the Windows app\nstore a distribution of Linux, then in an admin powershell, please run:\n\nEnable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux\n\nand run the new Linux installation at least once\n';

var doesFileProvidedExist = exports.doesFileProvidedExist = function () {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(printOut, p12Path) {
    var stats;
    return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (_fsExtra || _load_fsExtra()).default.stat(p12Path);

          case 3:
            stats = _context.sent;
            return _context.abrupt('return', stats.isFile());

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            if (printOut) {
              console.log('\nFile does not exist.');
            }
            return _context.abrupt('return', false);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function doesFileProvidedExist(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var doFastlaneActionsExist = exports.doFastlaneActionsExist = function () {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3() {
    return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', (_promise || _load_promise()).default.all((0, (_keys || _load_keys()).default)(FASTLANE).map(function () {
              var _ref3 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(action) {
                var path;
                return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        path = FASTLANE[action];
                        _context2.t0 = action;
                        _context2.t1 = path;
                        _context2.next = 5;
                        return doesFileProvidedExist(false, path);

                      case 5:
                        _context2.t2 = _context2.sent;
                        return _context2.abrupt('return', {
                          action: _context2.t0,
                          path: _context2.t1,
                          doesExist: _context2.t2
                        });

                      case 7:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x3) {
                return _ref3.apply(this, arguments);
              };
            }())));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function doFastlaneActionsExist() {
    return _ref2.apply(this, arguments);
  };
}();

function appStoreAction(creds, metadata, teamId, action) {
  var args = [action, creds.appleId, creds.password, teamId, metadata.bundleIdentifier, metadata.experienceName, '[]', 'false'];
  return spawnAndCollectJSONOutputAsync(FASTLANE.app_management, args);
}

function createAppOnPortal(creds, metadata, teamId) {
  return appStoreAction(creds, metadata, teamId, 'create');
}

function ensureAppIdLocally(creds, metadata, teamId) {
  return appStoreAction(creds, metadata, teamId, 'verify');
}

function produceProvisionProfile(credentials, _ref4, teamId, isEnterprise) {
  var bundleIdentifier = _ref4.bundleIdentifier,
      distCertSerialNumber = _ref4.distCertSerialNumber;

  return spawnAndCollectJSONOutputAsync(FASTLANE.fetch_new_provisioning_profile, [credentials.appleId, credentials.password, bundleIdentifier, teamId, distCertSerialNumber || '__last__', isEnterprise]);
}

function producePushCerts(credentials, _ref5, teamId, isEnterprise) {
  var bundleIdentifier = _ref5.bundleIdentifier;

  return spawnAndCollectJSONOutputAsync(FASTLANE.fetch_push_cert, [credentials.appleId, credentials.password, bundleIdentifier, teamId, isEnterprise]);
}

function produceCerts(credentials, teamId, isEnterprise) {
  return spawnAndCollectJSONOutputAsync(FASTLANE.fetch_cert, [credentials.appleId, credentials.password, teamId, isEnterprise]);
}

var NO_TEAM_ID = 'You have no team ID associated with your apple account, cannot proceed.\n(Do you have a paid Apple developer Account?)';

var findCommonFastlaneErrors = function findCommonFastlaneErrors(message) {
  if (message) {
    var lines = message.split('\n');
    var firstLineRaw = lines[0];
    // converting ruby hash to json
    var maybeJSON = firstLineRaw.replace(/=>/g, ':');
    var maybeObject = (_lodash || _load_lodash()).default.attempt(JSON.parse, maybeJSON);
    if (!(_lodash || _load_lodash()).default.isError(maybeObject) && (_lodash || _load_lodash()).default.includes(['sa', 'hsa', 'non-sa', 'hsa2'], maybeObject.authType)) {
      throw new Error("Need to acknowledge to Apple's Apple ID and Privacy statement. Please manually log into https://appleid.apple.com (or https://itunesconnect.apple.com) to acknowledge the statement.");
    }
  }
};

var windowsToWSLPath = function windowsToWSLPath(p) {
  var noSlashes = (0, (_slash || _load_slash()).default)(p);
  return noSlashes.slice(2, noSlashes.length);
};

var MINUTES = 10;

var TIMEOUT = 60 * 1000 * MINUTES;

var timeout_msg = function timeout_msg(prgm, args) {
  return process.platform === 'win32' ? 'Took too long (limit is ' + MINUTES + ' minutes) to execute ' + prgm + ' ' + args.join(' ') + '.\nIs your WSL working? in Powershell try: bash.exe -c \'uname\'' : 'Took too long (limit is ' + MINUTES + ' minutes) to execute ' + prgm + ' ' + args.join(' ');
};

var opts = { stdio: ['inherit', 'pipe', 'pipe'] };
//# sourceMappingURL=../../__sourcemaps__/commands/build/auth.js.map
