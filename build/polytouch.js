/*!
 * PolyTouch 1.0.0
 * git://github.com/PolyTouch/PolyTouch.js.git
 *
 *
 * Copyright 2014 Adobe Systems Incorporated
 * Released under the Apache License v2
 *
 * Author: Damien Antipa
 * Date: 2014-07-07T14:03:15.789Z
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
