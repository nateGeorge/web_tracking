// expect 50 billion devices connected to the internet soon
// http://www.statista.com/statistics/471264/iot-number-of-connected-devices-worldwide/
// it would be nice to have a trillion possible unique IDs for a big safety margin
// 2^40 or 40 bits of information is required (https://en.wikipedia.org/wiki/Power_of_two)
// from plugins, fonts, user agent, and http accept we should be able to hit over
// 40 bits (https://wiki.mozilla.org/Fingerprinting)
// but we also have touch screen support, webgl and canvas fingerprinting,
// cpu class, screen resolution, and color depth
// and we could also get clock skew https://www.usenix.org/legacy/event/sec08/tech/full_papers/zander/zander_html/

var express = require('express'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    qs = require('querystring'),
    bodyParser = require('body-parser');

var port = 3001;
var app = express();

app.use( bodyParser.json() );  //  for post requests
app.use("/track.html", express.static(__dirname + '/track.html'));
app.use("/js/fingerprinter2.js", express.static(__dirname + '/js/fingerprinter2.js'));
app.use("/js/flash-cookie.js", express.static(__dirname + '/js/flash-cookie.js'));
app.use("/swf/FlashCookie.swf", express.static(__dirname + '/swf/FlashCookie.swf'));

app.listen(port, function () {
  console.log("listening on port " + port);
});

app.get('/', function (req, res) {
  res.redirect('track.html');
});

app.get('track.html', function (req, res) {
});

var fp;
app.post('/fingerprint', function (req, res) {
  console.log(JSON.stringify(req.body));
  fp = req.body.fingerprint;
});

// http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
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
