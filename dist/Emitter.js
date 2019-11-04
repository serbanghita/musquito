"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Singleton global event emitter.
 * @class
 */
var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this._objectsEventsHandlersMap = {};
  }

  /**
   * Dictionary that maps the objects with their events and handlers.
   * @type {object}
   * @private
   */


  _createClass(Emitter, [{
    key: "on",


    /**
     * Subscribes to an event of the passed object.
     * @param {number} id The unique id of the object.
     * @param {string} eventName Name of the event
     * @param {function} handler The event-handler function
     * @param {boolean} [once = false] Is it one-time subscription or not?
     * @return {Emitter}
     */
    value: function on(id, eventName, handler) {
      var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (!this._hasObject(id)) {
        this._objectsEventsHandlersMap[id] = {};
      }

      var objEvents = this._objectsEventsHandlersMap[id];

      if (!objEvents.hasOwnProperty(eventName)) {
        objEvents[eventName] = [];
      }

      objEvents[eventName].push({
        handler: handler,
        once: once
      });

      return this;
    }

    /**
     * Un-subscribes from an event of the passed object.
     * @param {number} id The unique id of the object.
     * @param {string} eventName The event name.
     * @param {function} [handler] The handler function.
     * @return {Emitter}
     */

  }, {
    key: "off",
    value: function off(id, eventName, handler) {
      if (!this._hasEvent(id, eventName)) {
        return this;
      }

      var objEvents = this._objectsEventsHandlersMap[id];

      if (!handler) {
        objEvents[eventName] = [];
      } else {
        objEvents[eventName] = objEvents[eventName].filter(function (eventSubscriber) {
          return eventSubscriber.handler !== handler;
        });
      }

      return this;
    }

    /**
     * Fires an event of the object passing the source and other optional arguments.
     * @param {number} id The unique id of the object.
     * @param {string} eventName The event name
     * @param {...*} args The arguments that to be passed to handler
     * @return {Emitter}
     */

  }, {
    key: "fire",
    value: function fire(id, eventName) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (!this._hasEvent(id, eventName)) {
        return this;
      }

      var eventSubscribers = this._objectsEventsHandlersMap[id][eventName];

      for (var i = 0; i < eventSubscribers.length; i++) {
        var eventSubscriber = eventSubscribers[i];

        setTimeout(function (subscriber) {
          var handler = subscriber.handler,
              once = subscriber.once;


          handler.apply(undefined, args);

          if (once) {
            this.off(id, eventName, handler);
          }
        }.bind(this, eventSubscriber), 0);
      }

      return this;
    }

    /**
     * Clears the event handlers of the passed object.
     * @param {number} [id] The unique id of the object.
     * @return {Emitter}
     */

  }, {
    key: "clear",
    value: function clear(id) {
      if (!id) {
        this._objectsEventsHandlersMap = {};
        return this;
      }

      if (this._hasObject(id)) {
        delete this._objectsEventsHandlersMap[id];
      }

      return this;
    }

    /**
     * Returns true if the object is already registered.
     * @param {number} id The object id.
     * @return {boolean}
     * @private
     */

  }, {
    key: "_hasObject",
    value: function _hasObject(id) {
      return this._objectsEventsHandlersMap.hasOwnProperty(id);
    }

    /**
     * Returns true if the passed object has an entry of the passed event.
     * @param {number} id The object id.
     * @param {string} eventName The event name.
     * @return {boolean}
     * @private
     */

  }, {
    key: "_hasEvent",
    value: function _hasEvent(id, eventName) {
      return this._hasObject(id) && this._objectsEventsHandlersMap[id].hasOwnProperty(eventName);
    }
  }]);

  return Emitter;
}();

exports.default = new Emitter();