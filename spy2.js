// expect 50 billion devices connected to the internet soon
// http://www.statista.com/statistics/471264/iot-number-of-connected-devices-worldwide/
// it would be nice to have a trillion possible unique IDs for a big safety margin
// 2^40 or 40 bits of information is required (https://en.wikipedia.org/wiki/Power_of_two)
// from plugins, fonts, user agent, and http accept we should be able to hit over
// 40 bits (https://wiki.mozilla.org/Fingerprinting)
// but we also have touch screen support, webgl and canvas fingerprinting,
// cpu class, screen resolution, and color depth
// and we could also get clock skew https://www.usenix.org/legacy/event/sec08/tech/full_papers/zander/zander_html/



// http://stackoverflow.com/questions/6084360/using-node-js-as-a-simple-web-server



var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname   // or whatever base directory you want

var port = 3000

http.createServer(function (request, response) {
  console.log(request.method);
  if(request.method == 'POST') {
    processPost(request, response, function() {
        console.log(request.post);
        // Use request.post here

        response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        response.end();
    });
  } else {
  try {
   var requestUrl = url.parse(request.url)

   // need to use path.normalize so people can't access directories underneath baseDirectory
   var fsPath = baseDirectory+path.normalize(requestUrl.pathname)

   response.writeHead(200)
   var fileStream = fs.createReadStream(fsPath)
   fileStream.pipe(response)
   fileStream.on('error',function(e) {
       response.writeHead(404)     // assume the file doesn't exist
       response.end()
   })
  } catch(e) {
   response.writeHead(500)
   response.end()     // end the response so browsers don't hang
   console.log(e.stack)
  }
}
}).listen(port)

console.log("listening on port "+port)


// http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
var qs = require('querystring');

function processPost(request, response) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            var POST = qs.parse(body);
            // use POST
            console.log(POST);
        });
    }
}


// maybe try this for cross-browser tracking:
// https://github.com/baranov1ch/connect-sdch
