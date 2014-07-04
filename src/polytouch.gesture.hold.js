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

    var HOLD_TIME = 800,
        THRESHOLD = 0.5; //cm

    var hold = {

        down: function (pointer, eventData, originalEvent) {
            setTimeout(this.detect.bind(this, pointer.id), HOLD_TIME);
        },

        detect: function (pointerId) {
            var ptn = global.gesture.pointer.get(pointerId),
                downEvt;

            if (ptn) { // pointer was still on the screen
                downEvt = ptn.events.down[0];

                if ((global.gesture.getPointerOnTarget(downEvt.target).length > 1) || // check for multiple pointers => not a tap
                    (ptn.hasMoved(THRESHOLD))) { // check for unallowed movement
                    return;
                }

                global.gesture.trigger(downEvt.target, 'hold', {
                    // todo add values
                });
            }
        }
    };

    global.gesture.register(hold);

}(window.polyTouch));
