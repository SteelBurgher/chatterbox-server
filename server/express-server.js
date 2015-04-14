var express = require('express');
var app = express();
var url = require("url");
var bodyParser = require('body-parser');
var _ = require("underscore");



var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var headers = defaultCorsHeaders;

var messages = [];

app.use(bodyParser.json());

app.route('/classes/messages')
  .get(function(req, res) {
    headers["Content-Type"] = 'application/json';
    var resultMessages = messages;
    //var queryData = url.parse(req.url, true).query;
    if(req.query.where !== undefined) {
      resultMessages = _.filter(messages, function(message) {
        return message.roomname === req.query.where.roomname;
      });
    }
    res.status(200);
    res.set(headers);
    res.json({results: resultMessages});
  })
  .post(function(req, res) {
    res.status(201);
    headers["Content-Type"] = "text";
    res.set(headers);
    var message = req.body;
    message.createdAt = new Date(); 
    messages.push(message);
    res.end();
  })
  .options(function(req, res) {
    res.status(200);
    res.set(headers);
    
    res.end();
  });



var server = app.listen(3000, "127.0.0.1", function() {

  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening at host " + host + " on port " + port);
});