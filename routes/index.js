var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Talking Tweety : Social Media App for Visually Blind' });
});

module.exports = router;
