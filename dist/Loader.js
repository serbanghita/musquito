'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DownloadStatus = exports.DownloadResult = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Enum to represent the download status of audio resource.
 * @enum {string}
 */
var DownloadStatus = {
  Success: 'success',
  Failure: 'error'
};

/**
 * Represents the download result of an audio.
 * @class
 */

var DownloadResult =

/**
 * @param {string|null} url The url of the audio resource
 * @param {AudioBuffer|Audio} [value] AudioBuffer or Html5Audio element
 * @param {*} [error] Download error
 */


/**
 * Download error
 * @type {any}
 */


/**
 * The url of the audio resource
 * @type {string|null}
 */
function DownloadResult(url, value, error) {
  _classCallCheck(this, DownloadResult);

  this.url = null;
  this.value = null;
  this.error = null;
  this.status = null;

  this.url = url;
  this.value = value;
  this.error = error || null;
  this.status = error ? DownloadStatus.Failure : DownloadStatus.Success;
}

/**
 * Success or failure status of download.
 * @type {DownloadStatus}
 */


/**
 * AudioBuffer or Html5Audio element
 * @type {AudioBuffer|Audio}
 */
;

/**
 * Loads the audio sources into audio buffers and returns them.
 * The loaded buffers are cached.
 * @class
 */


var Loader = function () {

  /**
   * Create the cache.
   * @param {AudioContext} context The Audio Context
   */


  /**
   * Dictionary to store the current progress calls and their callbacks.
   * @type {object}
   * @private
   */


  /**
   * AudioContext.
   * @type {AudioContext}
   * @private
   */
  function Loader(context) {
    _classCallCheck(this, Loader);

    this._context = null;
    this._bufferCache = {};
    this._progressCallsAndCallbacks = {};
    this._disposed = false;

    this._context = context;
  }

  /**
   * Loads single or multiple audio resources into audio buffers.
   * @param {string|string[]} urls Single or array of audio urls
   * @return {Promise<DownloadResult|Array<DownloadResult>>}
   */


  /**
   * True if the loader is disposed.
   * @type {boolean}
   * @private
   */


  /**
   * In-memory audio buffer cache store.
   * @type {object}
   * @private
   */


  _createClass(Loader, [{
    key: 'load',
    value: function load(urls) {
      var _this = this;

      if (typeof urls === 'string') {
        return this._load(urls);
      }

      return Promise.all(urls.map(function (url) {
        return _this._load(url);
      }));
    }

    /**
     * Removes the cached audio buffers.
     * @param {string|string[]} [urls] Single or array of audio urls
     */

  }, {
    key: 'unload',
    value: function unload(urls) {
      var _this2 = this;

      if (typeof urls === 'string') {
        this._unload(urls);
        return;
      }

      if (Array.isArray(urls)) {
        urls.forEach(function (url) {
          return _this2._unload(url);
        }, this);
        return;
      }

      this._bufferCache = {};
    }

    /**
     * Dispose the loader.
     */

  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._disposed) {
        return;
      }

      this.unload();
      this._bufferCache = {};
      this._progressCallsAndCallbacks = null;
      this._context = null;
      this._disposed = true;
    }

    /**
     * Loads a single audio resource into audio buffer and cache result if the download is succeeded.
     * @param {string} url The Audio url
     * @return {Promise<DownloadResult>}
     * @private
     */

  }, {
    key: '_load',
    value: function _load(url) {
      var _this3 = this;

      return new Promise(function (resolve) {
        if (_this3._bufferCache.hasOwnProperty(url)) {
          resolve(new DownloadResult(url, _this3._bufferCache[url]));
          return;
        }

        if (_this3._progressCallsAndCallbacks.hasOwnProperty(url)) {
          _this3._progressCallsAndCallbacks[url].push(resolve);
          return;
        }

        _this3._progressCallsAndCallbacks[url] = [];
        _this3._progressCallsAndCallbacks[url].push(resolve);

        var reject = function reject(err) {
          if (_this3._disposed) {
            return;
          }

          _this3._progressCallsAndCallbacks[url].forEach(function (r) {
            return r(new DownloadResult(url, null, err));
          });
          delete _this3._progressCallsAndCallbacks[url];
        };

        var decodeAudioData = function decodeAudioData(arrayBuffer) {
          if (_this3._disposed) {
            return;
          }

          _this3._context.decodeAudioData(arrayBuffer, function (buffer) {
            _this3._bufferCache[url] = buffer;
            _this3._progressCallsAndCallbacks[url].forEach(function (r) {
              return r(new DownloadResult(url, buffer));
            });
            delete _this3._progressCallsAndCallbacks[url];
          }, reject);
        };

        if (_Utility2.default.isBase64(url)) {
          var data = atob(url.split(',')[1]);
          var dataView = new Uint8Array(data.length); // eslint-disable-line no-undef

          for (var i = 0; i < data.length; ++i) {
            dataView[i] = data.charCodeAt(i);
          }

          decodeAudioData(dataView);
          return;
        }

        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';

        req.addEventListener('load', function () {
          return decodeAudioData(req.response);
        }, false);
        req.addEventListener('error', reject, false);
        req.send();
      });
    }

    /**
     * Removes the single cached audio buffer.
     * @param {string} url Audio url
     * @private
     */

  }, {
    key: '_unload',
    value: function _unload(url) {
      delete this._bufferCache[url];
    }
  }]);

  return Loader;
}();

exports.default = Loader;
exports.DownloadResult = DownloadResult;
exports.DownloadStatus = DownloadStatus;