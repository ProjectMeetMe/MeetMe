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

var checkForUpdateAsync = function () {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee2() {
    var current, _ref3, latest, state;

    return (_regenerator || _load_regenerator()).default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            current = (_package || _load_package()).default.version;

            // check for an outdated install based on either a fresh npm query or our cache

            _context2.next = 3;
            return UpdateCacher.getAsync();

          case 3:
            _ref3 = _context2.sent;
            latest = _ref3.latestVersion;
            state = void 0;
            _context2.t0 = (_semver || _load_semver()).default.compare(current, latest);
            _context2.next = _context2.t0 === -1 ? 9 : _context2.t0 === 0 ? 11 : _context2.t0 === 1 ? 13 : 15;
            break;

          case 9:
            state = 'out-of-date';
            return _context2.abrupt('break', 16);

          case 11:
            state = 'up-to-date';
            return _context2.abrupt('break', 16);

          case 13:
            state = 'ahead-of-published';
            return _context2.abrupt('break', 16);

          case 15:
            throw new Error('Confused about whether CLI is up-to-date or not');

          case 16:
            return _context2.abrupt('return', {
              state: state,
              current: current,
              latest: latest
            });

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function checkForUpdateAsync() {
    return _ref2.apply(this, arguments);
  };
}();

var _jsonFile;

function _load_jsonFile() {
  return _jsonFile = _interopRequireDefault(require('@expo/json-file'));
}

var _path = _interopRequireDefault(require('path'));

var _semver;

function _load_semver() {
  return _semver = _interopRequireDefault(require('semver'));
}

var _spawnAsync;

function _load_spawnAsync() {
  return _spawnAsync = _interopRequireDefault(require('@expo/spawn-async'));
}

var _xdl;

function _load_xdl() {
  return _xdl = require('xdl');
}

var _package;

function _load_package() {
  return _package = _interopRequireDefault(require('../package.json'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UpdateCacher = new (_xdl || _load_xdl()).FsCache.Cacher((0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)( /*#__PURE__*/(_regenerator || _load_regenerator()).default.mark(function _callee() {
  var result;
  return (_regenerator || _load_regenerator()).default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, (_spawnAsync || _load_spawnAsync()).default)('npm', ['view', (_package || _load_package()).default.name, 'version']);

        case 2:
          result = _context.sent;
          return _context.abrupt('return', { latestVersion: result.stdout.trim() });

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
})), (_package || _load_package()).default.name + '-updates.json', 24 * 60 * 60 * 1000 // one day
);

exports.default = {
  checkForUpdateAsync: checkForUpdateAsync
};
module.exports = exports['default'];
//# sourceMappingURL=__sourcemaps__/update.js.map
