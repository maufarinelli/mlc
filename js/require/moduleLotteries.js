(function() {
    function requireLangEn() {
        require(['en'], function(en) {});
    }

    function requireLangFr() {
        require(['fr'], function(fr) {});
    }

    function requireLotto649() {
        require([
            'Backbone',
            'general',
            'lotto649',
            'views',
            'instance_lotto649',
            'instances_views',
            'actions'
            ], function(Backbone, general, lottery649, views, instanceLotto649, instancesViews, actions) {
        });
    }

    function requireQuebec49() {
        require([
            'Backbone',
            'general',
            'quebec49',
            'views',
            'instance_quebec49',
            'instances_views',
            'actions'
            ], function(Backbone, general, quebec49, views, instanceQuebec49, instancesViews, actions) {
        });
    }

    function init() {

        //language
        if(typeof localStorage.lang === 'undefined') {
            localStorage.lang = 'en';
            requireLangEn();
        }
        else if(localStorage.lang === 'fr') {
            requireLangFr();
        }
        else {
            requireLangEn();
        }

        if(typeof localStorage.require === 'undefined') {
            localStorage.require = 'lotto649';
            requireLotto649();
        }

        else if(localStorage.require === 'quebec49') {
            requireQuebec49();
        }

        else {
            localStorage.require = 'lotto649';
            requireLotto649();
        }

    }

    init();


})();
