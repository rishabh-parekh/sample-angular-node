var express = require('express');
var router = express.Router();
var tweetText = require('twitter-text');
var Twit = require('twit')
var config = require('../config');

// instantiate Twitter module
//var twitter = new TwitterClient(config.twitter);

var twit = new Twit(config.twitter);

/* GET tweets json. */
router.get('/user_timeline/:user', function(req, res) {

  function onComplete (err, data, resp) {
  	res.setHeader('Content-Type', 'application/json');

    var twtText, tweets = data,
  	i = 0, len = tweets.length;

    for(i; i < len; i++) {
      // add links to tweet entities using Twitter's text processing library
      // https://github.com/twitter/twitter-text-js
      tweets[i].text = tweetText.autoLink(tweets[i].text);
    }

    res.send(tweets);
  };

  var params = {
    screen_name: req.params.user, // the user id passed in as part of the route
    count: 30 // how many tweets to return
  };

  // the max_id is passed in via a query string param:
  // https://dev.twitter.com/docs/working-with-timelines
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }

  // request data 
  twit.get('/statuses/user_timeline', params, onComplete);
});

module.exports = router;
