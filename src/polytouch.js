/*!
 * @@name @@version
 * @@repository.url
 *
 *
 * Copyright @@year @@copyright
 * Released under the @@licenses
 *
 * Author: @@author
 * Date: @@date
 */
(function (global) {

    function Pointer(id) {
        this.id = id;
        this.events = [];

        // references to key events
        this.start = null;
        this.lastMove = null;
        this.end = null;
    }

    Pointer.prototype = {

        _sanitizeEvent: function (event) {
            // todo sanitize data from events
            return {};
        },

        _add: function (event) {
            var data = this._sanitizeEvent(event);

            this.events.push(data);

            return data; // for the reference
        }

        start: function (event) {
            return this.start = this._add(event);
        },

        move: function (event) {
            return this.lastMove = this._add(event);
        },

        end: function (event) {
            return this.end = this._add(event);
        },
    };

    function PointerMap() {
        this.keys = [];
        this.values = [];
    }

    PointerMap.prototype = {

        set: function (id, event) {

        },

        get: function (id) {

        },

        remove: function (id) {

        },

        has: function (id) {

        },

        clear: function () {

        }


    };

    global.polyTouch = {
        Pointer: Pointer,
        PointerMap: PointerMap
    };

}(window));
