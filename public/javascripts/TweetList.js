var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function($scope, $resource, $timeout) {

    /**
     * init controller and set defaults
     */
    function init () {

      // initiate masonry
      $scope.msnry = new Masonry('#tweet-list', {
        columnWidth: 295,
        itemSelector: '.tweet-item',
        transitionDuration: 0,
        isFitWidth: true
      });

      // set a default username value
      $scope.username = "twitterdev";
      
      // empty tweet model
      $scope.tweetsResult = [];

      $scope.getTweets();
    }

    /**
     * requests and processes tweet data
     */
    function getTweets (paging) {

      var params = {
        action: 'user_timeline',
        user: $scope.username
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

        angular.forEach(res, function(tweet, key) {
          tweet.created_at = processTime(tweet.created_at);
          tweet.photos = processPhotos(tweet.entities.media);
        });

        $scope.tweetsResult = $scope.tweetsResult.concat(res);

        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // apply masonry layout
        $timeout(function () {
          $scope.msnry.reloadItems();
          $scope.msnry.layout();
        }, 30);
      });
    }

    /**
     * change the date format with moment.js per Twitter display requirements
     */
    function processTime (dateStr) {

      var twtDate = moment( new Date(dateStr) ),
      now = new Date();

      if (twtDate.diff(now, 'hours') > -24) {
        // less than 24 hours ago - how long ago was it posted?
        dateStr = twtDate.fromNow()
      } else {
        // more than 24 hours ago - just the date/time
        dateStr = twtDate.format('MMM D, YYYY h:mm a');
      }

      return dateStr;
    }

    /**
     * calculates image sizes so masonry can layout correctly
     */
    function processPhotos (media) {
      
      var photos = [],
      IMAGE_WIDTH = 243,
      scale;

      if( angular.isDefined(media) ) {
        angular.forEach(media, function(mediaItem, key) {
          if( mediaItem.type == 'photo' ) {

            // the API return images sizes so we can calculate proper image size without loading the image
            scale = IMAGE_WIDTH / mediaItem.sizes.small.w; 

            photos.push({
              url: mediaItem.media_url + ':small',
              permalink: mediaItem.url,
              width: IMAGE_WIDTH,
              height: Math.floor(mediaItem.sizes.small.h * scale)
            });
          }
        });
      }

      return photos;
    }

    /**
     * binded to @user input form
     */
    $scope.getTweets = function () {
      $scope.maxId = undefined;
      getTweets();
    }

    /**
     * binded to 'Get More Tweets' button
     */
    $scope.getMoreTweets = function () {
      getTweets(true);
    }

    init();
})
.directive('tweetItem', function() {
  return {
    templateUrl: 'tweet-item.html'
  };
});