/*!
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

    global.polyTouch = {
        ppcm: 28 // px per cm, default = 28
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

    var math = {

        distance: function (start, end) {
            return end - start;
        },

        duration: function (start, end) {
            return end - start;
        }
    };

    global.math = math;

}(window.polyTouch));

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
        this.pointer = new global.PointerMap();

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
            var ptn, ptnArr, i, ret = [];

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

    var TIMEOUT = 300,
        THRESHOLD = 0.5; //cm

    var tap = {

        cancel: this.up,

        up: function (pointer, eventData) {
            var downEvt = pointer.events.down[0],
                props;

            if (downEvt) {

                if ((global.math.duration(downEvt.timeStamp, eventData.timeStamp) > TIMEOUT) || // check for max time
                    (eventData.target !== downEvt.target) || // same start/end target
                    (global.gesture.getPointerOnTarget(downEvt.target).length > 1) || // check for multiple pointers => not a tap
                    (pointer.hasMoved(THRESHOLD))) { // check for unallowed movement
                    return;
                }

                props = global.gesture.cloneProperties(downEvt, global.gesture.DEFAULT_PROPERTIES);

                global.gesture.trigger(eventData.target, 'tap', props);

                // todo check for double tap
            }
        }
    };

    global.gesture.register(tap);

}(window.polyTouch));

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

    var HOLD_TIME = 600,
        THRESHOLD = 0.5; //cm

    var active = {};

    var hold = {

        down: function (pointer) {
            active[pointer.id] = setTimeout(this.detect.bind(this, pointer.id), HOLD_TIME);
        },

        up: function (pointer) {
            var cur = active[pointer.id];
            if (cur) { // the user may remove the pointer and add it again -> wrong event
                clearTimeout(cur);
                delete active[pointer.id];
            }
        },

        detect: function (pointerId) {
            var ptn = global.gesture.pointer.get(pointerId),
                downEvt, props;

            if (ptn) { // pointer was still on the screen
                delete active[pointerId];
                downEvt = ptn.events.down[0];

                if ((global.gesture.getPointerOnTarget(downEvt.target).length > 1) || // check for multiple pointers => not a tap
                    (ptn.hasMoved(THRESHOLD))) { // check for unallowed movement
                    return;
                }


                props = global.gesture.cloneProperties(downEvt, global.gesture.DEFAULT_PROPERTIES);

                global.gesture.trigger(downEvt.target, 'hold', props);
            }
        }
    };

    global.gesture.register(hold);

}(window.polyTouch));

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
        'metaKey',
        'pointerType',
        'shiftKey',
        'target',
        'view'
    ];

    function scale(s, e) {
        return (Math.sqrt(Math.pow(e[0].x - e[1].x, 2) + Math.pow(e[0].y - e[1].y, 2)) /
                Math.sqrt(Math.pow(s[0].x - s[1].x, 2) + Math.pow(s[0].y - s[1].y, 2))
            ).toFixed(2);
    }

    function rotation(s, e) {
        return ((Math.atan2(e[0].y - e[1].y, e[0].x - e[1].x) * 180 / Math.PI) -
                (Math.atan2(s[0].y - s[1].y, s[0].x - s[1].x) * 180 / Math.PI)
            ).toFixed(2);
    }

    var THRESHOLD = 0.25; //cm

    var active = {};

    var pinch = {

        down: function (pointer, eventData) {
            var p = global.gesture.getPointerOnTarget(eventData.target);

            // there have to be exactly 2 pointers on the target
            if (p.length === 2 && p[0].pointerType === p[1].pointerType) {
                // lock the 2 pointers to the target
                // they may move outside of the target later on
                active[p[0].id] = {
                    start: p[0].position(),
                    primary: true,
                    related: p[1].id,
                    target: eventData.target,
                    hasStarted: false
                };
                active[p[1].id] = {
                    start: p[1].position(),
                    related: p[0].id,
                    target: eventData.target,
                    hasStarted: false
                };
            }
        },

        move: function (pointer, eventData) {
            var cur = active[pointer.id],
                rel, relPointer, relPosition, props, param;

            if (cur) {
                rel = active[cur.related];

                if (!cur.hasStarted) {
                    if (pointer.hasMoved(THRESHOLD, cur.start)) { // first move
                        cur.hasStarted = true;
                        rel.hasStarted = true;

                        // TODO calculate center point
                        props = global.gesture.cloneProperties(eventData, global.gesture.DEFAULT_PROPERTIES);
                        global.gesture.trigger(cur.target, 'pinchstart', props);
                    } else {
                        return;
                    }
                }

                relPointer = global.gesture.pointer.get(cur.related);
                relPosition = relPointer.position();

                param = cur.primary ? [[cur.start, rel.start], [eventData, relPosition]]:
                    [[rel.start, cur.start], [relPosition, eventData]];

                props = global.gesture.cloneProperties(eventData, PROPS);
                props.target = cur.target;
                // TODO add center as x/y, pageX, etc.
                props.detail = {
                    scale: scale.apply(this, param),
                    rotation: rotation.apply(this, param)
                };

                global.gesture.trigger(cur.target, 'pinch', props);
            }
        },

        cancel: this.up,

        up: function (pointer, eventData) {
            var cur = active[pointer.id],
                props;

            // cancel if an active pointer gets removed
            if (cur) {
                if (cur.hasStarted) {
                    props = global.gesture.cloneProperties(eventData, global.gesture.DEFAULT_PROPERTIES);
                    global.gesture.trigger(cur.target, 'pinchend', props);
                }

                delete active[cur.related];
                delete active[pointer.id];
            }
        }
    };

    global.gesture.register(pinch);

}(window.polyTouch));
