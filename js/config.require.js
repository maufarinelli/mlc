if(typeof localStorage.require === 'undefined') {
    localStorage.require = 'lotto649';
}

if(typeof localStorage.lang === 'undefined') {
    localStorage.lang = 'en';
}

require.config({
    shim: {
        moduleLotteries: {
            exports: 'moduleLotteries'
        },

        // Libraries
        backbone: {
            deps: ['underscore', 'jQuery'],
            exports: 'Backbone'
        },

        // Local files
        'en': {
            deps: ['translation'],
            exports: 'en'
        },
        'fr': {
            deps: ['translation'],
            exports: 'fr'
        },

        // Core
        'core649': {
            deps: ['Backbone'],
            exports: 'core649'
        },

        // Lotteries sort
        'lotto649': {
            deps: ['core649'],
            exports: 'lotto649'
        },
        'quebec49': {
            deps: ['core649'],
            exports: 'quebec49'
        },

        // Views
        'views': {
            deps: [localStorage.require],
            exports: 'views'
        },

        // Instances Lottos
        'instance_lotto649': {
            deps: ['views'],
            exports: 'instance_lotto649'
        },
        'instance_quebec49': {
            deps: ['views'],
            exports: 'instance_quebec49'
        },

        // Instances Views
        'instances_views': {
            deps: ['instance_' + localStorage.require],
            exports: 'instances_views'
        },

        // Actions controller
        'actions': {
            deps: ['instances_views'],
            exports: 'actions'
        },

        // Translation
        'translation': {
            deps: ['actions'],
            exports: 'translation'
        }
    },
    paths: {
        moduleLotteries: 'require/moduleLotteries',
        jquery: 'external/jquery-1.10.2.min',
        lodash: 'external/lodash.compat.min',
        backbone: 'external/backbone.1.0.0',
        translation: 'translation',
        en: 'locales/en',
        fr: 'locales/fr',
        core649: 'models/core649',
        'lotto649': 'models/lottery649',
        'quebec49': 'models/quebec49',
        'views': 'views/views',
        'instance_lotto649': 'instances/instance_lotto649',
        'instance_quebec49': 'instances/instance_quebec49',
        'instances_views': 'instances/instances_views',
    },
});

require(['moduleLotteries'], function(moduleLotteries) {

});