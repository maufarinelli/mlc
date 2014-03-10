/*global Backbone */
var app = app || {};

/* Model Quebec49 */
(function($) {
    "use strict";

    app.LotteryQuebec49 = app.Core649.extend({

        default: {
            // Which lotto
            sort: 'quebec49',

            /* An array of objects
            This is the format
            [
                { n: 8, status: false },
                { n: 13, status: false },
                { n: 25, status: false },
                { n: 26, status: true },
                { n: 41, status: true },
                { n: 42, status: true }
            ]*/
            myNumbers: [],

            myExtra: {},

            //An array of integers. The format of lastDraw: [6, 26, 41, 42, 47, 48],
            lastDraw: [],

            // The messages, depending on how many numbers you matched
            phrases: {},

            // A flag property. We use ajax to get the last draw, when it is not saved on localStorage. We set it as true when we have last draw to start comparing our numbers
            readyLastDraw: false,
        },

        // If we have already some set of numbers saved on localStorage, we get it and set it before get the last draw
        initialize: function() {
            // set myNumber
            if(localStorage.myNumbers_quebec49) {
                var myNumbers = JSON.parse(localStorage.myNumbers_quebec49);
                this.set({'myNumbers': myNumbers});
            }
            else {
                this.set({'myNumbers': []});
            }

            // set myExtra
            if(localStorage.myExtra_quebec49) {
                var myExtra = JSON.parse(localStorage.myExtra_quebec49);
                this.set({'myExtra': myExtra});
            }
            else {
                this.set({'myExtra': {}});
            }

            this.set({
                'sort': 'quebec49', // Which lotto
                'sortTitle': 'Québec 49', // Title of this lottery
                'lastDraw': [], //An array of integers. The format of lastDraw: [6, 26, 41, 42, 47, 48],
                'dateLastDraw': '', // Last draw's date written
                'bonusLastDraw': '', // The bonus number of this last draw
                'shortdateLastDraw': '', // Last draw's date in a yyyy-mm-dd format
                'extraLastDraw': '', // Extra of last draw in a 0000000 format
            });

            this.getLastDraw();
        }
    });

})(jQuery);
