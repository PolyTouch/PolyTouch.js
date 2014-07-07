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
