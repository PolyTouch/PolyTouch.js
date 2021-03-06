/*
 * PolyTouch 1.0.0
 * git://github.com/PolyTouch/PolyTouch.js.git
 *
 *
 * Copyright 2014 Adobe Systems Incorporated
 * Released under the Apache License v2
 *
 * Author: Damien Antipa
 * Date: 2014-07-07T14:03:15.789Z
 */
(function (global) {

    function PointerMap() {
        this.keys = [];
        this.values = {};
    }

    PointerMap.prototype = {

        set: function (id, event) {
            var idx = this.keys.indexOf(id);

            if (idx === -1) {
                this.keys.push(id);
                this.values[id] = new global.Pointer(id);
            }

            return this.values[id].add(event);
        },

        get: function (id) {
            return this.values[id];
        },

        remove: function (id) {
            var idx = this.keys.indexOf(id),
                cache;

            if (idx > -1) {
                cache = this.values[id];

                this.keys.splice(idx, 1);
                delete this.values[id];
            }

            return cache;
        },

        has: function (id) {
            return this.keys.indexOf(id) > -1;
        },

        clear: function () {
            for (var i=this.keys.length - 1; i > -1; i--) {
                delete this.values[this.keys[i]];
            }

            this.keys.length = 0;
        }
    };

    global.PointerMap = PointerMap;

}(window.polyTouch));
