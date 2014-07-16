var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function($scope, $resource, $sce) {

    var getTweets = function (paging) {

      $scope.username = "TwitterDev";

      var params = {
        action: 'user_timeline',
        user: $scope.username
      };

      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }

      // create tweet resource
      $scope.tweets = $resource('/tweets/:action/:user', params);

      // GET request using the resource
      $scope.tweets.query( { }, function (res) {
        
        var twtDate, now = new Date();
        i = 0, len = res.length;

        // change the date format with moment.js depending on how long ago it was
        for(i; i < len; i++) {
          twtDate = moment(new Date(res[i].created_at));

          if (twtDate.diff(now, 'hours') > -24) {
            res[i].created_at = twtDate.fromNow()
          } else {
            res[i].created_at = twtDate.format('MMM D, YYYY h:mm a')
          }
        }

        // add tweets to model
        if (paging) {
          for(i = 1; i < len; i++) {
            $scope.tweetsResult.push(res[i]);
          }
        } else {
          $scope.tweetsResult = res;
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