/* Global My Lottery Checker object */
var app = app || {};

$(document).ready(function() {
    "use strict";

    var $_btnSaveNumber = $('#save-numbers'),
        $_messageSelectionError = $('.selection-error'),
        $_setOfNumbers = $('.my-numbers'),
        _btnDelete = '.del',
        $_btnDeleteAll = $('#delete-all'),
        $_btnAddNewSet = $('.add-new-numbers'),
        $_btnsNumbersContainer = $('.choose-numbers'),
        $_btnChooseNumber = $('.btn-choose-numbers'),
        $_navProvince = $('li.province'),
        $_navLanguages = $('li.languages'),
        $_navLanguage = $('li.language a'),
        $_btnWrapper = $('.btn-wrapper'),
        $_inputWrapper = $('.input-wrapper'),
        $_guaranteedWrapper = $('.guaranteed-prize-wrapper'),
        $_extraWrapper = $('.extra-wrapper'),
        $_chooseGuaranteed = $('.choose-guaranteed'),
        $_btnSaveGuaranteed = $('#save-guaranteed'),
        $_navRequired = $('[data-require]'),
        $_resetAppLink = $('.reset-app');


    var actionController = function() {
        var that = this;

        $_btnSaveNumber.click(function() {
            that.saveNumbers();
        });

        $_setOfNumbers.on('click', '.del', function(ev) {
            var $elem = $(ev.currentTarget);
            that.deleteSetOfNumbers($elem);
        });

        $_btnDeleteAll.click(function() {
            that.deleteAllSets();
        });

        $_btnWrapper.on('click', '.add-new-guaranteed', function(ev) {
            var $btn = $(ev.currentTarget);
            that.addNewGuaranteed($btn);
        });

        $_btnWrapper.on('click', '.add-new-extra', function(ev) {
            var $btn = $(ev.currentTarget);
            that.addNewExtra($btn);
        });

        $_inputWrapper.on('click', '#save-guaranteed', function() {
            that.saveGuaranteed();
        });

        $_inputWrapper.on('click', '#save-extra', function() {
            that.saveExtra();
        });

        $_extraWrapper.on('click', '#btn-delete-extra', function() {
            that.deleteExtra();
        });

        $_guaranteedWrapper.on('click', '#btn-delete-guaranteed', function() {
            that.deleteGuaranteed();
        });

        $_btnAddNewSet.click(function(ev) {
            var $btn = $(ev.currentTarget);
            that.addNewNumbers($btn);
        });

        $_btnChooseNumber.click(function(ev) {
            var $button = $(ev.currentTarget);
            that.chooseNumbers($button);
        });

        $_navProvince.click(function(ev) {
            var $provinceLi = $(ev.currentTarget);
            that.navigateProvince($provinceLi);
        });

        $_navRequired.click(function(ev) {
            var $link = $(ev.currentTarget),
                require = $link.data('require'),
                province = $link.data('province');

            localStorage.require = require;
            localStorage.province_lotto649 = province;
        });

        $_navLanguages.click(function(ev) { console.log($(ev.currentTarget));
            $(ev.currentTarget).find('ul').toggleClass('is-hidden');
        });

        $_navLanguage.click(function(ev) {
            var $link = $(ev.currentTarget),
                lang = $link.data('lang');

            localStorage.lang = lang;
        });

        $_resetAppLink.click(function() {
            that.resetApp();
        });
    };

    actionController.prototype.saveNumbers = function() {
        var aNumbers = [];

        $('.btn-choose-numbers.btn-success').each(function(i, btn){
            var val = {n: parseInt($(btn).val(), 10), status: false};
            aNumbers.push(val);
        });

        if(aNumbers.length === 6) {
            app.lottery.addNewNumbers(aNumbers);
            app.lottery.compare();
            app.setOfNumbers.render();
            app.billboard.render();
            $_messageSelectionError.addClass('is-hidden');
            $('.btn-choose-numbers.btn-success').removeClass('btn-success').addClass('btn-default');
        }
        else {
            $_messageSelectionError.removeClass('is-hidden');
        }
    };


    actionController.prototype.deleteSetOfNumbers = function(elem) {
        var id = elem.attr('id'),
            index = id.substr(id.lastIndexOf('-')+1);

        if(window.confirm( app.i18n.i18nTranslated.confirm_delete_setOfNumbers )) {
            app.lottery.removeNumbers(index);
            app.setOfNumbers.render();
            app.lottery.compare();
            app.billboard.render();
        };
    };


    actionController.prototype.deleteAllSets = function() {
        if(window.confirm( app.i18n.i18nTranslated.confirm_delete_all )) {
            app.lottery.removeAllNumber();
            app.setOfNumbers.render();
            app.billboard.render();
        }
    };


    actionController.prototype.addNewNumbers = function(btn) {
        if($_btnsNumbersContainer.hasClass('is-hidden')) {
            $_btnsNumbersContainer.removeClass('is-hidden');
            btn.text( app.i18n.i18nTranslated.button_hide );
        }
        else {
            $_btnsNumbersContainer.addClass('is-hidden');
            btn.text( app.i18n.i18nTranslated.button_add_numbers );
        }
    };


    actionController.prototype.addNewExtra = function(btn) {
        if($('.choose-extra').hasClass('is-hidden')) {
            $('.choose-extra').removeClass('is-hidden');
            btn.text( app.i18n.i18nTranslated.button_hide_field );
        }
        else {
            $('.choose-extra').addClass('is-hidden');
            btn.text( app.i18n.i18nTranslated.button_add_extra );
        }
    };


    actionController.prototype.saveExtra = function() {
        var extra = $('#my-extra').val(),
            validate = extra.search(/^\d{7}$/) === 0,
            sort = app.lottery.get('sort');

        function actionAddNewExtra() {
            var aExtra = extra.trim().split(''),
                oExtra = [];

            for(var i = 0; i < aExtra.length; i++) {
                oExtra.push({n: parseInt(aExtra[i], 10), status: false});
            }

            $('.choose-extra .selection-error').addClass('is-hidden');
            app.lottery.addNewExtra(oExtra);
            app.lottery.compareExtra();
            app.extra.render();
            app.billboard.render();
        }

        if(validate) {
            if(localStorage['myExtra_' + sort]) {
                if(window.confirm('If you save this new extra number, you will delete the old one. Are you sure you want proceed?')) {
                    actionAddNewExtra();
                }
            }
            else {
                actionAddNewExtra();
            }
            $('.choose-extra').addClass('is-hidden');
            $('.add-new-extra').text('Add extra');
        }
        else {
            $('.choose-extra .selection-error').removeClass('is-hidden');
        }
    };


    actionController.prototype.deleteExtra = function() {
        if(window.confirm( app.i18n.i18nTranslated.confirm_delete_extra )) {
            app.lottery.removeExtra();
            app.extra.render();
            app.billboard.render();
        }
    };


    actionController.prototype.addNewGuaranteed = function(btn) {
        if($('.choose-guaranteed').hasClass('is-hidden')) {
            $('.choose-guaranteed').removeClass('is-hidden');
            btn.text( app.i18n.i18nTranslated.button_hide_field );
        }
        else {
            $('.choose-guaranteed').addClass('is-hidden');
            btn.text( app.i18n.i18nTranslated.button_add_guaranteed );
        }
    };


    actionController.prototype.saveGuaranteed = function() {
        var guaranteed = $('#my-guaranteed').val(),
            validate = guaranteed.search(/^\d{8}-\d{2}$/) === 0;

        function actionAddNewGuaranteed() {
            var oGuaranteed = {n: guaranteed.trim(), status: false};
            $('.choose-guaranteed .selection-error').addClass('is-hidden');
            app.lottery.addNewGuaranteed(oGuaranteed);
            app.lottery.compareGuaranteed();
            app.guaranteedPrize.render();
            app.billboard.render();
        }

        if(validate) {
            if(localStorage.myGuaranteedNumber_lotto649) {
                if(window.confirm('If you save this new guaranteed prize number, you will delete the old one. Are you sure you want proceed?')) {
                    actionAddNewGuaranteed();
                }
            }
            else {
                actionAddNewGuaranteed();
            }
            $('.choose-guaranteed').addClass('is-hidden');
            $('.add-new-guaranteed').text('Add guaranteed prize');
        }
        else {
            $('.choose-guaranteed .selection-error').removeClass('is-hidden');
        }
    };


    actionController.prototype.deleteGuaranteed = function() {
        if(window.confirm( app.i18n.i18nTranslated.confirm_delete_guaranteed )) {
            app.lottery.deleteGuaranteed();
            app.guaranteedPrize.render();
            app.billboard.render();
        }
    };


    actionController.prototype.chooseNumbers = function(button) {
        if(button.hasClass('btn-default')) {
            button.removeClass('btn-default');
            button.addClass('btn-success');
        }
        else {
            button.addClass('btn-default');
            button.removeClass('btn-success');
        }

        if($('.btn-choose-numbers.btn-success').length > 6) {
            $_messageSelectionError.removeClass('is-hidden');
        }
            else {
            $_messageSelectionError.addClass('is-hidden');
        }
    };


    actionController.prototype.navigateProvince = function(provinceLi) {
        var $list = provinceLi.find('ul');

        if($list.length > 0) {
            if($list.hasClass('is-hidden')) {
                $list.removeClass('is-hidden');
            }
            else {
                $list.addClass('is-hidden');
            }
        }
    };


    actionController.prototype.requireLottery = function() {
        var $list = provinceLi.find('ul');

        if($list.length > 0) {
            if($list.hasClass('is-hidden')) {
                $list.removeClass('is-hidden');
            }
            else {
                $list.addClass('is-hidden');
            }
        }
    };


    actionController.prototype.resetApp = function() {
        if(window.confirm( app.i18n.i18nTranslated.confirm_reset_app )) {
            localStorage.clear();
            window.location.hash = "";
            window.location.reload();
        }
    };

    app.actions = new actionController();

});