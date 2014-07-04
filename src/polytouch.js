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

    global.polyTouch = {
        ppcm: 28 // px per cm, default = 28
    };

    // calculate real pixel per cm
    document.addEventListener('DOMContentLoaded', function () {
        var div = document.createElement('div');
        div.style.width = '1cm';

        var body = document.getElementsByTagName('body')[0];
        body.appendChild(div);

        var ppin = document.defaultView
            .getComputedStyle(div, null)
            .getPropertyValue('width');

        body.removeChild(div);

        global.polyTouch.ppcm = parseFloat(ppin);
    });

}(window));
