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

    var HOLD_TIME = 600,
        THRESHOLD = 0.5; //cm

    var hold = {

        down: function (pointer, eventData, originalEvent) {
            setTimeout(this.detect.bind(this, pointer.id), HOLD_TIME);
        },

        detect: function (pointerId) {
            var ptn = global.gesture.pointer.get(pointerId),
                downEvt, props;

            if (ptn) { // pointer was still on the screen
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
