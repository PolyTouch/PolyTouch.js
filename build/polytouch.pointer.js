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
        'toElement',
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
        },

        position: function () {
            return this.events.move ?
                this.events.move[this.events.move.length-1]:
                this.events.down[0];
        },

        hasMoved: function (threshold, refEvt) {
            var downEvt = refEvt || this.events.down[0],
                moveEvt, deltaX, deltaY;

            if (this.events.move) {
                for (var i=this.events.move.length - 1; i > -1; i--) {
                    moveEvt = this.events.move[i];
                    deltaX = Math.abs(global.math.distance(downEvt.x, moveEvt.x) / global.ppcm);
                    deltaY = Math.abs(global.math.distance(downEvt.y, moveEvt.y) / global.ppcm);

                    if ((deltaX) > threshold || (deltaY) > threshold) {
                        return true;
                    }


                }
            }

            return false;
        }
    };

    global.Pointer = Pointer;

}(window.polyTouch));
