var express       = require("express"),
    bodyParser    = require('body-parser'),
    hbs           = require("hbs"),
    webPush       = require('web-push'),
    dotenv        = require('dotenv'),
    Twitter       = require('twitter'),
    EventEmitter  = require('events').EventEmitter,
    emitter       = new EventEmitter(),
    app           = express(),
    messageCount  = 0,
    endpoint, key;

dotenv.load();
webPush.setGCMAPIKey(process.env.GCM_ID);

var hashtag = process.env.HASHTAG;

var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Set the templates to handlebars
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.get("/", function(req, res){
  twitterClient.get('search/tweets', {q: hashtag}, function(error, tweets, response){
    if(error){
      res.render("error");
    }else{
      res.render("index", { messages: tweets.statuses, hashtag: hashtag });
    }
  });
});

app.get("/stream", function(req, res){
  req.setTimeout(0);
  var sendMessage = function(message){
    messageCount++;
    res.write('id: ' + messageCount + '\n');
    res.write("data: " + JSON.stringify(message) + '\n\n');
  }
  emitter.on("message", sendMessage);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');
  req.on('close', function(){
    emitter.removeListener("message", sendMessage);
  });
});

twitterClient.stream('statuses/filter', {track: hashtag},  function(stream){
  stream.on('data', function(tweet) {
    data = {
      from: tweet.user.screen_name,
      body: tweet.text
    }
    console.log(data);
    emitter.emit("message", data);

    if (typeof endpoint !== 'undefined') {
      if (typeof key !== 'undefined') {
        var push = webPush.sendNotification(endpoint, 120, key, JSON.stringify(data));
      } else {
        var push = webPush.sendNotification(endpoint, 120);
      }

      push.then(function(result) { console.log("Push successful", result)});
      push.catch(function(err) { console.log("Push failed: ", err) } );
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

app.get("/sub", function(req, res){
  console.log(req.query);
  endpoint = req.query.endpoint;
  key = req.query.key;
  res.send();
});

app.get("/latest", function(req, res){
  twitterClient.get('search/tweets', {q: hashtag, count: 1}, function(error, tweets, response){
    if(!error){
      var status = tweets.statuses[0];
      var data = {
        from: status.user.screen_name,
        body: status.text
      }
      res.send(data);
    }
  });
});

var server = app.listen(process.env.PORT || 3000, function (){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Hashtag streamer is listening to %s at http://%s:%s", hashtag, host, port);
});
