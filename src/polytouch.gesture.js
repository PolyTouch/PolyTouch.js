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

    function GestureRecognizer() {
        this._recognizer = [];
        this.pointer = new polyTouch.PointerMap();

        this._handleEvent = this._handleEvent.bind(this);

        document.addEventListener('pointerdown', this._handleEvent, false);
        document.addEventListener('pointermove', this._handleEvent, false);
        document.addEventListener('pointercancel', this._handleEvent, false);
        document.addEventListener('pointerup', this._handleEvent, false);

    }

    GestureRecognizer.prototype = {

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

                fn && fn(pointer, eventData, originalEvent);
            }
        },

        trigger: function (target, type, data) {
            var ev = new CustomEvent(type, {
                detail: data || {},
                bubbles: true,
                cancelable: true
            });

            target.dispatchEvent(ev);
        },

        register: function (def) {
            this._recognizer.push(def);
        }
    };

    global.gesture = new GestureRecognizer();

}(window.polyTouch));
