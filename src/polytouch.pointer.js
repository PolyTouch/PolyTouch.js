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
        },

        hasMoved: function (threshold) {
            var downEvt = this.events.down[0],
                moveEvt;

            if (this.events.move) {
                for (i=this.events.move.length - 1; i > -1; i--) {
                    moveEvt = this.events.move[i];

                    if ((global.math.distance(downEvt.x, moveEvt.x) / global.ppcm) > threshold ||
                        (global.math.distance(downEvt.y, moveEvt.y) / global.ppcm) > threshold) {
                        return true;
                    }
                }
            }

            return false;
        }
    };

    global.Pointer = Pointer;

}(window.polyTouch));