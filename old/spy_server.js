const http = require('http');
//var fontManager = require('font-manager');
var Fingerprint2 = require('fingerprintjs2');
var options = {extendedFontList: true, excludeUserAgent: true};

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');

  //fontManager.getAvailableFonts(function(fonts) {
  //  console.log(fonts)
  //});

  //new Fingerprint2().get(function(result, components){
  //  console.log(result); //a hash, representing your device fingerprint
  //  console.log(components); // an array of FP components
  //});

  new Fingerprint2(options).get(function(result){
    console.log(result);
  });

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
