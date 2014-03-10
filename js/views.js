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


    app.SetOfNumber = Backbone.View.extend({
        initialize: function(options) {
            this.model = options.model;
            this.render();
        },

        el: ".my-numbers",

        render: function(){
            var aMyNumbers = this.model.get('myNumbers');

            this.$el.html('<h4>My numbers</h4>');

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

                    var divNumberWrapper = _.template($('#tmp-numbers-wrapper').html(), { index: index, i: i, list: liNumber });

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
                messages = this.model.get('phrases'),
                sort = this.model.get('sort');

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
                list = '<ul>';

            for(var i = 0; i < aLastDraw.length; i++) {
                list += _.template($('#tmp-last-draw').html(), { lastdraw_number: aLastDraw[i], class_bonus: '' });
            }
            list += _.template($('#tmp-last-draw').html(), { lastdraw_number: iBonus, class_bonus: 'class="bonus text-success"' });
            list += '</ul>';

            this.$el.html(list);
            this.$el.prepend(_.template( $('#tmp-data-last-draw').html(), { date: localStorage.dateLastDraw } ));
            this.$el.prepend(_.template( $('#tmp-title-last-draw').html(), { sort: sortTitle }) );
        }
    });

})(jQuery);
