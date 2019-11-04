'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorType = exports.EngineEvents = exports.EngineState = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Emitter = require('./Emitter');

var _Emitter2 = _interopRequireDefault(_Emitter);

var _Heap = require('./Heap');

var _Heap2 = _interopRequireDefault(_Heap);

var _Queue = require('./Queue');

var _Queue2 = _interopRequireDefault(_Queue);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Sound = require('./Sound');

var _Sound2 = _interopRequireDefault(_Sound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Enum that represents the different type of errors thrown by Engine and Buzzes.
 * @enum {string}
 */
var ErrorType = {
  NoAudio: 'no-audio',
  LoadError: 'load',
  PlayError: 'play',
  EngineError: 'engine'
};

/**
 * Represents the different states of the audio engine.
 * @enum {string}
 */
var EngineState = {
  NotReady: 'notready',
  Ready: 'ready',
  Suspending: 'suspending',
  Suspended: 'suspended',
  Resuming: 'resuming',
  Destroying: 'destroying',
  Done: 'done',
  NoAudio: 'no-audio'
};

/**
 * Enum that represents the different events by engine.
 * @enum {string}
 */
var EngineEvents = {
  Add: 'add',
  Remove: 'remove',
  Volume: 'volume',
  Mute: 'mute',
  Pause: 'pause',
  Stop: 'stop',
  Suspend: 'suspend',
  Resume: 'resume',
  Error: 'error',
  Done: 'done'
};

/**
 * Array of event names.
 * @type {string[]}
 */
var userInputEventNames = ['click', 'contextmenu', 'auxclick', 'dblclick', 'mousedown', 'mouseup', 'pointerup', 'touchend', 'keydown', 'keyup'];

/**
 * The audio engine that orchestrates all the sounds.
 * @class
 */

var Engine = function () {

  /**
   * Instantiates the heap and action queue.
   * @constructor
   */


  /**
   * The sound heap.
   * @type {Heap}
   * @private
   */


  /**
   * The master gain node.
   * @type {GainNode}
   * @private
   */


  /**
   * Represents the current state of the engine.
   * @type {EngineState}
   * @private
   */


  /**
   * The clean-up interval id.
   * @type {number|null}
   * @private
   */


  /**
   * The heap clean-up period.
   * @type {number}
   * @private
   */


  /**
   * Represents whether the audio engine is currently muted or not.
   * @type {boolean}
   * @private
   */
  function Engine() {
    _classCallCheck(this, Engine);

    this._id = _Utility2.default.id();
    this._muted = false;
    this._volume = 1.0;
    this._cleanUpInterval = 5;
    this._autoEnable = true;
    this._intervalId = null;
    this._isAudioAvailable = false;
    this._state = EngineState.NotReady;
    this._context = null;
    this._gainNode = null;
    this._queue = null;
    this._heap = null;
    this._loader = null;

    this._heap = new _Heap2.default();
    this._queue = new _Queue2.default();
    this._resumeAndRemoveListeners = this._resumeAndRemoveListeners.bind(this);
  }

  /**
   * Instantiate the audio context and other dependencies.
   * @param {object} [args] Input parameters object.
   * @param {number} [args.volume = 1.0] The global volume of the sound engine.
   * @param {boolean} [args.muted = false] Stay muted initially or not.
   * @param {number} [args.cleanUpInterval = 5] The heap clean-up interval period in minutes.
   * @param {boolean} [args.autoEnable = true] Auto-enables audio in first user interaction.
   * @param {function} [args.onadd] Event-handler for the "add" event.
   * @param {function} [args.onremove] Event-handler for the "remove" event.
   * @param {function} [args.onstop] Event-handler for the "stop" event.
   * @param {function} [args.onpause] Event-handler for the "pause" event.
   * @param {function} [args.onmute] Event-handler for the "mute" event.
   * @param {function} [args.onvolume] Event-handler for the "volume" event.
   * @param {function} [args.onsuspend] Event-handler for the "suspend" event.
   * @param {function} [args.onresume] Event-handler for the "resume" event.
   * @param {function} [args.onerror] Event-handler for the "error" event.
   * @param {function} [args.ondone] Event-handler for the "done" event.
   * @return {Engine}
   */


  /**
   * Loader - the component that loads audio buffers with audio data.
   * @type {Loader}
   * @private
   */


  /**
   * The action queue.
   * @type {Queue}
   * @private
   */


  /**
   * The Web Audio API's audio context.
   * @type {AudioContext}
   * @private
   */


  /**
   * True if Web Audio API is available.
   * @type {boolean}
   * @private
   */


  /**
   * Auto-enables audio in first user interaction.
   * @type {boolean}
   * @private
   */


  /**
   * Represents the global volume.
   * @type {number}
   * @private
   */


  /**
   * Unique id of the engine.
   * @type {number}
   * @private
   */


  _createClass(Engine, [{
    key: 'setup',
    value: function setup(args) {
      var _this = this;

      // If the setup is already done return.
      if (this._state !== EngineState.NotReady) {
        return this;
      }

      this._context = _Utility2.default.getContext();

      // Determine the audio stuff available in the current platform and set the flags accordingly.
      this._isAudioAvailable = Boolean(this._context);

      // If no Web Audio and HTML5 audio is available fire an error event.
      if (!this._isAudioAvailable) {
        this._state = EngineState.NoAudio;
        this._fire(EngineEvents.Error, { type: ErrorType.NoAudio, error: 'Web Audio API is not available' });
        return this;
      }

      // Read the input parameters from the options.

      var _ref = args || {},
          volume = _ref.volume,
          muted = _ref.muted,
          cleanUpInterval = _ref.cleanUpInterval,
          autoEnable = _ref.autoEnable,
          onadd = _ref.onadd,
          onremove = _ref.onremove,
          onstop = _ref.onstop,
          onpause = _ref.onpause,
          onmute = _ref.onmute,
          onvolume = _ref.onvolume,
          onsuspend = _ref.onsuspend,
          onresume = _ref.onresume,
          onerror = _ref.onerror,
          ondone = _ref.ondone;

      // Set the properties from the read parameters.


      typeof volume === 'number' && volume >= 0 && volume <= 1.0 && (this._volume = volume);
      typeof muted === 'boolean' && (this._muted = muted);
      typeof cleanUpInterval === 'number' && (this._cleanUpInterval = cleanUpInterval);
      typeof autoEnable === 'boolean' && (this._autoEnable = autoEnable);
      typeof onadd === 'function' && this.on(EngineEvents.Add, onadd);
      typeof onremove === 'function' && this.on(EngineEvents.Remove, onremove);
      typeof onstop === 'function' && this.on(EngineEvents.Stop, onstop);
      typeof onpause === 'function' && this.on(EngineEvents.Pause, onpause);
      typeof onmute === 'function' && this.on(EngineEvents.Mute, onmute);
      typeof onvolume === 'function' && this.on(EngineEvents.Volume, onvolume);
      typeof onsuspend === 'function' && this.on(EngineEvents.Suspend, onsuspend);
      typeof onresume === 'function' && this.on(EngineEvents.Resume, onresume);
      typeof onerror === 'function' && this.on(EngineEvents.Error, onerror);
      typeof ondone === 'function' && this.on(EngineEvents.Done, ondone);

      // Create the buffer loader.
      this._loader = new _Loader2.default(this._context);

      // Auto-enable audio in first user interaction.
      // https://developers.google.com/web/updates/2018/11/web-audio-autoplay#moving-forward
      if (this._autoEnable && this._context.state === 'suspended') {
        userInputEventNames.forEach(function (eventName) {
          return document.addEventListener(eventName, _this._resumeAndRemoveListeners);
        });
      }

      // Create the audio graph.
      this._gainNode = this._context.createGain();
      this._gainNode.gain.setValueAtTime(this._muted ? 0 : this._volume, this._context.currentTime);
      this._gainNode.connect(this._context.destination);

      this._intervalId = window.setInterval(this._heap.free, this._cleanUpInterval * 60 * 1000);

      this._state = this._context.state !== 'suspended' ? EngineState.Ready : EngineState.Suspended;

      return this;
    }

    /**
     * Loads single or multiple audio resources into audio buffers and returns them.
     * @param {string|string[]} urls Single or array of audio urls.
     * @return {Promise}
     */

  }, {
    key: 'load',
    value: function load(urls) {
      return this._loader.load(urls);
    }

    /**
     * Unloads single or multiple loaded audio buffers from cache.
     * @param {string|string[]} [urls] Single or array of audio urls.
     * @return {Engine}
     */

  }, {
    key: 'unload',
    value: function unload(urls) {
      this._loader.unload(urls);
      return this;
    }

    /**
     * Mutes the engine.
     * @return {Engine}
     */

  }, {
    key: 'mute',
    value: function mute() {
      // If the engine is already muted return.
      if (this._muted) {
        return this;
      }

      // Set the value of gain node to 0.
      this._gainNode.gain.setValueAtTime(0, this._context.currentTime);

      // Set the muted property true.
      this._muted = true;

      // Fire the "mute" event.
      this._fire(EngineEvents.Mute, this._muted);

      return this;
    }

    /**
     * Un-mutes the engine.
     * @return {Engine}
     */

  }, {
    key: 'unmute',
    value: function unmute() {
      // If the engine is not muted return.
      if (!this._muted) {
        return this;
      }

      // Reset the gain node's value back to volume.
      this._gainNode.gain.setValueAtTime(this._volume, this._context.currentTime);

      // Set the muted property to false.
      this._muted = false;

      // Fire the "mute" event.
      this._fire(EngineEvents.Mute, this._muted);

      return this;
    }

    /**
     * Gets/sets the volume for the audio engine that controls global volume for all sounds.
     * @param {number} [vol] Should be within 0.0 to 1.0.
     * @return {Engine|number}
     */

  }, {
    key: 'volume',
    value: function volume(vol) {
      // If no parameter is passed then return the current volume.
      if (vol === undefined) {
        return this._volume;
      }

      // If passed volume is not an acceptable value return.
      if (typeof vol !== 'number' || vol < 0 || vol > 1.0) {
        return this;
      }

      // Set the gain's value to the passed volume.
      this._gainNode.gain.setValueAtTime(this._muted ? 0 : vol, this._context.currentTime);

      // Set the volume to the property.
      this._volume = vol;

      // Fire the "volume" event.
      this._fire(EngineEvents.Volume, this._volume);

      return this;
    }

    /**
     * Stops all the currently playing sounds.
     * @return {Engine}
     */

  }, {
    key: 'stop',
    value: function stop() {
      // Stop all the sounds.
      this._heap.sounds().forEach(function (sound) {
        return sound.stop();
      });

      // Fire the "stop" event.
      this._fire(EngineEvents.Stop);

      return this;
    }

    /**
     * Stops all the playing sounds and suspends the audio context immediately.
     * @return {Engine}
     */

  }, {
    key: 'suspend',
    value: function suspend() {
      var _this2 = this;

      // If the context is resuming then suspend after resumed.
      if (this._state === EngineState.Resuming) {
        this._queue.add('after-resume', 'suspend', function () {
          return _this2.suspend();
        });
        return this;
      }

      // If the state is not ready return.
      if (this._state !== EngineState.Ready) {
        return this;
      }

      // Stop all the playing sounds.
      this.stop();

      // Set the state to suspending.
      this._state = EngineState.Suspending;

      // Suspend the Audio Context.
      this._context.suspend().then(function () {
        _this2._state = EngineState.Suspended;
        _this2._queue.run('after-suspend');
        _this2._fire(EngineEvents.Suspend);
      });

      return this;
    }

    /**
     * Resumes the audio context from the suspended mode.
     * @return {Engine}
     */

  }, {
    key: 'resume',
    value: function resume() {
      var _this3 = this;

      // If the context is suspending then resume after suspended.
      if (this._state === EngineState.Suspending) {
        this._queue.add('after-suspend', 'resume', function () {
          return _this3.resume();
        });
        return this;
      }

      if (this._state !== EngineState.Suspended) {
        return this;
      }

      this._state = EngineState.Resuming;

      this._context.resume().then(function () {
        _this3._state = EngineState.Ready;
        _this3._queue.run('after-resume');
        _this3._fire(EngineEvents.Resume);
      });

      return this;
    }

    /**
     * Shuts down the engine.
     * @return {Engine}
     */

  }, {
    key: 'terminate',
    value: function terminate() {
      var _this4 = this;

      if (this._state === EngineState.Done || this._state === EngineState.Destroying) {
        return this;
      }

      var cleanUp = function cleanUp() {
        // Un-listen from user input events.
        userInputEventNames.forEach(function (eventName) {
          return document.addEventListener(eventName, _this4._resumeAndRemoveListeners);
        });

        // Stop the timer.
        _this4._intervalId && window.clearInterval(_this4._intervalId);
        _this4._intervalId = null;

        // Destroy the heap.
        _this4._heap.destroy();
        _this4._heap = null;

        // Clear the cache and remove the loader.
        if (_this4._loader) {
          _this4._loader.dispose();
          _this4._loader = null;
        }

        _this4._context = null;
        _this4._queue.clear();
        _this4._queue = null;
        _this4._state = EngineState.Done;

        // Fire the "done" event.
        _this4._fire(EngineEvents.Done);

        _Emitter2.default.clear(_this4._id);
      };

      // Close the context.
      if (this._context) {
        if (this._state === EngineState.Suspending) {
          this._queue.remove('after-suspend');
          this._queue.add('after-suspend', 'destroy', function () {
            return _this4.terminate();
          });
          return this;
        } else if (this._state === EngineState.Resuming) {
          this._queue.remove('after-resume');
          this._queue.add('after-resume', 'destroy', function () {
            return _this4.terminate();
          });
          return this;
        }

        this._state = EngineState.Destroying;
        this._context && this._context.close().then(function () {
          return cleanUp();
        });
      } else {
        this._state = EngineState.Destroying;
        cleanUp();
      }

      return this;
    }

    /**
     * Subscribes to an event.
     * @param {string} eventName Name of the event.
     * @param {function} handler The event-handler function.
     * @param {boolean} [once = false] Is it one-time subscription or not.
     * @return {Engine}
     */

  }, {
    key: 'on',
    value: function on(eventName, handler) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      _Emitter2.default.on(this._id, eventName, handler, once);
      return this;
    }

    /**
     * Un-subscribes from an event.
     * @param {string} eventName The event name.
     * @param {function} [handler] The handler function.
     * @return {Engine}
     */

  }, {
    key: 'off',
    value: function off(eventName, handler) {
      _Emitter2.default.off(this._id, eventName, handler);
      return this;
    }

    /**
     * Returns the existing sound in heap or create a new one and return.
     * @param {number|string} idOrUrl The sound id or audio url/base64 string.
     * @param {number} [groupId] The group id.
     * @param {object} [args] The sound creation arguments.
     * @return {Sound}
     */

  }, {
    key: 'sound',
    value: function sound(idOrUrl, groupId, args) {
      if (typeof idOrUrl === 'number') {
        return this._heap.sound(idOrUrl);
      }

      var sound = new _Sound2.default(args);
      this._heap.add(idOrUrl, groupId, sound);
      sound._gain().connect(this._gainNode);

      return sound;
    }

    /**
     * Returns the sounds belongs to a group or all the sounds from the heap.
     * @param {number} [groupId] The group id.
     * @return {Array<Sound>}
     */

  }, {
    key: 'sounds',
    value: function sounds(groupId) {
      return this._heap.sounds(groupId);
    }

    /**
     * Destroys the sounds belong to the passed group.
     * @param {boolean} idle True to destroy only the idle sounds.
     * @param {number} groupId The group id.
     * @return {Engine}
     */

  }, {
    key: 'free',
    value: function free(idle, groupId) {
      this._heap.free(idle, groupId);
      return this;
    }

    /**
     * Returns whether the engine is currently muted or not.
     * @return {boolean}
     */

  }, {
    key: 'muted',
    value: function muted() {
      return this._muted;
    }

    /**
     * Returns the state of the engine.
     * @return {EngineState}
     */

  }, {
    key: 'state',
    value: function state() {
      return this._state;
    }

    /**
     * Returns the created audio context.
     * @return {AudioContext}
     */

  }, {
    key: 'context',
    value: function context() {
      return this._context;
    }

    /**
     * Returns true if Web Audio API is available.
     * @return {boolean}
     */

  }, {
    key: 'isAudioAvailable',
    value: function isAudioAvailable() {
      return this._isAudioAvailable;
    }

    /**
     * Fires an event of engine.
     * @param {string} eventName The event name.
     * @param {...*} args The arguments that to be passed to handler.
     * @return {Engine}
     * @private
     */

  }, {
    key: '_fire',
    value: function _fire(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _Emitter2.default.fire.apply(_Emitter2.default, [this._id, eventName].concat(args, [this]));
      return this;
    }

    /**
     * Resume the context and un-listen from user input events.
     * @private
     */

  }, {
    key: '_resumeAndRemoveListeners',
    value: function _resumeAndRemoveListeners() {
      var _this5 = this;

      this.resume();
      userInputEventNames.forEach(function (eventName) {
        return document.addEventListener(eventName, _this5._resumeAndRemoveListeners);
      });
    }
  }]);

  return Engine;
}();

var engine = new Engine();
exports.default = engine;
exports.EngineState = EngineState;
exports.EngineEvents = EngineEvents;
exports.ErrorType = ErrorType;