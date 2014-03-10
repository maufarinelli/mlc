/*global Backbone */
var app = app || {};

/* Views */
(function($) {
    "use strict";

    app.InitialContent = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        el: ".content",

        render: function() {
            var tmpInitial = _.template($('#tmp-initial-content').html(), {});
            this.$el.html(tmpInitial);
        }
    });


    app.ExtraBtn = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        el: ".btn-wrapper",

        render: function() {
            var tmpExtraBtn = _.template($('#tmp-extra-btn').html(), {});
            this.$el.html(tmpExtraBtn);
        }
    });


    app.ExtraInput = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        el: ".input-wrapper",

        render: function() {
            var tmpExtraInput = _.template($('#tmp-extra-input').html(), {});
            this.$el.html(tmpExtraInput);
        }

    });


    app.Extra = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        el: ".extra-wrapper",

        render: function() {
            var myExtra = this.model.get('myExtra'),
                province = this.model.get('province'),
                tmpExtra;

            if( !$.isEmptyObject(myExtra) ) {
                tmpExtra = _.template($('#tmp-extra-wrapper').html(), {extra: myExtra, title: app.i18n.i18nTranslated.extra_title[province], btn_del: app.i18n.i18nTranslated.button_delete });

                this.$el.html(tmpExtra);
            }
            else {
                this.$el.html({});
            }
        }
    });


    app.GuaranteedBtn = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        el: ".btn-wrapper",

        render: function() {
            var tmpGuaranteedBtn = _.template($('#tmp-guaranteed-btn').html(), {});
            this.$el.append(tmpGuaranteedBtn);
        }
    });


    app.GuaranteedInput = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        el: ".input-wrapper",

        render: function() {
            var tmpGuaranteedInput = _.template($('#tmp-guaranteed-input').html(), {});
            this.$el.append(tmpGuaranteedInput);
        }
    });


    app.GuaranteedPrize = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        el: ".guaranteed-prize-wrapper",

        render: function() {
            var myGuaranteed = this.model.get('myGuaranteedNumber'),
                tmpGuaranteed;

            if( !$.isEmptyObject(myGuaranteed) ) {
                if(myGuaranteed.status === true) {
                    tmpGuaranteed = _.template($('#tmp-guaranteed-wrapper-winner').html(), {guaranteed: myGuaranteed.n, title: app.i18n.i18nTranslated.guaranteed_title, btn_del: app.i18n.i18nTranslated.button_delete});
                }
                else {
                    tmpGuaranteed = _.template($('#tmp-guaranteed-wrapper').html(), {guaranteed: myGuaranteed.n, title: app.i18n.i18nTranslated.guaranteed_title, btn_del: app.i18n.i18nTranslated.button_delete });
                }


                this.$el.html(tmpGuaranteed);
            }
            else {
                this.$el.html({});
            }
        }
    });


    app.SetOfNumber = Backbone.View.extend({
        initialize: function(options) {
            this.model = options.model;
            this.render();
        },

        el: ".my-numbers",

        render: function(){
            var aMyNumbers = this.model.get('myNumbers');

            this.$el.html( _.template($('#tmp-numbers-title').html(), {}) );

            if( typeof aMyNumbers !== 'undefined' ) {
                for(var i = 0; i < aMyNumbers.length; i++) {
                    var index = i+1,
                        liNumber = '',
                        eachNumberTmpl;

                    var set = aMyNumbers[i];
                    for(var j = 0; j < set.length; j++) {
                        if(set[j].n.toString().length === 1) {
                            eachNumberTmpl = '0'+set[j].n;
                        }
                        else {
                            eachNumberTmpl = set[j].n;
                        }

                        if(set[j].status === true){
                            liNumber += _.template($('#tmp-numbers-li-win').html(), {number: eachNumberTmpl});
                        }
                        else {
                            liNumber += _.template($('#tmp-numbers-li').html(), {number: eachNumberTmpl} );
                        }
                    }

                    var divNumberWrapper = _.template($('#tmp-numbers-wrapper').html(), { index: index, i: i, list: liNumber, btn_del: app.i18n.i18nTranslated.button_delete });

                    this.$el.append( divNumberWrapper );
                }
            }
        }

    });


    app.Billboard = Backbone.View.extend({
        initialize: function(options) {
            this.model = options.model;
            this.render();
        },

        el: ".billboard",

        render: function() {
            this.$el.html('');

            var myNumbers = this.model.get('myNumbers'),
                myExtra = this.model.get('myExtra'),
                myGuaranteedNumber = this.model.get('myGuaranteedNumber'),
                messages = this.model.get('phrases'),
                sort = this.model.get('sort');

            // For myNumbers Messages
            for(var i = 0; i < myNumbers.length; i++) {
                var iCompare = 0;

                for(var j = 0; j < myNumbers[i].length; j++) {
                    if(myNumbers[i][j].status === true) {
                        iCompare++;
                    }
                }

                if(iCompare === 2 || iCompare === 5) {
                    var bonus = localStorage.bonusLastDraw;

                    for(var j = 0; j < myNumbers[i].length; j++) {
                        if(myNumbers[i][j].n === bonus) {
                            iCompare += 'C';
                        }
                    }

                }

                if(typeof messages[iCompare] !== 'undefined') {
                    var index = i+1;
                    this.$el.append( _.template( $('#tmp-billboard-paragraph').html(), {message: messages[iCompare].format(index)} ));
                }
            }


            // for myExtra messages

            var iReverseExtraIndex = 6;
            /**
            * Recursive function to fill aInverse
            **/
            function recurInverseMessage() {
                if (iReverseExtraIndex === -1) {
                    return;
                }
                else if(myExtra[iReverseExtraIndex].status === true) {
                    iReverseExtraCompare++;
                    iReverseExtraIndex--;
                    recurInverseMessage();
                }
                else {
                    return;
                }
            }

            var iExtraIndex = 0;
            /**
            * Recursive function to fill aNormal
            **/
            function recurNormalMessage() {
                if(iExtraIndex === myExtra.length) {
                    return;
                }
                else if(myExtra[iExtraIndex].status === true) {
                    iExtraCompare++;
                    iExtraIndex++;
                    recurNormalMessage();
                }
                else {
                    return;
                }
            }


            if(!$.isEmptyObject(myExtra)) {
                var iExtraCompare = 0;
                var iReverseExtraCompare = 0;
                if(myExtra[0].status === true && myExtra[6].status === true) {
                    recurNormalMessage();

                    var messageIdx = iExtraCompare;
                        messageIdx += 'Extra';

                    if(messageIdx !== '1Extra') {
                        this.$el.append( _.template( $('#tmp-billboard-paragraph').html(), {message: messages[messageIdx]} ));
                    }
                }
                else if(myExtra[6].status === true) {
                    recurInverseMessage();

                    var messageInverseIdx = iReverseExtraCompare;
                        messageInverseIdx += 'ExtraI';
                    this.$el.append( _.template( $('#tmp-billboard-paragraph').html(), {message: messages[messageInverseIdx]} ));
                }
                else if(myExtra[0].status === true) {
                    recurNormalMessage();

                    var messageNormalIdx = iExtraCompare;
                        messageNormalIdx += 'Extra';

                    if(messageNormalIdx !== '1Extra') {
                        this.$el.append( _.template( $('#tmp-billboard-paragraph').html(), {message: messages[messageNormalIdx]} ));
                    }
                }
            }

            // check guaranteed prize to see if need to show its message
            if(typeof myGuaranteedNumber !== 'undefined' && myGuaranteedNumber.status === true) {
                this.$el.append( _.template( $('#tmp-billboard-paragraph').html(), {message: messages.guaranteed} ));
            }

        }
    });


    app.LastDraw = Backbone.View.extend({
        initialize: function(options){
            this.model = options.model;
            this.render();
        },

        el: '.last-draw',

        render: function() {
            this.$el.html('');

            var sort = this.model.get('sort'),
                sortTitle = this.model.get('sortTitle'),
                aLastDraw = localStorage['lastDraw_' + sort] ? JSON.parse(localStorage['lastDraw_' + sort]) : this.model.get('lastDraw'),
                iBonus = localStorage['bonusLastDraw_' + sort],
                sExtra = localStorage['extraLastDraw_' + sort],
                sGuaranteedLastDraw = localStorage['guaranteedLastDraw_' + sort],
                province = this.model.get('province'),
                list = '<ul>';

            for(var i = 0; i < aLastDraw.length; i++) {
                list += _.template($('#tmp-last-draw').html(), { lastdraw_number: aLastDraw[i], class_bonus: '' });
            }
            list += _.template($('#tmp-last-draw').html(), { lastdraw_number: iBonus, class_bonus: 'class="bonus text-success"' });
            list += '</ul>';

            this.$el.html(list);
            this.$el.prepend(_.template( $('#tmp-data-last-draw').html(), { date: localStorage['dateLastDraw_' + sort] } ));
            this.$el.prepend(_.template( $('#tmp-title-last-draw').html(), { title: app.i18n.i18nTranslated.lastdraw_title, sort: sortTitle }) );
            this.$el.append(_.template( $('#tmp-extra-last-draw').html(), { title: app.i18n.i18nTranslated.extra_title[province] , extra: sExtra}) );

            if(typeof sGuaranteedLastDraw !== 'undefined') {
                this.$el.append(_.template( $('#tmp-guaranteed-last-draw').html(), { title: app.i18n.i18nTranslated.guaranteed_title, guaranteed: sGuaranteedLastDraw}) );
            }
        }
    });

})(jQuery);
