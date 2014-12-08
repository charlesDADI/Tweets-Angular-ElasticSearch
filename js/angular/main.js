/**
 * Create the module. Set it up to use html5 mode.
 */
window.myTweetSearchEngine = angular.module('myTweetSearchEngine', ['elasticsearch'],
    ['$locationProvider', function($locationProvider){
        $locationProvider.html5Mode(true);
    }]
);
