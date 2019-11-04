'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Engine = require('./Engine');

var _Engine2 = _interopRequireDefault(_Engine);

var _Queue = require('./Queue');

var _Queue2 = _interopRequireDefault(_Queue);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Emitter = require('./Emitter');

var _Emitter2 = _interopRequireDefault(_Emitter);

var _Loader = require('./Loader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Enum that represents the different states of a sound group (buzz).
 * @enum {string}
 */
var BuzzState = {
  Ready: 'ready',
  Destroyed: 'destroyed'
};

/**
 * Enum that represents the different events fired by a buzz.
 * @enum {string}
 */
var BuzzEvents = {
  Load: 'load',
  UnLoad: 'unload',
  PlayStart: 'playstart',
  PlayEnd: 'playend',
  Pause: 'pause',
  Stop: 'stop',
  Volume: 'volume',
  Mute: 'mute',
  Seek: 'seek',
  Rate: 'rate',
  FadeStart: 'fadestart',
  FadeEnd: 'fadeend',
  FadeStop: 'fadestop',
  Error: 'error',
  Destroy: 'destroy'
};

/**
 * Enum that represents the different states occurs while loading a sound.
 * @enum {string}
 */
var LoadState = {
  NotLoaded: 'notloaded',
  Loading: 'loading',
  Loaded: 'loaded'
};

/**
 * A wrapper class that simplifies dealing with group of sounds.
 */

var Buzz = function () {

  /**
   * Initializes the internal properties.
   * @param {string|Array<string>|object} args The input parameters of this sound group.
   * @param {string} [args.id] The unique id of the sound.
   * @param {string|string[]} args.src Single or array of audio urls/base64 strings.
   * @param {number} [args.volume = 1.0] The initial volume of the sound. Should be from 0.0 to 1.0.
   * @param {number} [args.rate = 1] The initial playback rate of the sound. Should be from 0.5 to 5.0.
   * @param {boolean} [args.loop = false] True to play the sound repeatedly.
   * @param {boolean} [args.muted = false] True to be muted initially.
   * @param {boolean} [args.preload = false] True to pre-load the sound after construction.
   * @param {boolean} [args.autoplay = false] True to play automatically after construction.
   * @param {string|string[]} [args.format] The file format(s) of the passed audio source(s).
   * @param {object} [args.sprite] The sprite definition.
   * @param {function} [args.onload] Event-handler for the "load" event.
   * @param {function} [args.onunload] Event-handler for the "unload" event.
   * @param {function} [args.onplaystart] Event-handler for the "playstart" event.
   * @param {function} [args.onplayend] Event-handler for the "playend" event.
   * @param {function} [args.onstop] Event-handler for the "stop" event.
   * @param {function} [args.onpause] Event-handler for the "pause" event.
   * @param {function} [args.onmute] Event-handler for the "mute" event.
   * @param {function} [args.onvolume] Event-handler for the "volume" event.
   * @param {function} [args.onrate] Event-handler for the "rate" event.
   * @param {function} [args.onseek] Event-handler for the "seek" event.
   * @param {function} [args.onerror] Event-handler for the "error" event.
   * @param {function} [args.ondestroy] Event-handler for the "destroy" event.
   * @constructor
   */


  /**
   * True if the group is currently fading.
   * @type {boolean}
   * @private
   */


  /**
   * The action queue.
   * @type {Queue}
   * @private
   */


  /**
   * Represents the different states that occurs while loading the sound.
   * @type {LoadState}
   * @private
   */


  /**
   * Duration of the playback in seconds.
   * @type {number}
   * @private
   */


  /**
   * True to auto-play the sound on construction.
   * @type {boolean}
   * @private
   */


  /**
   * True if the sound should play repeatedly.
   * @type {boolean}
   * @private
   */


  /**
   * The current rate of the playback. Should be from 0.5 to 5.
   * @type {number}
   * @private
   */


  /**
   * The sprite definition.
   * @type {object}
   * @private
   */


  /**
   * Represents the source of the sound. The source can be an url or base64 string.
   * @type {*}
   * @private
   */
  function Buzz(args) {
    _classCallCheck(this, Buzz);

    this._id = -1;
    this._src = null;
    this._format = [];
    this._sprite = null;
    this._volume = 1.0;
    this._rate = 1;
    this._muted = false;
    this._loop = false;
    this._preload = false;
    this._autoplay = false;
    this._buffer = null;
    this._duration = 0;
    this._compatibleSrc = null;
    this._loadState = LoadState.NotLoaded;
    this._state = BuzzState.Ready;
    this._queue = null;
    this._engine = null;
    this._fading = false;
    this._fadeTimer = null;

    // Setup the audio engine.
    this._engine = _Engine2.default;
    this._engine.setup();
    this._engine.on(_Engine.EngineEvents.Resume, this._onEngineResume = this._onEngineResume.bind(this));

    // If no audio is available throw error.
    if (!this._engine.isAudioAvailable()) {
      this._fire(BuzzEvents.Error, null, { type: _Engine.ErrorType.NoAudio, error: 'Web Audio is un-available' });
      return this;
    }

    if (typeof args === 'string') {
      this._src = [args];
    } else if (Array.isArray(args) && args.length) {
      this._src = args;
    } else if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object') {
      var id = args.id,
          src = args.src,
          format = args.format,
          sprite = args.sprite,
          volume = args.volume,
          rate = args.rate,
          muted = args.muted,
          loop = args.loop,
          autoplay = args.autoplay,
          preload = args.preload,
          onload = args.onload,
          onunload = args.onunload,
          onplaystart = args.onplaystart,
          onplayend = args.onplayend,
          onstop = args.onstop,
          onpause = args.onpause,
          onmute = args.onmute,
          onvolume = args.onvolume,
          onrate = args.onrate,
          onseek = args.onseek,
          onerror = args.onerror,
          ondestroy = args.ondestroy;

      // Set the passed id or the random one.

      this._id = typeof id === 'number' ? id : _Utility2.default.id();

      // Set the source.
      if (typeof src === 'string') {
        this._src = [src];
      } else if (Array.isArray(src) && src.length) {
        this._src = src;
      }

      // Set the format.
      if (Array.isArray(format)) {
        this._format = format;
      } else if (typeof format === 'string' && format) {
        this._format = [format];
      }

      // Set other properties.
      (typeof sprite === 'undefined' ? 'undefined' : _typeof(sprite)) === 'object' && (this._sprite = sprite);
      typeof volume === 'number' && volume >= 0 && volume <= 1.0 && (this._volume = volume);
      typeof rate === 'number' && rate >= 0.5 && rate <= 5 && (this._rate = rate);
      typeof muted === 'boolean' && (this._muted = muted);
      typeof loop === 'boolean' && (this._loop = loop);
      typeof autoplay === 'boolean' && (this._autoplay = autoplay);
      typeof preload === 'boolean' && (this._preload = preload);
      typeof onload === 'function' && this.on(BuzzEvents.Load, onload);
      typeof onunload === 'function' && this.on(BuzzEvents.UnLoad, onunload);

      // Bind the passed event handlers to events.
      typeof onplaystart === 'function' && this.on(BuzzEvents.PlayStart, onplaystart);
      typeof onplayend === 'function' && this.on(BuzzEvents.PlayEnd, onplayend);
      typeof onstop === 'function' && this.on(BuzzEvents.Stop, onstop);
      typeof onpause === 'function' && this.on(BuzzEvents.Pause, onpause);
      typeof onmute === 'function' && this.on(BuzzEvents.Mute, onmute);
      typeof onvolume === 'function' && this.on(BuzzEvents.Volume, onvolume);
      typeof onrate === 'function' && this.on(BuzzEvents.Rate, onrate);
      typeof onseek === 'function' && this.on(BuzzEvents.Seek, onseek);
      typeof onerror === 'function' && this.on(BuzzEvents.Error, onerror);
      typeof ondestroy === 'function' && this.on(BuzzEvents.Destroy, ondestroy);
    }

    // Throw error if source is not passed.
    if (!this._src) {
      throw new Error('You should pass the source for the audio.');
    }

    // Instantiate the dependencies.
    this._queue = new _Queue2.default();

    if (this._autoplay) {
      this.play();
    } else if (this._preload) {
      this.load();
    }
  }

  /**
   * Loads the sound to the underlying audio object.
   * @return {Buzz}
   */


  /**
   * The timer that runs function after the fading is complete.
   * @type {number|null}
   * @private
   */


  /**
   * The audio engine.
   * @type {Engine}
   * @private
   */


  /**
   * Represents the state of this group.
   * @type {BuzzState}
   * @private
   */


  /**
   * The best compatible source in the audio sources passed.
   * @type {string|null}
   * @private
   */


  /**
   * The audio buffer.
   * @type {AudioBuffer}
   * @private
   */


  /**
   * True to pre-loaded the sound on construction.
   * @type {boolean}
   * @private
   */


  /**
   * True if the sound is currently muted.
   * @type {boolean}
   * @private
   */


  /**
   * The current volume of the sound. Should be from 0.0 to 1.0.
   * @type {number}
   * @private
   */


  /**
   * The formats of the passed audio sources.
   * @type {Array<string>}
   * @private
   */


  /**
   * Unique id.
   * @type {number}
   * @private
   */


  _createClass(Buzz, [{
    key: 'load',
    value: function load() {
      var _this = this;

      // If the sound is already loaded return without reloading again.
      if (this.isLoaded() || this._loadState === LoadState.Loading) {
        return this;
      }

      // Set the state to "Loading" to avoid loading multiple times.
      this._loadState = LoadState.Loading;

      // Get the compatible source.
      var src = this._compatibleSrc || (this._compatibleSrc = this.getCompatibleSource());

      // If no compatible source found call failure method and return.
      if (!src) {
        this._onLoadFailure('The audio formats you passed are not supported');
        return this;
      }

      // Load the audio source.
      this._engine.load(src).then(function (downloadResult) {
        // During the time of loading... if the buzz is unloaded or destroyed then return.
        if (_this._loadState === LoadState.NotLoaded || _this._state === BuzzState.Destroyed) {
          return;
        }

        // If loading succeeded,
        // i. Save the result.
        // ii. Set the load state as loaded.
        // iii. Fire the load event.
        // iv. Run the methods that are queued to run after successful load.
        if (downloadResult.status === _Loader.DownloadStatus.Success) {
          _this._buffer = downloadResult.value;
          _this._duration = _this._buffer.duration;
          _this._loadState = LoadState.Loaded;
          _this._fire(BuzzEvents.Load, null, downloadResult);
          _this._queue.run('after-load');
          return;
        }

        _this._onLoadFailure(downloadResult.error);
      });

      return this;
    }

    /**
     * Called on failure of loading audio source.
     * @param {*} error The audio source load error.
     * @private
     */

  }, {
    key: '_onLoadFailure',
    value: function _onLoadFailure(error) {
      // Remove the queued actions from this class that are supposed to run after load.
      this._queue.remove('after-load');

      // Set the load state back to not loaded.
      this._loadState = LoadState.NotLoaded;

      // Fire the error event.
      this._fire(BuzzEvents.Error, null, { type: _Engine.ErrorType.LoadError, error: error });
    }

    /**
     * Returns the first compatible source based on the passed sources and the format.
     * @return {string}
     */

  }, {
    key: 'getCompatibleSource',
    value: function getCompatibleSource() {
      // If the user has passed "format", check if it is supported or else retrieve the first supported source from the array.
      return this._format.length ? this._src[this._format.indexOf(_Utility2.default.getSupportedFormat(this._format))] : _Utility2.default.getSupportedSource(this._src);
    }

    /**
     * Plays the passed sound defined in the sprite or the sound that belongs to the passed id.
     * @param {string|number} [soundOrId] The sound name defined in sprite or the sound id.
     * @return {Buzz|number}
     */

  }, {
    key: 'play',
    value: function play(soundOrId) {
      var _this2 = this;

      var isIdPassed = typeof soundOrId === 'number';

      // If id is passed then get the sound from the engine and play it.
      if (isIdPassed) {
        var sound = this._engine.sound(soundOrId);
        sound && this._play(sound);
        return this;
      }

      var newSoundId = _Utility2.default.id(),
          playSound = function playSound() {
        var soundArgs = {
          id: newSoundId,
          buffer: _this2._buffer,
          volume: _this2._volume,
          rate: _this2._rate,
          muted: _this2._muted,
          loop: _this2._loop,
          playEndCallback: function playEndCallback(sound) {
            return _this2._fire(BuzzEvents.PlayEnd, sound.id());
          },
          destroyCallback: function destroyCallback(sound) {
            _this2._fire(BuzzEvents.Destroy, sound.id());
            _Emitter2.default.clear(sound.id());
          },
          fadeEndCallback: function fadeEndCallback(sound) {
            return _this2._fire(BuzzEvents.FadeEnd, sound.id());
          }
        };

        if (typeof soundOrId === 'string' && _this2._sprite && _this2._sprite.hasOwnProperty(soundOrId)) {
          var positions = _this2._sprite[soundOrId];
          soundArgs.startPos = positions[0];
          soundArgs.endPos = positions[1];
        }

        var newSound = _this2._engine.sound(_this2._compatibleSrc, _this2._id, soundArgs);
        _this2._play(newSound);
      };

      // If the sound is not yet loaded push an action to the queue to play the sound once it's loaded.
      if (!this.isLoaded()) {
        this._queue.add('after-load', 'play-' + newSoundId, function () {
          return playSound();
        });
        this.load();
      } else {
        playSound();
      }

      return newSoundId;
    }

    /**
     * Pauses the sound belongs to the passed id or all the sounds belongs to this group.
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'pause',
    value: function pause(id) {
      this._removePlayActions(id);
      typeof id !== 'number' && this.fadeStop();
      this._sounds(id).forEach(function (sound) {
        return sound.pause();
      });
      this._fire(BuzzEvents.Pause, id);

      return this;
    }

    /**
     * Stops the sound belongs to the passed id or all the sounds belongs to this group.
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'stop',
    value: function stop(id) {
      this._removePlayActions(id);
      typeof id !== 'number' && this.fadeStop();
      this._sounds(id).forEach(function (sound) {
        return sound.stop();
      });
      this._fire(BuzzEvents.Stop, id);

      return this;
    }

    /**
     * Mutes the sound belongs to the passed id or all the sounds belongs to this group.
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'mute',
    value: function mute(id) {
      var isGroup = typeof id !== 'number';
      isGroup && this.fadeStop();
      this._sounds(id).forEach(function (sound) {
        return sound.mute();
      });
      isGroup && (this._muted = true);

      this._fire(BuzzEvents.Mute, id, this._muted);

      return this;
    }

    /**
     * Un-mutes the sound belongs to the passed id or all the sounds belongs to this group.
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'unmute',
    value: function unmute(id) {
      var isGroup = typeof id !== 'number';
      isGroup && this.fadeStop();
      this._sounds(id).forEach(function (sound) {
        return sound.unmute();
      });
      isGroup && (this._muted = false);

      this._fire(BuzzEvents.Mute, id, this._muted);

      return this;
    }

    /**
     * Gets/sets the volume of the passed sound or the group.
     * @param {number} [volume] Should be from 0.0 to 1.0.
     * @param {number} [id] The sound id.
     * @return {Buzz|number}
     */

  }, {
    key: 'volume',
    value: function volume(_volume, id) {
      var isGroup = typeof id !== 'number';

      if (typeof _volume === 'number' && _volume >= 0 && _volume <= 1.0) {
        isGroup && this.fadeStop();
        this._sounds(id).forEach(function (sound) {
          return sound.volume(_volume);
        });
        typeof id !== 'number' && (this._volume = _volume);
        this._fire(BuzzEvents.Volume, id, this._volume);
        return this;
      }

      if (!isGroup) {
        var sound = this._engine.sound(id);
        return sound ? sound.volume() : null;
      }

      return this._volume;
    }

    /**
     * Fades the group's or passed sound's volume to the passed value in the passed duration.
     * @param {number} to The destination volume.
     * @param {number} duration The period of fade in seconds.
     * @param {string} [type = linear] The fade type (linear or exponential).
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'fade',
    value: function fade(to, duration) {
      var _this3 = this;

      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
      var id = arguments[3];

      var isGroup = typeof id !== 'number';

      if (isGroup && this._fading) {
        return this;
      }

      this._fire(BuzzEvents.FadeStart, id);

      this._sounds(id).forEach(function (sound) {
        return sound.fade(to, duration, type);
      });

      if (isGroup) {
        this._fading = true;

        this._fadeTimer = setTimeout(function () {
          _this3.volume(to);

          clearTimeout(_this3._fadeTimer);

          _this3._fadeTimer = null;
          _this3._fading = false;
          _this3._fire(BuzzEvents.FadeEnd);
        }, duration * 1000);
      }

      return this;
    }

    /**
     * Stops the group's or passed sound's current running fade.
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'fadeStop',
    value: function fadeStop(id) {
      var isGroup = typeof id !== 'number';

      if (isGroup && !this._fading) {
        return this;
      }

      this._sounds(id).forEach(function (sound) {
        return sound.fadeStop();
      });

      if (isGroup) {
        if (this._fadeTimer) {
          clearTimeout(this._fadeTimer);
          this._fadeTimer = null;
        }

        this._fading = false;
      }

      this._fire(BuzzEvents.FadeStop, id);

      return this;
    }

    /**
     * Gets/sets the rate of the passed sound or the group.
     * @param {number} [rate] Should be from 0.5 to 5.0.
     * @param {number} [id] The sound id.
     * @return {Buzz|number}
     */

  }, {
    key: 'rate',
    value: function rate(_rate, id) {
      if (typeof _rate === 'number' && _rate >= 0.5 && _rate <= 5) {
        this._sounds(id).forEach(function (sound) {
          return sound.rate(_rate);
        });
        typeof id !== 'number' && (this._rate = _rate);
        this._fire(BuzzEvents.Rate, id, this._rate);
        return this;
      }

      if (typeof id === 'number') {
        var sound = this._engine.sound(id);
        return sound ? sound.rate() : null;
      }

      return this._rate;
    }

    /**
     * Gets/sets the current playback position of the sound.
     * @param {number} id The sound id
     * @param {number} [seek] The seek position.
     * @return {Buzz|number}
     */

  }, {
    key: 'seek',
    value: function seek(id, _seek) {
      var _this4 = this;

      var sound = this._engine.sound(id);

      if (!sound) {
        return this;
      }

      if (typeof _seek === 'number') {
        // If the audio source is not yet loaded push an item to the queue to seek after the sound is loaded
        // and load the sound.
        if (!this.isLoaded()) {
          this._queue.add('after-load', 'seek-' + id, function () {
            return _this4.seek(id, _seek);
          });
          this.load();
          return this;
        }

        sound.seek(_seek);
        this._fire(BuzzEvents.Seek, id, _seek);
        return this;
      }

      return sound.seek();
    }

    /**
     * Gets/sets the looping behavior of a sound or the group.
     * @param {boolean} [loop] True to loop the sound.
     * @param {number} [id] The sound id.
     * @return {Buzz|boolean}
     */

  }, {
    key: 'loop',
    value: function loop(_loop, id) {
      if (typeof _loop === 'boolean') {
        this._sounds(id).forEach(function (sound) {
          return sound.loop(_loop);
        });
        typeof id !== 'number' && (this._loop = _loop);
        return this;
      }

      if (typeof id === 'number') {
        var sound = this._engine.sound(id);
        return sound ? sound.loop() : null;
      }

      return this._loop;
    }

    /**
     * Returns true if the passed sound is playing.
     * @param {number} id The sound id.
     * @return {boolean}
     */

  }, {
    key: 'playing',
    value: function playing(id) {
      var sound = this._engine.sound(id);
      return sound ? sound.isPlaying() : null;
    }

    /**
     * Returns true if the passed sound is muted or the group is muted.
     * @param {number} [id] The sound id.
     * @return {boolean}
     */

  }, {
    key: 'muted',
    value: function muted(id) {
      if (typeof id === 'number') {
        var sound = this._engine.sound(id);
        return sound ? sound.muted() : null;
      }

      return this._muted;
    }

    /**
     * Returns the state of the passed sound or the group.
     * @return {BuzzState|SoundState}
     */

  }, {
    key: 'state',
    value: function state(id) {
      if (typeof id === 'number') {
        var sound = this._engine.sound(id);
        return sound ? sound.state() : null;
      }

      return this._state;
    }

    /**
     * Returns the duration of the passed sound or the total duration of the sound.
     * @param {number} [id] The sound id.
     * @return {number}
     */

  }, {
    key: 'duration',
    value: function duration(id) {
      if (typeof id === 'number') {
        var sound = this._engine.sound(id);
        return sound ? sound.duration() : null;
      }

      return this._duration;
    }

    /**
     * Unloads the loaded audio buffer.
     * @return {Buzz}
     */

  }, {
    key: 'unload',
    value: function unload() {
      this._queue.remove('after-load');
      this._engine.unload(this._compatibleSrc);
      this._buffer = null;
      this._duration = 0;
      this._loadState = LoadState.NotLoaded;
      return this;
    }

    /**
     * Stops and destroys all the sounds belong to this group and release other dependencies.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this._state === BuzzState.Destroyed) {
        return;
      }

      this.stop();
      this._queue.clear();
      this._engine.off(_Engine.EngineEvents.Resume, this._onEngineResume);
      this._engine.free(false, this._id);

      this._buffer = null;
      this._queue = null;
      this._engine = null;
      this._state = BuzzState.Destroyed;

      this._fire(BuzzEvents.Destroy);

      _Emitter2.default.clear(this._id);
    }

    /**
     * Subscribes to an event for the sound or the group.
     * @param {string} eventName The event name.
     * @param {function} handler The event handler.
     * @param {boolean} [once = false] True for one-time event handling.
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'on',
    value: function on(eventName, handler) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var id = arguments[3];

      _Emitter2.default.on(id || this._id, eventName, handler, once);
      return this;
    }

    /**
     * Un-subscribes from an event for the sound or the group.
     * @param {string} eventName The event name.
     * @param {function} handler The event handler.
     * @param {number} [id] The sound id.
     * @return {Buzz}
     */

  }, {
    key: 'off',
    value: function off(eventName, handler, id) {
      _Emitter2.default.off(id || this._id, eventName, handler);
      return this;
    }

    /**
     * Returns the unique id of the sound.
     * @return {number}
     */

  }, {
    key: 'id',
    value: function id() {
      return this._id;
    }

    /**
     * Returns the audio resource loading status.
     * @return {LoadState}
     */

  }, {
    key: 'loadState',
    value: function loadState() {
      return this._loadState;
    }

    /**
     * Returns true if the audio source is loaded.
     * @return {boolean}
     */

  }, {
    key: 'isLoaded',
    value: function isLoaded() {
      return this._loadState === LoadState.Loaded;
    }

    /**
     * Returns the sound for the passed id.
     * @param {number} id The sound id.
     * @return {Sound}
     */

  }, {
    key: 'sound',
    value: function sound(id) {
      return this._engine.sound(id);
    }

    /**
     * Returns true if the passed sound exists.
     * @param {number} id The sound id.
     * @return {boolean}
     */

  }, {
    key: 'alive',
    value: function alive(id) {
      return Boolean(this.sound(id));
    }

    /**
     * Whenever the engine resume run the actions queued for it.
     * @private
     */

  }, {
    key: '_onEngineResume',
    value: function _onEngineResume() {
      this._queue.run('after-engine-resume');
    }

    /**
     * Checks the engine state and plays the passed sound.
     * @param {Sound} sound The sound.
     * @private
     */

  }, {
    key: '_play',
    value: function _play(sound) {
      var _this5 = this;

      if (this._engine.state() === _Engine.EngineState.Destroying || this._engine.state() === _Engine.EngineState.Done) {
        this._fire(BuzzEvents.Error, null, { type: _Engine.ErrorType.PlayError, error: 'The engine is stopping/stopped' });
        return;
      }

      if (this._engine.state() === _Engine.EngineState.NoAudio) {
        this._fire(BuzzEvents.Error, null, { type: _Engine.ErrorType.NoAudio, error: 'Web Audio is un-available' });
        return;
      }

      var playAndFire = function playAndFire() {
        sound.play();
        _this5._fire(BuzzEvents.PlayStart, sound.id());
      };

      if ([_Engine.EngineState.Suspending, _Engine.EngineState.Suspended, _Engine.EngineState.Resuming].indexOf(this._engine.state()) > -1) {
        this._queue.add('after-engine-resume', 'sound-' + sound.id(), function () {
          return playAndFire();
        });
        this._engine.state() !== _Engine.EngineState.Resuming && this._engine.resume();
        return;
      }

      playAndFire();
    }

    /**
     * Remove the play actions queued from the queue.
     * @param {number} [id] The sound id.
     * @private
     */

  }, {
    key: '_removePlayActions',
    value: function _removePlayActions(id) {
      this._queue.remove('after-load', id ? 'play-' + id : null);
      this._queue.remove('after-engine-resume', id ? 'sound-' + id : null);
    }

    /**
     * Returns the sound for the passed id or all the sounds belong to this group.
     * @param {number} [id] The sound id.
     * @return {Array<Sound>}
     * @private
     */

  }, {
    key: '_sounds',
    value: function _sounds(id) {
      if (typeof id === 'number') {
        var sound = this._engine.sound(id);
        return sound ? [sound] : [];
      }

      return this._engine.sounds(this._id);
    }

    /**
     * Fires an event of group or sound.
     * @param {string} eventName The event name.
     * @param {number} [id] The sound id.
     * @param {...*} args The arguments that to be passed to handler.
     * @return {Buzz}
     * @private
     */

  }, {
    key: '_fire',
    value: function _fire(eventName, id) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (id) {
        _Emitter2.default.fire.apply(_Emitter2.default, [id, eventName].concat(args, [this.sound(id), this]));
        _Emitter2.default.fire.apply(_Emitter2.default, [this._id, eventName].concat(args, [this.sound(id), this]));
      } else {
        _Emitter2.default.fire.apply(_Emitter2.default, [this._id, eventName].concat(args, [this]));
      }

      return this;
    }
  }]);

  return Buzz;
}();

var $buzz = function $buzz(args) {
  return new Buzz(args);
};
['setup', 'load', 'unload', 'mute', 'unmute', 'volume', 'stop', 'suspend', 'resume', 'terminate', 'muted', 'state', 'context', 'isAudioAvailable', 'on', 'off'].forEach(function (method) {
  $buzz[method] = function () {
    var result = _Engine2.default[method].apply(_Engine2.default, arguments);
    return result === _Engine2.default ? $buzz : result;
  };
});

module.exports = $buzz;