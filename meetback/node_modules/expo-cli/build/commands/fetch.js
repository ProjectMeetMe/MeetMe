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

var _chalk;

function _load_chalk() {
  return _chalk = _interopRequireDefault(require('chalk'));
}

var _fs = _interopRequireDefault(require('fs'));

var _path = _interopRequireDefault(require('path'));

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _crypto = _interopRequireDefault(require('crypto'));

var _spawnAsync;

function _load_spawnAsync() {
  return _spawnAsync = _interopRequireDefault(require('@expo/spawn-async'));
}

var _log;

function _load_log() {
  return _log = _interopRequireDefault(require('../log'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exportCertAsync(keystoreFile, keystorePassword, keyAlias, certFile) {
  return (0, (_spawnAsync || _load_spawnAsync()).default)('keytool', ['-exportcert', '-keystore', keystoreFile, '-storepass', keystorePassword, '-alias', keyAlias, '-file', certFile, '-noprompt', '-storetype', 'JKS']);
}

exports.default = function (program) {
  program.command('fetch:ios:certs [project-dir]').description('Fetch this project\'s iOS certificates and provisioning profile. Writes certificates to PROJECT_DIR/PROJECT_NAME_(dist|push).p12 and prints passwords to stdout.').asyncActionProjectDir(function () {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee(projectDir, options) {
      var _ref2, _ref2$args, username, remotePackageName, experienceName, bundleIdentifier, distOutputFile, pushOutputFile, credentialMetadata, _ref3, certP12, certPassword, certPrivateSigningKey, pushP12, pushPassword, pushPrivateSigningKey, provisioningProfile, teamId, keyPath, _keyPath, p;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 2:
              _ref2 = _context.sent;
              _ref2$args = _ref2.args;
              username = _ref2$args.username;
              remotePackageName = _ref2$args.remotePackageName;
              experienceName = _ref2$args.remoteFullPackageName;
              bundleIdentifier = _ref2$args.bundleIdentifierIOS;
              distOutputFile = _path.default.resolve(projectDir, remotePackageName + '_dist.p12');
              pushOutputFile = _path.default.resolve(projectDir, remotePackageName + '_push.p12');
              credentialMetadata = { username: username, experienceName: experienceName, platform: 'ios', bundleIdentifier: bundleIdentifier };


              (0, (_log || _load_log()).default)('Retreiving iOS credentials for ' + experienceName);

              _context.prev = 12;
              _context.next = 15;
              return (_xdl || _load_xdl()).Credentials.getCredentialsForPlatform(credentialMetadata);

            case 15:
              _ref3 = _context.sent;
              certP12 = _ref3.certP12;
              certPassword = _ref3.certPassword;
              certPrivateSigningKey = _ref3.certPrivateSigningKey;
              pushP12 = _ref3.pushP12;
              pushPassword = _ref3.pushPassword;
              pushPrivateSigningKey = _ref3.pushPrivateSigningKey;
              provisioningProfile = _ref3.provisioningProfile;
              teamId = _ref3.teamId;

              // if undefines because some people might have pre-local-auth as default credentials.
              if (teamId !== undefined) {
                (0, (_log || _load_log()).default)('These credentials are associated with Apple Team ID: ' + teamId);
              }
              (0, (_log || _load_log()).default)('Writing distribution cert to ' + distOutputFile + '...');
              _fs.default.writeFileSync(distOutputFile, Buffer.from(certP12, 'base64'));
              if (certPrivateSigningKey !== undefined) {
                keyPath = _path.default.resolve(projectDir, remotePackageName + '_dist_cert_private.key');

                _fs.default.writeFileSync(keyPath, certPrivateSigningKey);
              }
              (0, (_log || _load_log()).default)('Done writing distribution cert credentials to disk.');
              (0, (_log || _load_log()).default)('Writing push cert to ' + pushOutputFile + '...');
              _fs.default.writeFileSync(pushOutputFile, Buffer.from(pushP12, 'base64'));
              if (pushPrivateSigningKey !== undefined) {
                _keyPath = _path.default.resolve(projectDir, remotePackageName + '_push_cert_private.key');

                _fs.default.writeFileSync(_keyPath, pushPrivateSigningKey);
              }
              (0, (_log || _load_log()).default)('Done writing push cert credentials to disk.');
              if (provisioningProfile !== undefined) {
                p = _path.default.resolve(projectDir, remotePackageName + '.mobileprovision');

                (0, (_log || _load_log()).default)('Writing provisioning profile to ' + p + '...');
                _fs.default.writeFileSync(p, Buffer.from(provisioningProfile, 'base64'));
                (0, (_log || _load_log()).default)('Done writing provisioning profile to disk');
              }
              (0, (_log || _load_log()).default)('Save these important values as well:\n\nDistribution p12 password: ' + (_chalk || _load_chalk()).default.bold(certPassword) + '\nPush p12 password:         ' + (_chalk || _load_chalk()).default.bold(pushPassword) + '\n');
              _context.next = 40;
              break;

            case 37:
              _context.prev = 37;
              _context.t0 = _context['catch'](12);
              throw new Error('Unable to fetch credentials for this project. Are you sure they exist?');

            case 40:

              (0, (_log || _load_log()).default)('All done!');

            case 41:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[12, 37]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }(), true);

  program.command('fetch:android:keystore [project-dir]').description("Fetch this project's Android keystore. Writes keystore to PROJECT_DIR/PROJECT_NAME.jks and prints passwords to stdout.").asyncActionProjectDir(function () {
    var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2(projectDir, options) {
      var _ref5, _ref5$args, username, remotePackageName, experienceName, backupKeystoreOutputPath;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 2:
              _ref5 = _context2.sent;
              _ref5$args = _ref5.args;
              username = _ref5$args.username;
              remotePackageName = _ref5$args.remotePackageName;
              experienceName = _ref5$args.remoteFullPackageName;
              backupKeystoreOutputPath = _path.default.resolve(projectDir, remotePackageName + '.jks');
              _context2.next = 10;
              return (_xdl || _load_xdl()).Credentials.backupExistingAndroidCredentials({
                outputPath: backupKeystoreOutputPath,
                username: username,
                experienceName: experienceName,
                log: (_log || _load_log()).default
              });

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  }(), true);

  program.command('fetch:android:hashes [project-dir]').description("Fetch this project's Android key hashes needed to setup Google/Facebook authentication.").asyncActionProjectDir(function () {
    var _ref6 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee3(projectDir, options) {
      var _ref7, _ref7$args, username, remotePackageName, experienceName, outputPath, _ref8, keystorePassword, keyAlias, certFile, data, googleHash, fbHash;

      return (_regenerator || _load_regenerator()).default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (_xdl || _load_xdl()).Exp.getPublishInfoAsync(projectDir);

            case 2:
              _ref7 = _context3.sent;
              _ref7$args = _ref7.args;
              username = _ref7$args.username;
              remotePackageName = _ref7$args.remotePackageName;
              experienceName = _ref7$args.remoteFullPackageName;
              outputPath = _path.default.resolve(projectDir, remotePackageName + '.tmp.jks');
              _context3.next = 10;
              return (_xdl || _load_xdl()).Credentials.backupExistingAndroidCredentials({
                outputPath: outputPath,
                username: username,
                experienceName: experienceName,
                log: (_log || _load_log()).default,
                logSecrets: false
              });

            case 10:
              _ref8 = _context3.sent;
              keystorePassword = _ref8.keystorePassword;
              keyAlias = _ref8.keyAlias;
              certFile = outputPath.replace('jks', 'cer');
              _context3.prev = 14;
              _context3.next = 17;
              return exportCertAsync(outputPath, keystorePassword, keyAlias, certFile);

            case 17:
              data = _fs.default.readFileSync(certFile);
              googleHash = _crypto.default.createHash('sha1').update(data).digest('hex').toUpperCase();
              fbHash = _crypto.default.createHash('sha1').update(data).digest('base64');

              (0, (_log || _load_log()).default)('Google Certificate Fingerprint:  ' + googleHash.replace(/(.{2}(?!$))/g, '$1:'));
              (0, (_log || _load_log()).default)('Google Certificate Hash:         ' + googleHash);
              (0, (_log || _load_log()).default)('Facebook Key Hash:               ' + fbHash);
              _context3.next = 31;
              break;

            case 25:
              _context3.prev = 25;
              _context3.t0 = _context3['catch'](14);

              if (_context3.t0.code === 'ENOENT') {
                (_log || _load_log()).default.warn('Are you sure you have keytool installed?');
                (0, (_log || _load_log()).default)('keytool is part of openJDK: http://openjdk.java.net/');
                (0, (_log || _load_log()).default)('Also make sure that keytool is in your PATH after installation.');
              }
              if (_context3.t0.stdout) {
                (0, (_log || _load_log()).default)(_context3.t0.stdout);
              }
              if (_context3.t0.stderr) {
                (_log || _load_log()).default.error(_context3.t0.stderr);
              }
              throw _context3.t0;

            case 31:
              _context3.prev = 31;

              try {
                _fs.default.unlinkSync(certFile);
              } catch (err) {
                if (err.code !== 'ENOENT') {
                  (_log || _load_log()).default.error(err);
                }
              }
              try {
                _fs.default.unlinkSync(outputPath);
              } catch (err) {
                if (err.code !== 'ENOENT') {
                  (_log || _load_log()).default.error(err);
                }
              }
              return _context3.finish(31);

            case 35:

              (0, (_log || _load_log()).default)('All done!');

            case 36:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[14, 25, 31, 35]]);
    }));

    return function (_x5, _x6) {
      return _ref6.apply(this, arguments);
    };
  }(), true);
};

module.exports = exports['default'];
//# sourceMappingURL=../__sourcemaps__/commands/fetch.js.map
