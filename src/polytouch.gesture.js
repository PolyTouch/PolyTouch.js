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

    var DEFAULT_PROPERTIES = [
        'altKey',
        'button',
        'clientX',
        'clientY',
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
        'screenX',
        'screenY',
        'shiftKey',
        'target',
        'tiltX',
        'tiltY',
        'view',
        'x',
        'y'
    ];

    function GestureEvent(type, props) {
        var ev = document.createEvent('Event'),
            p = props || {}, keys, k;

        ev.initEvent(type, p.bubbles != null ? p.bubbles : true, p.cancelable != null ? p.cancelable : true);

        // copy properties
        keys = Object.keys(p);
        for (var i = 0; i < keys.length; i++) {
            k = keys[i];
            ev[k] = p[k];
        }

        return ev;
    }

    function GestureRecognizer() {
        this._recognizer = [];
        this.pointer = new polyTouch.PointerMap();

        this._handleEvent = this._handleEvent.bind(this);

        document.addEventListener('pointerdown', this._handleEvent, false);
        document.addEventListener('pointermove', this._handleEvent, false);
        document.addEventListener('pointercancel', this._handleEvent, false);
        document.addEventListener('pointerup', this._handleEvent, false);

    }

    GestureRecognizer.prototype = {

        DEFAULT_PROPERTIES: DEFAULT_PROPERTIES,

        _handleEvent: function (ev) {
            var data, pointer, evType = ev.type.substring(7);

            switch (evType) {
                case 'down':
                    data = this.pointer.set(ev.pointerId, ev);
                    break;
                case 'move':
                case 'cancel':
                case 'up':
                    if (this.pointer.has(ev.pointerId)) {
                        data = this.pointer.set(ev.pointerId, ev);
                    }
                    break;
            }

            pointer = this.pointer.get(ev.pointerId);

            if (data && pointer) {
                this._dispatch(evType, pointer, data, ev);
            }

            if (evType === 'cancel' || evType === 'up') {
                this.pointer.remove(ev.pointerId);
            }
        },

        _dispatch: function (evType, pointer, eventData, originalEvent) {
            var fn;

            for (var i=0; i < this._recognizer.length; i++) {
                fn = this._recognizer[i][evType];

                fn && fn.call(this._recognizer[i], pointer, eventData, originalEvent);
            }
        },

        cloneProperties: function (origin, props) {
            var p, data = {};

            for(var i = 0; i < props.length; i++) {
                p = props[i];
                data[p] = origin[p];
            }

            return data;
        },

        trigger: function (target, type, data) {
            var ev = GestureEvent(type, data);

            target.dispatchEvent(ev);
        },

        register: function (def) {
            this._recognizer.push(def);
        },

        getPointerOnTarget: function (target) {
            var ptn, i, ret = [];

            for (i=this.pointer.keys.length - 1; i > -1; i--) {
                ptn = this.pointer.values[global.gesture.pointer.keys[i]];
                ptnArr = ptn.events.move || ptn.events.down;

                if (ptnArr[ptnArr.length-1].target === target) {
                    ret.push(ptn);
                }
            }

            return ret;
        }
    };

    global.gesture = new GestureRecognizer();

}(window.polyTouch));
