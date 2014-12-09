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
        var search = function(term, offset, type){
            console.log(term);
            console.log(offset);
            console.log(type);
          var deferred = $q.defer();

          var query_loc ={"match":{"tweet.user.location":"paris"}}
             var query ={
                "index": 'my-tweets',
                "type": 'tweet',
                "body": {
                    "size": 100,
                    "from": (offset || 0) * 1000,
                    "query": {"match": {"_all": term}}
                }
            }

             var query_loc ={
                "index": 'my-tweets',
                "type": 'tweet',
                "body": {
                    "size": 100,
                    "from": (offset || 0) * 1000,
                    "query": {"match":{"tweet.user.location":term}}
                }
            }

            if (type=='location') {var query = query_loc} else{var query2 = query};

            client.search(query).then(function(result) {
                console.log(query_loc)
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
        var initChoices =  [
                            'photography',
                            'luxury',
                            'stats',
                            'bigdata',
                            'ekimetrics',
                            'sport',
                            'fashion',
                            'multimedia',
                            'machinelearning',
                            'math'
                            ];

        var idx = Math.floor(Math.random() * initChoices.length);

        // Initialize the scope defaults.
        $scope.tweets = [];        // An array of tweets results to display
        $scope.page = 0;            // A counter to keep track of our current page
        $scope.allResults = false;  // Whether or not all results have been found.
        $scope.searchTerm = 'Ekimetrics'
        $scope.LimitFaved = 5;
        $scope.sortChoice='-user.expert';
        $scope.sortoptions=[
            {label:'Followers count Down',key:'-user.followers_count'},
            {label:'Followers count Up',key:'user.followers_count'},
            {label:'Screen Name A-Z',key:'user.screen_name'},
            {label:'Screen Name Z-A',key:'-user.screen_name'}
        ];

        $scope.type = 'keyword'
        $scope.changekwd=function(){
            $scope.searchTerm = '';
        }


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
            tweets.search($scope.searchTerm, $scope.page++, $scope.type ).then(function(results){
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
