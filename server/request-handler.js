/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require("url");
var _ = require("underscore");
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

    
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  if(request.method === "OPTIONS"){
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }

  if(request.url.split("/")[1] !== "classes") {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
    return;
  }
  
  if(request.method === "GET") {

    // The outgoing status.
    var statusCode = 200;
    var resultMessages = messages;
    headers['Content-Type'] = "application/json";
    var queryData = url.parse(request.url, true).query;
    console.log(queryData);
    if(queryData["where[roomname]"] !== undefined) {
      resultMessages = _.filter(messages, function(message) {
        return message.roomname === queryData["where[roomname]"];
      });
    }
    response.writeHead(statusCode, headers);

    /* var messageData; 
    request.on('data', function(message) {
      messageData = JSON.parse(message);
    }); */

    
  
    response.end(JSON.stringify({results: resultMessages}));
    
  } else if (request.method ==="POST") {
    var statusCode = 201;

    headers['Content-Type'] = "text";
    response.writeHead(statusCode, headers);
    
    request.on('data', function(message) {
      var message = JSON.parse(message);
      message.createdAt = new Date(); 
      messages.push(message);
    });

    request.on('end', function() {
      response.end();
    });

   
  }

};

// req.on('data', function (chunk) {
//   body += chunk;
// });
// req.on('end', function () {
//   console.log('POSTed: ' + body);
//   res.writeHead(200);
//   res.end(postHTML);
// });
var messages = [];
module.exports.requestHandler = requestHandler;

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

