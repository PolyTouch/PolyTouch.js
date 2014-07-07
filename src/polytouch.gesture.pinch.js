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

    var THRESHOLD = 0.25; //cm

    var active = {};

    var pinch = {

        down: function (pointer, eventData, originalEvent) {
            var p = global.gesture.getPointerOnTarget(eventData.target);

            // there have to be exactly 2 pointers on the target
            if (p.length === 2 && p[0].pointerType === p[1].pointerType) {
                // lock the 2 pointers to the target
                // they may move outside of the target later on
                active[p[0].id] = {
                    start: p[0].events.move ?
                        p[0].events.move[p[0].events.move.length-1] :
                        p[0].events.down[0],
                    related: p[1].id,
                    target: eventData.target,
                    hasStarted: false
                };
                active[p[1].id] = {
                    start: p[1].events.move ?
                        p[1].events.move[p[1].events.move.length-1] :
                        p[1].events.down[0],
                    related: p[0].id,
                    target: eventData.target,
                    hasStarted: false
                };
            }
        },

        move: function (pointer, eventData, originalEvent) {
            var cur = active[pointer.id],
                rel, props;

            if (cur) {
                rel = cur.related;

                if (!cur.hasStarted) {
                    if (pointer.hasMoved(THRESHOLD, cur.start)) { // first move
                        cur.hasStarted = true;
                        rel.hasStarted = true;

                        // TODO improve positioning data
                        props = global.gesture.cloneProperties(eventData, global.gesture.DEFAULT_PROPERTIES);
                        global.gesture.trigger(cur.target, 'pinchstart', props);
                    } else {
                        return;
                    }
                }

                // todo calc
                global.gesture.trigger(cur.target, 'pinch', {});
            }
        },

        cancel: this.up,

        up: function (pointer, eventData, originalEvent) {
            var cur = active[pointer.id];

            // cancel if an active pointer gets removed
            if (cur) {
                delete active[cur.related];
                delete active[pointer.id];

                props = global.gesture.cloneProperties(eventData, global.gesture.DEFAULT_PROPERTIES);
                global.gesture.trigger(cur.target, 'pinchend', props);
            }
        }
    };

    global.gesture.register(pinch);

}(window.polyTouch));
