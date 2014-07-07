/*
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

    var math = {

        distance: function (start, end) {
            return end - start;
        },

        duration: function (start, end) {
            return end - start;
        }
    };

    global.math = math;

}(window.polyTouch));
