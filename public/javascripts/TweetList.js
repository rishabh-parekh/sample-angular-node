var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function($scope, $resource, $timeout) {

    /**
     * init controller and set defaults
     */
    function init () {

      // set a default username value
      $scope.username = "Weather";
      $scope.search = "snow";
      
      // empty tweet model
      $scope.tweetsResult = [];

      // initiate masonry.js
      $scope.msnry = new Masonry('#tweet-list', {
        columnWidth: 320,
        itemSelector: '.tweet-item',
        transitionDuration: 0,
        isFitWidth: true
      });

      // layout masonry.js on widgets.js loaded event
      twttr.events.bind('loaded', function () {
        $scope.msnry.reloadItems();
        $scope.msnry.layout();
      });

      twttr.events.bind(
        'rendered',
        function (event) {
          //console.log("Created widget", event.target.id);

        }
      );

      // $scope.getTweets();
    }

    /**
     * requests and processes tweet data
     */
    function getTweets (paging) {

      var params = {
        action: 'user_timeline',
        user: $scope.search
      };

      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }

      // create Tweet data resource
      $scope.tweets = $resource('/tweets/:action/:user', params);

      // GET request using the resource
      $scope.tweets.query( { }, function (res) {

        if( angular.isUndefined(paging) ) {
          $scope.tweetsResult = [];
        }

        $scope.tweetsResult = $scope.tweetsResult.concat(res);

        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 30);

        //console.log ("Tweets Result Length" , $scope.tweetsResult.length);
        for (i=0; i < $scope.tweetsResult.length; i++) { 
           var msg = "Tweets Result Created At " +  $scope.tweetsResult[i].created_at;
           var second_index = msg.indexOf('+');
           msg = msg.substring(0,second_index);

           msg = new SpeechSynthesisUtterance(msg);
           speechSynthesis.speak(msg);

           msg = "Tweets Result Created By " + $scope.tweetsResult[i].user.name;
           msg = new SpeechSynthesisUtterance(msg);
           speechSynthesis.speak(msg);

           msg = "Tweets Result Text " + $scope.tweetsResult[i].text;
           var http_index = msg.indexOf('http');
           if (http_index > 0) {  
             msg = msg.substring(0,http_index) + "Link";
             //console.log ("Replaced Tweets Result Text" , msg);
           }

           msg = new SpeechSynthesisUtterance(msg);
           speechSynthesis.speak(msg);
           //console.log ("Tweets Result Created At" , $scope.tweetsResult[i].created_at);
           //console.log ("Tweets Result Created By" , $scope.tweetsResult[i].user.name);
           //console.log ("Tweets Result Text" , $scope.tweetsResult[i].text);

        }



      });
    }



    /**
     * requests and processes tweet data
     */
    function getUserTweets (paging) {

      var params = {
        action: 'user_timeline',
        user: $scope.username
      };

      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }

      // create Tweet data resource
      $scope.tweets = $resource('/user_tweets/:action/:user', params);

      // GET request using the resource
      $scope.tweets.query( { }, function (res) {

        if( angular.isUndefined(paging) ) {
          $scope.tweetsResult = [];
        }

        $scope.tweetsResult = $scope.tweetsResult.concat(res);

        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 30);

        //console.log ("Tweets Result Length" , $scope.tweetsResult.length);
        for (i=0; i < $scope.tweetsResult.length; i++) { 
        
           var msg = "Tweets Result Created At " +  $scope.tweetsResult[i].created_at;
           var second_index = msg.indexOf('+');
           msg = msg.substring(0,second_index);
           msg = new SpeechSynthesisUtterance(msg);
           speechSynthesis.speak(msg);

           msg = "Tweets Result Created By " + $scope.tweetsResult[i].user.name;
           msg = new SpeechSynthesisUtterance(msg);
           speechSynthesis.speak(msg);

           msg = "Tweets Result Text " + $scope.tweetsResult[i].text;
           var http_index = msg.indexOf('http');
           if (http_index > 0) {  
             msg = msg.substring(0,http_index) + "Link";
             //console.log ("Replaced Tweets Result Text" , msg);
           }

           msg = new SpeechSynthesisUtterance(msg);
           speechSynthesis.speak(msg);
           //console.log ("Tweets Result Created At" , $scope.tweetsResult[i].created_at);
           //console.log ("Tweets Result Created By" , $scope.tweetsResult[i].user.name);
           //console.log ("Tweets Result Text" , $scope.tweetsResult[i].text);

        }



      });
    }

    /**
     * binded to @user input form
     */
    $scope.getTweets = function () {
      $scope.maxId = undefined;
      $scope.tweet_type = 'search';
      getTweets();
    };

    /**
     * binded to @user input form
     */
    $scope.getUserTweets = function () {
      $scope.maxId = undefined;
      $scope.tweet_type = 'user';
      getUserTweets();
    };

    /**
     * binded to 'Get More Tweets' button
     */
    $scope.getMoreTweets = function () {
      if ($scope.tweet_type == 'user') {
        getUserTweets(true);
      }
      else {
        getTweets(true);
      }
    };

    init();
});
