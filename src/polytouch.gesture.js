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
            var data;

            switch (ev.type) {
                case 'pointerdown':
                    data = pm.set(ev.pointerId, ev);
                    break;
                case 'pointermove':
                    if (pm.has(ev.pointerId)) {
                        data = pm.set(ev.pointerId, ev);
                    }
                    break;
                case 'pointercancel':
                case 'pointerup':
                    data = pm.remove(ev.pointerId);
                    break;
            }

            if (data) {
                this._dispatch(data, ev);
            }
        },

        _dispatch: function (eventData, originalEvent) {
            var fn;

            for (var i=0; i < this._recognizer.length; i++) {
                fn = this._recognizer[i][eventData.type];

                fn && fn(eventData, originalEvent);
            }
        },

        register: function (def) {
            this._recognizer.push(def);
        }
    };

}(window.polyTouch));
