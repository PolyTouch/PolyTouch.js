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
            return {
                pointerId: event.pointerId
            };
        },

        _add: function (event) {
            var data = this._sanitizeEvent(event);

            this.events.push(data);

            return data; // for the reference
        },

        add: function (event) {
            var fn;

            switch (event.type) {
                case 'pointerdown':
                    fn = 'down';
                    break;
                case 'pointermove':
                    fn = 'move';
                    break;
                case 'pointercancel':
                case 'pointerup':
                    fn = 'up';
                    break;
            }

            return this[fn](event);
        },

        down: function (event) {
            return (this.start = this._add(event));
        },

        move: function (event) {
            return (this.lastMove = this._add(event));
        },

        up: function (event) {
            return (this.end = this._add(event));
        },
    };

    function PointerMap() {
        this.keys = [];
        this.values = {};
    }

    PointerMap.prototype = {

        set: function (id, event) {
            var idx = this.keys.indexOf(id);

            if (idx === -1) {
                this.keys.push(id);
                this.values[id] = new Pointer(id);
            }

            return this.values[id].add(event);
        },

        get: function (id) {
            return this.values[id];
        },

        remove: function (id) {
            var idx = this.keys.indexOf(id);
            if (idx > -1) {
                this.keys.splice(idx, 1);
                delete this.values[id];
            }
        },

        has: function (id) {
            return this.keys.indexOf(id) > -1;
        },

        clear: function () {
            for (var i=this.keys.length; i > -1; i--) {
                delete this.values[this.keys[i]];
            }

            this.keys.length = 0;
        }
    };

    global.polyTouch = {
        Pointer: Pointer,
        PointerMap: PointerMap
    };

}(window));
