/*global Backbone */
var app = app || {};

/* Model Lottery649 */
(function($) {
    "use strict";

    app.Lottery649 = app.Core649.extend({

        default: {
            // Which lotto
            sort: 'lotto649',

            province: '',

            //An array of integers. The format of lastDraw: [6, 26, 41, 42, 47, 48],
            lastDraw: [],

            guaranteedLastDraw: '',

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

            /* An array of objects
            This is the format
            [
                { n: 1, status: false },
                { n: 2, status: false },
                { n: 3, status: false },
                { n: 4, status: true },
                { n: 5, status: true },
                { n: 6, status: true },
                { n: 7, status: true }
            ]*/
            myExtra: {},

            // The Guaranteed Prize in the format { n: '00000000-00', status: false }
            myGuaranteedNumber: {},

            // The messages, depending on how many numbers you matched
            phrases: {},

            // A flag property. We use ajax to get the last draw, when it is not saved on localStorage. We set it as true when we have last draw to start comparing our numbers
            readyLastDraw: false,
        },

        // If we have already some set of numbers saved on localStorage, we get it and set it before get the last draw
        initialize: function() {
            // set myNumbers
            if(localStorage.myNumbers_lotto649) {
                var myNumbers = JSON.parse(localStorage.myNumbers_lotto649);
                this.set({'myNumbers': myNumbers});
            }
            else {
                this.set({'myNumbers': []});
            }

            // set myGuaranteedNumber
            if(localStorage.myGuaranteedNumber_lotto649) {
                var myGuaranteedNumber = JSON.parse(localStorage.myGuaranteedNumber_lotto649);
                this.set({'myGuaranteedNumber': myGuaranteedNumber});
            }
            else {
                this.set({'myGuaranteedNumber': {}});
            }

            // set province
            if(localStorage.province_lotto649 && typeof localStorage.province_lotto649 !== 'undefined') {
                var province = localStorage.province_lotto649;
                this.set({'province': province});
            }
            else {
                this.set({'province': 'qc'});
            }

            // set myExtra
            if(localStorage.myExtra_lotto649) {
                var myExtra = JSON.parse(localStorage.myExtra_lotto649);
                this.set({'myExtra': myExtra});
            }
            else {
                this.set({'myExtra': {}});
            }

            this.set({
                'sort': 'lotto649', // Which lotto
                'sortTitle': 'Lotto 649', // Title of this lottery
                'lastDraw': [], //An array of integers. The format of lastDraw: [6, 26, 41, 42, 47, 48],
                'dateLastDraw': '', // Last draw's date written
                'bonusLastDraw': '', // The bonus number of this last draw
                'shortdateLastDraw': '', // Last draw's date in a yyyy-mm-dd format
                'extraLastDraw': '', // Extra of last draw in a 0000000 format
                'guaranteedLastDraw': '', // The guaranteed prize of the last draw
            });

            this.getLastDraw();
        },

        /**
        * Add a new guaranteed prize numbers
        * @param {string} newGuaranteed - the guaranteed prize number in a string format
        **/
        addNewGuaranteed: function(newGuaranteed) {
            var sort = this.get('sort');

            this.set({'myGuaranteedNumber': newGuaranteed});
            localStorage['myGuaranteedNumber_'+ sort] = JSON.stringify(this.get('myGuaranteedNumber'));
        },

        /**
        * Remove guaranteed prize numbers
        **/
        deleteGuaranteed: function() {
            var sort = this.get('sort');

            this.set({'myGuaranteedNumber': {}});
            localStorage.removeItem('myGuaranteedNumber_'+ sort);
        },

        /**
        * Compare Guaranteed Prize
        **/
        compareGuaranteed: function() {
            var sort = this.get('sort'),
                myGuaranteedNumber = this.get('myGuaranteedNumber'),
                lastDraw = this.get('lastDraw');

            if(myGuaranteedNumber.n === localStorage['guaranteedLastDraw_' + sort]) {
                myGuaranteedNumber.status = true;
            }
            else {
                myGuaranteedNumber.status = false;
            }

            this.set({'myGuaranteedNumber': myGuaranteedNumber});
            localStorage['myGuaranteedNumber_' + sort] = JSON.stringify(this.get('myGuaranteedNumber'));
        }

    });
})(jQuery);
