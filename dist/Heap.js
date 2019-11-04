"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents a heap item.
 */
var HeapItem =

/**
 * Set the group id and sound.
 * @param {number} groupId The group id.
 * @param {Sound} sound The sound instance.
 */


/**
 * The sound object.
 * @type {Sound}
 */
function HeapItem(groupId, sound) {
  _classCallCheck(this, HeapItem);

  this.sound = null;
  this.groupId = null;

  this.groupId = groupId;
  this.sound = sound;
}

/**
 * The group id.
 * @type {number|null}
 */
;

/**
 * Represents a collection of sounds belong to an audio resource.
 */


var HeapItemCollection = function () {
  function HeapItemCollection() {
    _classCallCheck(this, HeapItemCollection);

    this.url = null;
    this.items = {};
  }

  /**
   * The audio source url.
   * @type {string|null}
   */


  /**
   * The collection of sound objects.
   * @type {object}
   */


  _createClass(HeapItemCollection, [{
    key: "add",


    /**
     * Adds a new sound item to the collection.
     * @param {number} groupId The group id.
     * @param {Sound} sound The sound instance.
     */
    value: function add(groupId, sound) {
      var soundId = sound.id().toString();

      if (this.items.hasOwnProperty(soundId)) {
        return;
      }

      this.items[soundId] = new HeapItem(groupId, sound);
    }

    /**
     * Removes the sounds.
     * @param {boolean} [idle = true] True to destroy only the idle sounds.
     * @param {number} [groupId] The group id.
     */

  }, {
    key: "free",
    value: function free() {
      var _this = this;

      var idle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var groupId = arguments[1];

      Object.values(this.items).forEach(function (item) {
        var sound = item.sound,
            soundGroupId = item.soundGroupId;


        if (idle && (sound.isPlaying() || sound.isPaused())) {
          return;
        }

        if (!Boolean(groupId) || soundGroupId === groupId) {
          sound.destroy();
          delete _this.items[sound.id()];
        }
      });
    }

    /**
     * Returns the sounds belong to the group or all the sounds in the collection.
     * @param {number} [groupId] The group id.
     * @return {Array<HeapItem>}
     */

  }, {
    key: "sounds",
    value: function sounds(groupId) {
      var itemsArray = Object.values(this.items);
      var items = groupId ? itemsArray.filter(function (item) {
        return item.groupId === groupId;
      }) : itemsArray;
      return items.map(function (item) {
        return item.sound;
      });
    }

    /**
     * Destroys all the sounds.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      Object.values(this.items).forEach(function (item) {
        return item.sound.destroy();
      });
      this.items = {};
    }
  }]);

  return HeapItemCollection;
}();

/**
 * Stores all the created sounds.
 */


var Heap = function () {

  /**
   * Initialize stuff.
   */
  function Heap() {
    _classCallCheck(this, Heap);

    this._collections = {};

    this.free = this.free.bind(this);
  }

  /**
   * Adds a new sound to the respective collection.
   * @param {string} url The audio source url or base64 string.
   * @param {number} groupId The group id.
   * @param {Sound} sound The sound instance.
   */


  /**
   * The sound collections.
   * @type {object}
   * @private
   */


  _createClass(Heap, [{
    key: "add",
    value: function add(url, groupId, sound) {
      if (!this._collections.hasOwnProperty(url)) {
        this._collections[url] = new HeapItemCollection();
      }

      this._collections[url].add(groupId, sound);
    }

    /**
     * Returns the sound based on the id.
     * @param {number} id The sound id.
     */

  }, {
    key: "sound",
    value: function sound(id) {
      return this.sounds().find(function (sound) {
        return sound.id() === id;
      });
    }

    /**
     * Returns the sounds belongs to a particular group or all of them.
     * @param {number} [groupId] The group id.
     * @return {Array}
     */

  }, {
    key: "sounds",
    value: function sounds(groupId) {
      var sounds = [];
      Object.values(this._collections).forEach(function (col) {
        return sounds.push.apply(sounds, _toConsumableArray(col.sounds(groupId)));
      });
      return sounds;
    }

    /**
     * Removes sounds from the collections.
     * @param {boolean} [idle = true] True to destroy only the idle sounds.
     * @param {number} [groupId] The group id.
     */

  }, {
    key: "free",
    value: function free() {
      var idle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var groupId = arguments[1];

      Object.values(this._collections).forEach(function (col) {
        return col.free(idle, groupId);
      });
    }

    /**
     * Destroys all the sounds.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      Object.values(this._collections).forEach(function (col) {
        return col.destroy();
      });
      this._collections = {};
    }
  }]);

  return Heap;
}();

exports.default = Heap;