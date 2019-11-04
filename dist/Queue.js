'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Stores queue of actions that has to be run before or after specific events.
 */
var Queue = function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this._eventActions = {};
  }

  _createClass(Queue, [{
    key: 'add',


    /**
     * Queues the passed action to the event.
     * @param {string} eventName The event name.
     * @param {string} actionIdentifier The action identifier.
     * @param {function} action The action function.
     * @param {boolean} [removeAfterRun = true] Remove the action once it's run.
     */
    value: function add(eventName, actionIdentifier, action) {
      var removeAfterRun = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      if (!this.hasEvent(eventName)) {
        this._eventActions[eventName] = {};
      }

      this._eventActions[eventName][actionIdentifier] = { fn: action, removeAfterRun: removeAfterRun };
    }

    /**
     * Returns true if there is a event exists for the passed name.
     * @param {string} eventName The event name.
     * @return {boolean}
     */

  }, {
    key: 'hasEvent',
    value: function hasEvent(eventName) {
      return this._eventActions.hasOwnProperty(eventName);
    }

    /**
     * Returns true if the passed action is already queued-up.
     * @param {string} eventName The event name.
     * @param {string} actionIdentifier The action identifier.
     * @return {boolean}
     */

  }, {
    key: 'hasAction',
    value: function hasAction(eventName, actionIdentifier) {
      if (!this.hasEvent(eventName)) {
        return false;
      }

      return this._eventActions[eventName].hasOwnProperty(actionIdentifier);
    }

    /**
     * Runs all the actions queued up for the passed event.
     * @param {string} eventName The event name.
     * @param {string} [actionIdentifier] The action identifier.
     */

  }, {
    key: 'run',
    value: function run(eventName, actionIdentifier) {
      var _this = this;

      if (!this.hasEvent(eventName)) {
        return;
      }

      if (typeof actionIdentifier !== 'undefined') {
        if (!this.hasAction(eventName, actionIdentifier)) {
          return;
        }

        this._run(eventName, actionIdentifier);

        return;
      }

      Object.keys(this._eventActions[eventName]).forEach(function (action) {
        return _this._run(eventName, action);
      });
    }

    /**
     * Removes the event or a queued action for the event.
     * @param {string} eventName The event name.
     * @param {string} [actionIdentifier] The action identifier.
     */

  }, {
    key: 'remove',
    value: function remove(eventName, actionIdentifier) {
      if (!this._eventActions.hasOwnProperty(eventName)) {
        return;
      }

      if (!actionIdentifier) {
        delete this._eventActions[eventName];
        return;
      }

      delete this._eventActions[eventName][actionIdentifier];
    }

    /**
     * Clears all the stored events and the queued-up actions.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._eventActions = {};
    }

    /**
     * Runs a single action.
     * @param {string} eventName The event name.
     * @param {string} actionIdentifier The action identifier.
     * @private
     */

  }, {
    key: '_run',
    value: function _run(eventName, actionIdentifier) {
      var queued = this._eventActions[eventName][actionIdentifier];
      queued.fn();
      queued.removeAfterRun && this.remove(eventName, actionIdentifier);
    }
  }]);

  return Queue;
}();

exports.default = Queue;