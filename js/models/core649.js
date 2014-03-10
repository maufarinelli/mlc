/*global Backbone */
var app = app || {};

/**
* The core model of Lotto 649 / Québec 49.
**/
(function($) {
    'use strict';

    app.Core649 = Backbone.Model.extend({

        /**
        * Add a new set of numbers
        * @param {array} newNumbers - array with a set of numbers
        **/
        addNewNumbers: function(newNumbers) {
            var myNumbers = this.get('myNumbers'),
                sort = this.get('sort');

            myNumbers.push(newNumbers);
            this.set({'myNumbers': myNumbers});

            localStorage['myNumbers_'+ sort] = JSON.stringify(this.get('myNumbers'));
        },

        /**
        * Delete a set of numbers
        * @param {int} idx - the set of numbers' index we need to delete from myNumbers array
        **/
        removeNumbers: function(idx) {
            var myNumbers = this.get('myNumbers'),
                sort = this.get('sort');

            myNumbers.splice(idx, 1);
            this.set({'myNumbers': myNumbers});
            localStorage['myNumbers_'+ sort] = JSON.stringify(this.get('myNumbers'));
        },

        // To delete all set of numbers.
        removeAllNumber: function() {
            var sort = this.get('sort');
            localStorage.removeItem('myNumbers_'+ sort);
            this.set({'myNumbers': []});
        },

        /**
        * Add a new extra number
        * @param {string} newExtra - string with extra number
        **/
        addNewExtra: function(newExtra) {
            var sort = this.get('sort');

            this.set({'myExtra': newExtra});
            localStorage['myExtra_'+ sort] = JSON.stringify(this.get('myExtra'));
        },

        /**
        * Delete an extra number
        **/
        removeExtra: function() {
            var sort = this.get('sort');

            this.set({'myExtra': {}});
            localStorage.removeItem('myExtra_'+ sort);
        },

        /**
        * To get the last draw
        **/
        getLastDraw: function() {
            var model = this,
                sort = this.get('sort'),

                date = new Date(),
                day = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate(),
                month = date.getMonth().toString().length == 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                dataformated = date.getFullYear() +''+ month +''+ day;

            if(typeof localStorage['lastDraw_' + sort] !== 'undefined' && typeof localStorage['shortdateLastDraw_' + sort] !== 'undefined') {
                var howManyDays = dataformated - localStorage['shortdateLastDraw_' + sort].replace(/-/g, '');

                // Sunday after 23h
                if(howManyDays === 3 && date.getDay() === 6 && date.getHours() >= 23) {
                    this._ajaxCallLastDraw(model);
                }
                // Monday and the user has not check it sunday
                else if(howManyDays === 4 && date.getDay() === 0) {
                    this._ajaxCallLastDraw(model);
                }
                // Wednesday after 23h
                else if(howManyDays === 4 && date.getDay() !== 0 && date.getHours() >= 23) {
                    this._ajaxCallLastDraw(model);
                }
                // More the 5 days without consult
                else if (howManyDays >= 5) {
                    this._ajaxCallLastDraw(model);
                }
                // Otherwise, Last Draw is in localStorage
                else {
                    model.set({'readyLastDraw': true});
                }
            }
            else {
                this._ajaxCallLastDraw(model);
            }

        },

        _ajaxCallLastDraw: function(model) {
            var url = 'http://farinelliwebdesign.com/lottery/lotto649/lastdraw_649.php',
                lastdraw = this.get('lastDraw'),
                sort = this.get('sort');

            $.ajax({
                url: url,
                type: 'GET',
                success: function(data) {
                    var decoded = JSON.parse(data);
                    var sorted = decoded[sort];

                    for(var i=0; i < 6; i++) {
                        lastdraw.push( parseInt(sorted['Number'+i], 10));
                    }

                    function lastDrawCreateLocalStorage() {
                        model.set({'lastDraw': lastdraw});
                        model.set({'dateLastDraw': sorted.Date});
                        model.set({'shortdateLastDraw': sorted.Shortdate});
                        model.set({'bonusLastDraw': sorted.Bonus});
                        model.set({'extraLastDraw': sorted.Extra.slice(0, 7)});

                        localStorage['lastDraw_' + sort] = JSON.stringify( model.get('lastDraw'));
                        localStorage['bonusLastDraw_' + sort] = model.get('bonusLastDraw');
                        localStorage['shortdateLastDraw_' + sort] = model.get('shortdateLastDraw');
                        localStorage['dateLastDraw_' + sort] = model.get('dateLastDraw');
                        localStorage['extraLastDraw_'+ sort] = model.get('extraLastDraw');

                        if(sorted.Guaranteed) {
                            model.set({'guaranteedLastDraw': sorted.Guaranteed.trim()});
                            localStorage['guaranteedLastDraw_' + sort] = model.get('guaranteedLastDraw');
                        }

                    }

                    // If there is no lastDraw on localStorage, we set and create it
                    if( typeof localStorage['lastDraw_' + sort] === 'undefined') {
                        lastDrawCreateLocalStorage();
                    }
                    // If we receive the same numbers that we have on localStorage, it means that website if new numbers is not updated yet.
                    // In this case, there is no last draw yet, so we do not update anything for it
                    else if( !lastdraw.compare(JSON.parse(localStorage['lastDraw_' + sort])) ) {
                        lastDrawCreateLocalStorage();
                    }

                    model.set({'readyLastDraw': true});
                },
                error: function(data, errorString) {
                    if(errorString) {
                        window.alert('An error occurred and the last draw has not be fetched. Please check your internet connection.');
                    }
                }
            });
        },

        compare: function() {
            var sort = this.get('sort'),
                myNumbers = this.get('myNumbers'),
                lastDraw = this.get('lastDraw');

            if(localStorage['myNumbers_' + sort]){
                myNumbers = JSON.parse(localStorage['myNumbers_' + sort]);
            }

            if(localStorage['lastDraw_' + sort]) {
                lastDraw = JSON.parse(localStorage['lastDraw_' + sort]);
            }

            for(var i = 0; i < myNumbers.length; i++) {

                for(var j = 0; j < myNumbers[i].length; j++) {
                    myNumbers[i][j].status = false;

                    for(var l = 0; l < lastDraw.length; l++) {
                        if(myNumbers[i][j].n === lastDraw[l]) {
                            myNumbers[i][j].status = true;
                        }
                    }
                }
            }

            this.set({'myNumbers': myNumbers});
            localStorage['myNumbers_' + sort] = JSON.stringify(this.get('myNumbers'));
        },

        compareExtra: function() {
            var sort = this.get('sort'),
                myExtra = this.get('myExtra'),
                aExtraLastDraw = localStorage['extraLastDraw_' + sort].split('');

            // Comparing with aExtraLastDraw
            for(var i = 0; i < aExtraLastDraw.length; i++) {
                if(parseInt(myExtra[i].n, 10) === parseInt(aExtraLastDraw[i], 10)) {
                    myExtra[i].status = true;
                }
                else {
                    myExtra[i].status = false;
                }
            }

            /**
            * Arrays to compare Extra
            **/

            // Array to be filled from 0 to 6, index start from 0
            var aNormal = [],
                idx = 0,

                // Array to be filled from 6 to 0, index start from 6
                aInverse = [],
                inverseIdx = myExtra.length - 1;


            /**
            * Recursive function to fill aInverse
            **/
            function recurInverseEvaluate() {
                if (inverseIdx === -1) {
                    return;
                }
                else if(myExtra[inverseIdx].status === true) {
                    aInverse.push(inverseIdx);
                    inverseIdx--;
                    recurInverseEvaluate();
                }
                else {
                    return;
                }
            }

            /**
            * Recursive function to fill aNormal
            **/
            function recurNormalEvaluate() {
                if(idx === myExtra.length) {
                    return;
                }
                else if(myExtra[idx].status === true) {
                    aNormal.push(idx);
                    idx++;
                    recurNormalEvaluate();
                }
                else {
                    return;
                }
            }

            recurInverseEvaluate();
            recurNormalEvaluate();

            /**
            * Comparing both arrays. The one that has less values, it means we have matched more numbers in another sense.
            * Ex: aNormal has 4 values and aInverse has 2. So as the prize is better for 4 numbers matched, we set a false the numbers of the other sense.
            * Note: if we have equal length for both array, we can have 3 = 3, 0 = 0 or the full number 7 = 7. In those cases we keep true of those numbers
            **/
            if(aNormal.length > aInverse.length) {
                for (var j = 0; j < aInverse.length; j++) {
                    myExtra[aInverse[j]].status = false;
                }

                // To the case of we have the 6th number as true, we need to put it a false
                if(aInverse.length === 0 && aNormal.length !== 6 && myExtra[5].status === true) {
                    myExtra[5].status = false;
                }
            }
            else if(aInverse.length > aNormal.length) {
                for (var l = 0; l < aNormal.length; l++) {
                    myExtra[aNormal[l]].status = false;
                }

                // To the case of we have the 2nd number as true, we need to put it a false
                if(aNormal.length === 0 && aInverse.length !== 6 && myExtra[1].status === true) {
                    myExtra[1].status = false;
                }
            }

            this.set({'myExtra': myExtra});
            localStorage['myExtra_' + sort] = JSON.stringify(this.get('myExtra'));
        }

    });

})(jQuery);
