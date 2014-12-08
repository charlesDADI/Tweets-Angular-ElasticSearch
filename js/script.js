/**
 * Create the module. Set it up to use html5 mode.
 */
window.myTweetSearchEngine = angular.module('myTweetSearchEngine', ['elasticsearch'],
    ['$locationProvider', function($locationProvider){
        $locationProvider.html5Mode(true);
    }]
);

/**
 * Create a service to power calls to Elasticsearch. We only need to
 * use the _search endpoint.
 */
myTweetSearchEngine.factory('tweetsService',
    ['$q', 'esFactory', '$location', function($q, elasticsearch, $location){
        var client = elasticsearch({
            host: $location.host() + ":9200"
        });

        /**
         * Given a term and an offset, load another round of 10 tweets.
         *
         * Returns a promise.
         */
        var search = function(term, offset){
            var deferred = $q.defer();
            var query = {
                "match": {
                    "_all": term
                }
            };

            // client.search({
            //     "index": 'tweets',
            //     "type": 'recipe',
            //     "body": {
            //         "size": 10,
            //         "from": (offset || 0) * 10,
            //         "query": query
            //     }
            client.search({
                "index": 'my-tweets',
                "type": 'tweet',
                "body": {
                    "size": 1000,
                    "from": (offset || 0) * 1000,
                    "query": query
                }
            }).then(function(result) {
                var ii = 0, hits_in, hits_out = [];
                hits_in = (result.hits || {}).hits || [];
                console.log(hits_in)
                for(;ii < hits_in.length; ii++){
                    hits_out.push(hits_in[ii]._source);
                }
                deferred.resolve(hits_out);
            }, deferred.reject);

            return deferred.promise;
        };


        return {
            "search": search
        };
    }]
);

/**
 * Create a controller to interact with the UI.
 */
myTweetSearchEngine.controller('tweetsCtrl',
    ['tweetsService', '$scope', '$location', function(tweets, $scope, $location){
        // Provide some nice initial choices
        var initChoices =  ['photography','luxury','stats','bigdata','ekimetrics',
              'sport','fashion','multimedia','machinelearning','math'] ;
        var idx = Math.floor(Math.random() * initChoices.length);

        // Initialize the scope defaults.
        $scope.tweets = [];        // An array of tweets results to display
        $scope.page = 0;            // A counter to keep track of our current page
        $scope.allResults = false;  // Whether or not all results have been found.


        $scope.sortChoice='-user.expert';
        $scope.sortoptions=[
            {label:'Followers count Down',key:'-user.followers_count'},
            {label:'Followers count Up',key:'user.followers_count'},
            {label:'Screen Name A-Z',key:'user.screen_name'},
            {label:'Screen Name Z-A',key:'-user.screen_name'}
        ];

        // And, a random search term to start if none was present on page load.
        $scope.searchTerm = $location.search().q || initChoices[idx];

        /**
         * A fresh search. Reset the scope variables to their defaults, set
         * the q query parameter, and load more results.
         */
        $scope.search = function(){
            $scope.page = 0;
            $scope.tweets = [];
            $scope.allResults = false;
            $location.search({'text': $scope.searchTerm});
            $scope.loadMore();
        };



        /**
         * Load the next page of results, incrementing the page counter.
         * When query is finished, push results onto $scope.tweets and decide
         * whether all results have been returned (i.e. were 10 results returned?)
         */
        $scope.loadMore = function(){
            tweets.search($scope.searchTerm, $scope.page++).then(function(results){
                if(results.length !== 10){
                    $scope.allResults = true;
                }

                var ii = 0;
                for(;ii < results.length; ii++){
                    $scope.tweets.push(results[ii]);
                }
            });
        };

        // Load results on first run
        $scope.loadMore();
    }]
);
