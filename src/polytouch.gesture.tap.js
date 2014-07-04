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

    var TIMEOUT = 300,
        THRESHOLD = 0.5; //cm

    var tap = {

        cancel: function (pointer, eventData, originalEvent) {
            this.up.apply(this, arguments);
        },

        up: function (pointer, eventData, originalEvent) {
            var downEvt = pointer.events.down[0],
                moveEvt, pi;

            if (downEvt) {

                if ((global.math.duration(downEvt.timeStamp, eventData.timeStamp) > TIMEOUT) || // check for max time
                    (eventData.target !== downEvt.target) || // same start/end target
                    (global.gesture.getPointerOnTarget(downEvt.target).length > 1) || // check for multiple pointers => not a tap
                    (pointer.hasMoved(THRESHOLD))) { // check for unallowed movement
                    return;
                }

                global.gesture.trigger(eventData.target, 'tap', {
                    // todo add values
                });

                // todo check for double tap
            }
        }
    };

    global.gesture.register(tap);

}(window.polyTouch));
