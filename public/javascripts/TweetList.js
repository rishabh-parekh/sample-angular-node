var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function($scope, $resource, $sce) {

    /**
     * change the date format with moment.js depending on how long ago it was
     **/
    function processTime (dateStr) {

      var twtDate = moment( new Date(dateStr) ),
      now = new Date();

      if (twtDate.diff(now, 'hours') > -24) {
        // less than 24 hours ago - how long ago was it posted?
        dateStr = twtDate.fromNow()
      } else {
        // more than 24 hours ago - just the date/time
        dateStr = twtDate.format('MMM D, YYYY h:mm a')
      }

      return dateStr;
    };

    /**
     * calculate image sizes so masonry can layout correctly
     **/
    function processPhotos (media) {
      
      var photos = [], IMAGE_WIDTH = 243, scale;

      if( angular.isDefined(media) ) {
        angular.forEach(media, function(mediaItem, key) {
          if( mediaItem.type == 'photo' ) {

            // the API return images sizes so we can no the image size without loading an image
            scale = IMAGE_WIDTH / mediaItem.sizes.small.w; 

            photos.push({
              url: mediaItem.media_url + ':small',
              permalink: mediaItem.url,
              width: IMAGE_WIDTH,
              height: Math.floor(mediaItem.sizes.small.h * scale)
            });
          }
        });

        console.log(photos);
      }

      return photos;
    };

    /**
     * requests and processes tweet data
     **/
    function getTweets (paging) {

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

        if(!paging) {
          $scope.tweetsResult = [];
        }

        var tweetObj,
        i = 0, len = res.length;

        angular.forEach(res, function(tweet, key) {
          tweet.created_at = processTime(tweet.created_at);
          tweet.photos = processPhotos(tweet.entities.media);

          // add to model
          $scope.tweetsResult.push(tweet);
        });

        // for paging
        $scope.maxId = res[res.length - 1].id;

        setTimeout(function () {
          msnry.reloadItems();
          msnry.layout();
        }, 75);
      });
    }

    $scope.getTweets = function () {
      $scope.maxId = undefined;
      getTweets();
    };

    $scope.getMoreTweets = function () {
      getTweets(true);
    };

    // initiate masonry
    var msnry = new Masonry('#tweet-list', {
      columnWidth: 295,
      itemSelector: '.tweet-item',
      transitionDuration: 0,
      isFitWidth: true
    });

    msnry.bindResize(function () {
      console.log('resize');
    });

    // set a default username value
    $scope.username = "twoffice";
    
    // empty tweet model
    $scope.tweetsResult = [];

    getTweets();
})
.directive('tweetItem', function() {
  return {
    templateUrl: 'tweet-item.html'
  };
});