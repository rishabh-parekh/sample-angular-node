var app = angular.module('Twitter', ['ngResource']);

app.controller('TweetList', function($scope, $resource) {
    
    var getTweets = function (paging) {

      var params = {
        action: 'user_timeline',
        user: $scope.username
      };

      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }

      $scope.tweets = $resource('/tweets/:action/:user', params);

      $scope.tweets.query( { }, function (res) {
        
        var i = 1, len = res.length;

        if ($scope.twitterResult && paging) {
          for(i; i < len; i++) {
            $scope.twitterResult.push(res[i]);
          }
        } else {
          $scope.twitterResult = res;
        }

        $scope.maxId = res[res.length - 1].id;
      });
    }

    $scope.getTweets = function () {
      $scope.maxId = undefined;
      getTweets();
    };

    $scope.getMoreTweets = function () {
      getTweets(true);
    };

    getTweets();

});