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
                moveEvt, ptn, ptnArr, i;

            if (downEvt) {
                // check for max time
                if (global.math.duration(downEvt.timeStamp, eventData.timeStamp) > TIMEOUT) {
                    return;
                }

                // same start/end target
                if (eventData.target !== downEvt.target) {
                    return;
                }

                // check for multiple pointers => not a tap
                if (global.gesture.getPointerOnTarget(downEvt.target).length > 1) {
                    return;
                }

                // check for unallowed movement
                if (pointer.events.move) {
                    for (i=pointer.events.move.length - 1; i > -1; i--) {
                        moveEvt = pointer.events.move[i];

                        if ((global.math.distance(downEvt.x, moveEvt.x) / global.ppcm) > THRESHOLD ||
                            (global.math.distance(downEvt.y, moveEvt.y) / global.ppcm) > THRESHOLD) {
                            return;
                        }
                    }
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
