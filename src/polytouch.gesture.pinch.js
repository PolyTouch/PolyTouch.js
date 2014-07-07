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

    function scale(s, e) {
        return (Math.sqrt(Math.pow(
                e[0].x - e[1].x, 2) + Math.pow(e[0].y - e[1].y, 2)
            ) / Math.sqrt(Math.pow(
                s[0].x - s[1].x, 2) + Math.pow(s[0].y - s[1].y, 2)
            )).toFixed(2);
    }

    function rotation(s, e) {
        return ((Math.atan2(e[0].y - e[1].y, e[0].x - e[1].x) * 180 / Math.PI) -
                (Math.atan2(s[0].y - s[1].y, s[0].x - s[1].x) * 180 / Math.PI)
            ).toFixed(2);
    }

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
                    start: p[0].position(),
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

        move: function (pointer, eventData, originalEvent) {
            var cur = active[pointer.id],
                rel, relPointer, relPosition, props = {};

            if (cur) {
                rel = active[cur.related];

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

                relPointer = global.gesture.pointer.get(cur.related);
                relPosition = relPointer.position();

                props.scale = scale([cur.start, rel.start], [eventData, relPosition]);
                props.rotation = rotation([cur.start, rel.start], [eventData, relPosition]);

                // todo calc
                global.gesture.trigger(cur.target, 'pinch', props);
            }
        },

        cancel: this.up,

        up: function (pointer, eventData, originalEvent) {
            var cur = active[pointer.id];

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
