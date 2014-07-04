var express = require('express');
var router = express.Router();
var tweetText = require('twitter-text');
var TwitterClient = require('../lib/Twitter');
var config = require('../config');

// instantiate Twitter module
var twitter = new TwitterClient(config.twitter);

/* GET tweets json. */
router.get('/user_timeline/:user', function(req, res) {

  // callback handlers
  function onErr (resp) {
  	res.setHeader('Content-Type', 'application/json');
  	res.send(resp);
  };

  function onSuccess (resp) {
  	res.setHeader('Content-Type', 'application/json');

    var twtText, tweets = JSON.parse(resp),
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
    count: 20 // how many tweets to return
  };

  // the max_id is passed in via a query string param:
  // https://dev.twitter.com/docs/working-with-timelines
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }

  // request data 
  twitter.getUserTimeline(params, onErr, onSuccess);

});

module.exports = router;
