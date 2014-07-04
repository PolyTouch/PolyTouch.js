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
