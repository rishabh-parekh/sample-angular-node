Talking Tweety with Angular & Node
===================

Application which receives Tweets from users or searches for specific keywords and plays them back for visually blind.
The is part of a science project to make visually blind socially inclusive and part of the social network. 
This application can be further used in upstream apps on Iphone, Android, Public Safety and School Apps to communicate Crisis or Urgent information to everyone including visually blind. 

This application uses Angular.js, Node.js, and Twitter API and is based on the sample-angular-node from twitterdev and speech sythensis API's from Google [4]

Installing and Running
----

Install [Node.js](http://nodejs.org/).

Clone GitHub repo:

```
git clone https://github.com/rishabh-parekh/talking-tweety.git
```
Create a config.js file using config.sample.js as a template. Fill in your Twitter App API Keys. You will need to [create a Twitter application](https://apps.twitter.com/).

Install node module dependencies:

```
npm install 
```

Run application:

```
npm start
```

Go to [http://localhost:5000](http://localhost:5000) in your browser.




Resources
----
- [Angular Developer Guide](https://docs.angularjs.org/guide)
- [Twitter API User Timeline Documentaion](https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline)
- [Twitter API oEmbed Documentation](https://dev.twitter.com/docs/api/1/get/statuses/oembed)
- [Speech Synthesis API's for Chrome] (http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API#disqus_thread) 
