'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SoundState = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Engine = require('./Engine');

var _Engine2 = _interopRequireDefault(_Engine);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Enum that represents the different states of a sound.
 * @enum {string}
 */
var SoundState = {
  Ready: 'ready',
  Playing: 'playing',
  Paused: 'paused',
  Destroyed: 'destroyed'
};

/**
 * Represents a sound created using Web Audio API.
 * @class
 */

var Sound = function () {

  /**
   * Initializes the internal properties of the sound.
   * @param {object} args The input parameters of the sound.
   * @param {string} [args.id] The unique id of the sound.
   * @param {AudioBuffer} [args.buffer] Audio source buffer.
   * @param {number} [args.volume = 1.0] The initial volume of the sound. Should be from 0.0 to 1.0.
   * @param {number} [args.rate = 1] The initial playback rate of the sound. Should be from 0.5 to 5.0.
   * @param {boolean} [args.loop = false] True to play the sound repeatedly.
   * @param {boolean} [args.muted = false] True to be muted initially.
   * @param {number} [args.startPos] The playback start position.
   * @param {number} [args.endPos] The playback end position.
   * @param {function} [args.playEndCallback] The callback that will be invoked after the play ends.
   * @param {function} [args.destroyCallback] The callback that will be invoked after destroyed.
   * @param {function} [args.fadeEndCallback] The callback that will be invoked the fade is completed.
   * @constructor
   */


  /**
   * The timer that runs function after the fading is complete.
   * @type {number|null}
   * @private
   */


  /**
   * The callback that will be invoked after the sound destroyed.
   * @type {function}
   * @private
   */


  /**
   * The time at which the playback started.
   * This property is required for getting the seek position of the playback.
   * @type {number}
   * @private
   */


  /**
   * The current position of the playback.
   * @type {number}
   * @private
   */


  /**
   * The playback start position.
   * @type {number}
   * @private
   */


  /**
   * The AudioBufferSourceNode that plays the audio buffer assigned to it.
   * @type {AudioBufferSourceNode}
   * @private
   */


  /**
   * The gain node to control the volume of the sound.
   * @type {GainNode}
   * @private
   */


  /**
   * The current state (playing, paused etc.) of the sound.
   * @type {SoundState}
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
  function Sound(args) {
    _classCallCheck(this, Sound);

    this._id = -1;
    this._volume = 1.0;
    this._rate = 1;
    this._muted = false;
    this._loop = false;
    this._state = SoundState.Ready;
    this._context = null;
    this._gainNode = null;
    this._buffer = null;
    this._bufferSourceNode = null;
    this._duration = 0;
    this._startPos = 0;
    this._endPos = 0;
    this._currentPos = 0;
    this._rateSeek = 0;
    this._startTime = 0;
    this._playEndCallback = null;
    this._destroyCallback = null;
    this._fading = false;
    this._fadeTimer = null;
    this._fadeEndCallback = null;
    var id = args.id,
        buffer = args.buffer,
        volume = args.volume,
        rate = args.rate,
        loop = args.loop,
        muted = args.muted,
        startPos = args.startPos,
        endPos = args.endPos,
        playEndCallback = args.playEndCallback,
        destroyCallback = args.destroyCallback,
        fadeEndCallback = args.fadeEndCallback;

    // Set the passed id or the random one.

    this._id = typeof id === 'number' ? id : _Utility2.default.id();

    // Set the passed audio buffer and duration.
    this._buffer = buffer;
    this._endPos = this._buffer.duration;

    // Set other properties.
    volume && (this._volume = volume);
    rate && (this._rate = rate);
    muted && (this._muted = muted);
    loop && (this._loop = loop);
    startPos && (this._startPos = startPos);
    endPos && (this._endPos = endPos);
    this._playEndCallback = playEndCallback;
    this._destroyCallback = destroyCallback;
    this._fadeEndCallback = fadeEndCallback;

    // Calculate the duration.
    this._duration = this._endPos - this._startPos;

    // Create gain node and set the volume.
    this._context = _Engine2.default.context();
    this._gainNode = this._context.createGain();
    this._gainNode.gain.setValueAtTime(this._muted ? 0 : this._volume, this._context.currentTime);
  }

  /**
   * Plays the sound or the sound defined in the sprite.
   * @return {Sound}
   */


  /**
   * The callback that will be invoked after the fade is completed.
   * @type {function}
   * @private
   */


  /**
   * True if the sound is currently fading.
   * @type {boolean}
   * @private
   */


  /**
   * The callback that will be invoked after the play ends.
   * @type {function}
   * @private
   */


  /**
   * The position of the playback during rate change.
   * @type {number}
   * @private
   */


  /**
   * The playback end position.
   * @type {number}
   * @private
   */


  /**
   * Duration of the playback in seconds.
   * @type {number}
   * @private
   */


  /**
   * The audio buffer.
   * @type {AudioBuffer}
   * @private
   */


  /**
   * Web API's audio context.
   * @type {AudioContext}
   * @private
   */


  /**
   * True if the sound should play repeatedly.
   * @type {boolean}
   * @private
   */


  /**
   * The current playback speed. Should be from 0.5 to 5.
   * @type {number}
   * @private
   */


  /**
   * Unique id.
   * @type {number}
   * @private
   */


  _createClass(Sound, [{
    key: 'play',
    value: function play() {
      var _this = this;

      // If the sound is already playing then return.
      if (this.isPlaying()) {
        return this;
      }

      // Get the playback starting position.
      var seek = Math.max(0, this._currentPos > 0 ? this._currentPos : this._startPos);

      // Create a new buffersourcenode to play the sound.
      this._bufferSourceNode = this._context.createBufferSource();

      // Set the buffer, playback rate and loop parameters
      this._bufferSourceNode.buffer = this._buffer;
      this._bufferSourceNode.playbackRate.setValueAtTime(this._rate, this._context.currentTime);
      this._setLoop(this._loop);

      // Connect the node to the audio graph.
      this._bufferSourceNode.connect(this._gainNode);

      // Listen to the "ended" event to reset/clean things.
      this._bufferSourceNode.addEventListener('ended', function () {
        // Reset the seek positions
        _this._currentPos = 0;
        _this._rateSeek = 0;

        // Destroy the node (AudioBufferSourceNodes are one-time use and throw objects).
        _this._destroyBufferNode();

        // Reset the state to allow future actions.
        _this._state = SoundState.Ready;

        // Invoke the callback if there is one.
        _this._playEndCallback && _this._playEndCallback(_this);
      });

      var startTime = this._context.currentTime;

      // Call the supported method to play the sound.
      if (typeof this._bufferSourceNode.start !== 'undefined') {
        this._bufferSourceNode.start(startTime, seek, this._loop ? undefined : this._duration);
      } else {
        this._bufferSourceNode.noteGrainOn(startTime, seek, this._loop ? undefined : this._duration);
      }

      // Record the starting time and set the state.
      this._startTime = startTime;
      this._state = SoundState.Playing;

      return this;
    }

    /**
     * Pauses the playing sound.
     * @return {Sound}
     */

  }, {
    key: 'pause',
    value: function pause() {
      // If the sound is already playing return.
      if (!this.isPlaying()) {
        return this;
      }

      // Stop the current running fade.
      this.fadeStop();

      // Save the current position and reset rateSeek.
      this._currentPos = this.seek();
      this._rateSeek = 0;

      this._destroyBufferNode();

      this._state = SoundState.Paused;

      return this;
    }

    /**
     * Stops the sound that is playing or in paused state.
     * @return {Sound}
     */

  }, {
    key: 'stop',
    value: function stop() {
      // If the sound is not playing or paused return.
      if (!this.isPlaying() && !this.isPaused()) {
        return this;
      }

      // Stop the current running fade.
      this.fadeStop();

      // Reset the variables
      this._currentPos = 0;
      this._rateSeek = 0;

      this._destroyBufferNode();

      this._state = SoundState.Ready;

      return this;
    }

    /**
     * Mutes the sound.
     * @return {Sound}
     */

  }, {
    key: 'mute',
    value: function mute() {
      // Stop the current running fade.
      this.fadeStop();

      // Set the value of gain node to 0.
      this._gainNode.gain.setValueAtTime(0, this._context.currentTime);

      // Set the muted property true.
      this._muted = true;

      return this;
    }

    /**
     * Un-mutes the sound.
     * @return {Sound}
     */

  }, {
    key: 'unmute',
    value: function unmute() {
      // Stop the current running fade.
      this.fadeStop();

      // Reset the gain node's value back to volume.
      this._gainNode.gain.setValueAtTime(this._volume, this._context.currentTime);

      // Set the muted property to false.
      this._muted = false;

      return this;
    }

    /**
     * Gets/sets the volume.
     * @param {number} [vol] Should be from 0.0 to 1.0.
     * @return {Sound|number}
     */

  }, {
    key: 'volume',
    value: function volume(vol) {
      // If no input parameter is passed then return the volume.
      if (typeof vol === 'undefined') {
        return this._volume;
      }

      // Stop the current running fade.
      this.fadeStop();

      // Set the gain's value to the passed volume.
      this._gainNode.gain.setValueAtTime(this._muted ? 0 : vol, this._context.currentTime);

      // Set the volume to the property.
      this._volume = vol;

      return this;
    }

    /**
     * Fades the sound volume to the passed value in the passed duration.
     * @param {number} to The destination volume.
     * @param {number} duration The period of fade.
     * @param {string} [type = linear] The fade type (linear or exponential).
     * @return {Sound}
     */

  }, {
    key: 'fade',
    value: function fade(to, duration) {
      var _this2 = this;

      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';

      // If a fade is already running stop it.
      if (this._fading) {
        this.fadeStop();
      }

      this._fading = true;

      if (type === 'linear') {
        this._gainNode.gain.linearRampToValueAtTime(to, this._context.currentTime + duration);
      } else {
        this._gainNode.gain.exponentialRampToValueAtTime(to, this._context.currentTime + duration);
      }

      this._fadeTimer = setTimeout(function () {
        _this2.volume(to);

        clearTimeout(_this2._fadeTimer);

        _this2._fadeTimer = null;
        _this2._fading = false;

        _this2._fadeEndCallback && _this2._fadeEndCallback(_this2);
      }, duration * 1000);

      return this;
    }

    /**
     * Stops the current running fade.
     * @return {Sound}
     */

  }, {
    key: 'fadeStop',
    value: function fadeStop() {
      if (!this._fading) {
        return this;
      }

      this._gainNode.gain.cancelScheduledValues(this._context.currentTime);

      if (this._fadeTimer) {
        clearTimeout(this._fadeTimer);
        this._fadeTimer = null;
      }

      this._fading = false;
      this.volume(this._gainNode.gain.value);

      return this;
    }

    /**
     * Gets/sets the playback rate.
     * @param {number} [rate] The playback rate. Should be from 0.5 to 5.
     * @return {Sound|number}
     */

  }, {
    key: 'rate',
    value: function rate(_rate) {
      // If no input parameter is passed return the current rate.
      if (typeof _rate === 'undefined') {
        return this._rate;
      }

      this._rate = _rate;
      this._rateSeek = this.seek();

      if (this.isPlaying()) {
        this._startTime = this._context.currentTime;
        this._bufferSourceNode && this._bufferSourceNode.playbackRate.setValueAtTime(_rate, this._context.currentTime);
      }

      return this;
    }

    /**
     * Gets/sets the seek position.
     * @param {number} [seek] The seek position.
     * @return {Sound|number}
     */

  }, {
    key: 'seek',
    value: function seek(_seek) {
      // If no parameter is passed return the current position.
      if (typeof _seek === 'undefined') {
        var realTime = this.isPlaying() ? this._context.currentTime - this._startTime : 0;
        var rateElapsed = this._rateSeek ? this._rateSeek - this._currentPos : 0;

        return this._currentPos + (rateElapsed + realTime * this._rate);
      }

      // If seeking outside the borders then return.
      if (_seek < this._startPos || _seek > this._endPos) {
        return this;
      }

      // If the sound is currently playing... pause it, set the seek position and then continue playing.
      var isPlaying = this.isPlaying();

      if (isPlaying) {
        this.pause();
      }

      this._currentPos = _seek;

      if (isPlaying) {
        this.play();
      }

      return this;
    }

    /**
     * Gets/sets the loop parameter of the sound.
     * @param {boolean} [loop] True to loop the sound.
     * @return {Sound/boolean}
     */

  }, {
    key: 'loop',
    value: function loop(_loop) {
      if (typeof _loop !== 'boolean') {
        return this._loop;
      }

      this._loop = _loop;
      this._setLoop(_loop);

      return this;
    }

    /**
     * Destroys the dependencies and release the memory.
     * @return {Sound}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      // If the sound is already destroyed return.
      if (this._state === SoundState.Destroyed) {
        return this;
      }

      // Stop the sound.
      this.stop();

      this._gainNode.disconnect();

      this._buffer = null;
      this._context = null;
      this._gainNode = null;

      // Set the state to "destroyed".
      this._state = SoundState.Destroyed;

      this._destroyCallback && this._destroyCallback(this);

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
     * Returns whether the sound is muted or not.
     * @return {boolean}
     */

  }, {
    key: 'muted',
    value: function muted() {
      return this._muted;
    }

    /**
     * Returns the state of the sound.
     * @return {SoundState}
     */

  }, {
    key: 'state',
    value: function state() {
      return this._state;
    }

    /**
     * Returns the total duration of the playback.
     * @return {number}
     */

  }, {
    key: 'duration',
    value: function duration() {
      return this._duration;
    }

    /**
     * Returns true if the buzz is playing.
     * @return {boolean}
     */

  }, {
    key: 'isPlaying',
    value: function isPlaying() {
      return this._state === SoundState.Playing;
    }

    /**
     * Returns true if buzz is paused.
     * @return {boolean}
     */

  }, {
    key: 'isPaused',
    value: function isPaused() {
      return this._state === SoundState.Paused;
    }

    /**
     * Returns the gain node.
     * @return {GainNode}
     */

  }, {
    key: '_gain',
    value: function _gain() {
      return this._gainNode;
    }

    /**
     * Stops the playing buffer source node and destroys it.
     * @private
     */

  }, {
    key: '_destroyBufferNode',
    value: function _destroyBufferNode() {
      if (!this._bufferSourceNode) {
        return;
      }

      if (typeof this._bufferSourceNode.stop !== 'undefined') {
        this._bufferSourceNode.stop();
      } else {
        this._bufferSourceNode.noteGrainOff();
      }

      this._bufferSourceNode.disconnect();
      this._bufferSourceNode.removeEventListener('ended', this._onEnded);
      this._bufferSourceNode = null;
    }

    /**
     * Sets the sound to play repeatedly or not.
     * @param {boolean} loop True to play the sound repeatedly.
     * @private
     */

  }, {
    key: '_setLoop',
    value: function _setLoop(loop) {
      if (!this._bufferSourceNode) {
        return;
      }

      this._bufferSourceNode.loop = loop;

      if (loop) {
        this._bufferSourceNode.loopStart = this._startPos;
        this._bufferSourceNode.loopEnd = this._endPos;
      }
    }
  }]);

  return Sound;
}();

exports.default = Sound;
exports.SoundState = SoundState;