var express = require('express');
var router = express.Router();
var tweetText = require('twitter-text');
var Twit = require('twit')
var request = require('request');
var config = require('../config');

// instantiate Twit module
var twitter = new Twit(config.twitter);

var TWEET_COUNT = 5;
var MAX_WIDTH = 305;
var OEMBED_URL = 'https://api.twitter.com/1/statuses/oembed.json';
var USER_TIMELINE_URL = '/statuses/user_timeline';

/* GET tweets json. */
router.get('/user_timeline/:user', function(req, res) {

  var oEmbedTweets = [], tweets = [],

  params = {
    screen_name: req.params.user, // the user id passed in as part of the route
    count: TWEET_COUNT // how many tweets to return
  };

  // the max_id is passed in via a query string param
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }

  // request data 
  twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {
    res.setHeader('Content-Type', 'application/json');

    tweets = data;

    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      getOEmbed(tweets[i]);
    }
  });

  /**
   * requests the oEmbed html
   */
  function getOEmbed (tweet) {

    // oEmbed request params
    var query = {
      "id": tweet.id_str,
      "url": 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id,
      "maxwidth": MAX_WIDTH,
      "hide_thread": true,
      "omit_script": true
    };

    // oEmbed request
    request.get(OEMBED_URL, { 'qs': query }, function (err, data, resp) {
    
      var data = JSON.parse(resp);

      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);

      if (oEmbedTweets.length == tweets.length) {
        res.send(oEmbedTweets);
      }
    });
  }
});

module.exports = router;
