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
