/*global Backbone */
var app = app || {};

(function() {

    // object that will contain all i18n stuffs
    app.i18n = {};

    app.i18n.i18nTranslated = {};

    app.i18n.construct = function(dict) {
        "use strict";

        for( var i in dict ){
            if( dict.hasOwnProperty(i) ){
                app.i18n.i18nTranslated[i] = dict[i];
            }
        }
    };


    app.i18n.translate = function() {
        $('[data-i18n]').each(function(idx, elem) {
            var key = $(elem).data('i18n');
            var text = app.i18n.i18nTranslated[key];

            $(elem).text(text);
        });
    };

}());