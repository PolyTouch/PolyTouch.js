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

    var pm = new polyTouch.PointerMap();

    function handleDown(ev) {
        var ret = pm.set(ev.pointerId, ev);
    }

    function handleMove(ev) {
        if (pm.has(ev.pointerId)) {
            pm.set(ev.pointerId, ev);
        }
    }

    function handleUp(ev) {
        pm.remove(ev.pointerId);
    }

    document.addEventListener('pointerdown', handleDown, false);
    document.addEventListener('pointermove', handleMove, false);
    document.addEventListener('pointercancel', handleUp, false);
    document.addEventListener('pointerup', handleUp, false);

    global.gesture = {
        pointermap: pm
    };

}(window.polyTouch));
