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

    var PROPS = [
        'altKey',
        'bubbles',
        'button',
        'cancelable',
        'ctrlKey',
        'clientX',
        'clientY',
        'detail',
        'fromElement',
        'isPrimary',
        'layerX',
        'layerY',
        'metaKey',
        'offsetX',
        'offsetY',
        'pageX',
        'pageY',
        'pointerId',
        'pointerType',
        'pressure',
        'relatedTarget',
        'screenX',
        'screenY',
        'shiftKey',
        'target',
        'tiltX',
        'tiltY',
        'timeStamp',
        'type',
        'view',
        'x',
        'y'
    ];


    function Pointer(id) {
        this.id = id;
        this.events = {};
    }

    Pointer.prototype = {

        _sanitizeEvent: function (event) {
            var p, data = {};

            for(var i = 0; i < PROPS.length; i++) {
                p = PROPS[i];
                data[p] = event[p];
            }

            return data;
        },

        _add: function (evType, event) {
            var data = this._sanitizeEvent(event);

            this.events[evType].push(data);

            return data;
        },

        add: function (event) {
            var evType = event.type.substring(7);

            this.events[evType] = this.events[evType] || [];

            return this._add(evType, event);
        }
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

    global.polyTouch = {
        ppcm: 28, // px per cm, default = 28
        Pointer: Pointer,
        PointerMap: PointerMap
    };

    // calculate real pixel per cm
    document.addEventListener('DOMContentLoaded', function () {
        var div = document.createElement('div');
        div.style.width = '1cm';

        var body = document.getElementsByTagName('body')[0];
        body.appendChild(div);

        var ppin = document.defaultView
            .getComputedStyle(div, null)
            .getPropertyValue('width');

        body.removeChild(div);

        global.polyTouch.ppcm = parseFloat(ppin);
    });

}(window));
