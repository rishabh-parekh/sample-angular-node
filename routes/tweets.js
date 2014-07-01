var express = require('express');
var router = express.Router();
var config = require('../config');
var Twitter = require('../lib/Twitter');

// instantiate Twitter module
var twitter = new Twitter(config.twitter);

/* GET tweets json. */
router.get('/user_timeline/:user', function(req, res) {

  var params = {
    screen_name: req.params.user, // the user id passed in as part of the route
    count: 20 // how many tweets to return
  };

  // the max_id is passed in via a query string param:
  // https://dev.twitter.com/docs/working-with-timelines
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }

  // callback handlers
  var onErr = function(resp) {
  	res.setHeader('Content-Type', 'application/json');
  	res.send(resp);
  };

  var onSuccess = function(resp) {
  	res.setHeader('Content-Type', 'application/json');
  	res.send(resp);
  };

  // request data 
  twitter.getUserTimeline(params, onErr, onSuccess);

});

module.exports = router;
