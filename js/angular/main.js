/**
 * Create the module. Set it up to use html5 mode.
 */
window.MyOpenRecipes = angular.module('myOpenRecipes', ['elasticsearch'],
    ['$locationProvider', function($locationProvider){
        $locationProvider.html5Mode(true);
    }]
);
