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
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient
    assert = require('assert'),
    _ = require('underscore');

var url = 'mongodb://localhost:27017/tracked';
var db,
    collection;

MongoClient.connect(url, function(err, mongo_db) {
  assert.equal(null, err);
  db = mongo_db;
  collection = db.collection('devices');
  console.log("Connected correctly to server");
});

var port = 3001;
var app = express();

app.use( bodyParser.json() );  //  for post requests
app.use("/track.html", express.static(__dirname + '/track.html'));
app.use("/js/fingerprinter2.js", express.static(__dirname + '/js/fingerprinter2.js'));
app.use("/js/flash-cookie.js", express.static(__dirname + '/js/flash-cookie.js'));
app.use("/js/js.cookie.js", express.static(__dirname + '/js/js.cookie.js'));
app.use("/js/swfstore.js", express.static(__dirname + '/js/swfstore.js'));
app.use("/swf/storage.swf", express.static(__dirname + '/swf/storage.swf'));

app.listen(port, function () {
  console.log("listening on port " + port);
});

app.get('/', function (req, res) {
  res.redirect('track.html');
});

app.get('track.html', function (req, res) {
});

var fp,
    fc,
    cook,
    ip,
    datadict;

app.post('/fingerprint', function (req, res) {
  // finally got this working from here: https://gist.github.com/diorahman/1520485
  // was a huge pain
  console.log(JSON.stringify(req.body));
  fp = req.body.fingerprint;
});

app.post('/reg_cookie', function (req, res) {
  // finally got this working from here: https://gist.github.com/diorahman/1520485
  // was a huge pain
  console.log(JSON.stringify(req.body));
  cook = req.body.flash_cookie;
});

app.post('/ip', function (req, res) {
  // finally got this working from here: https://gist.github.com/diorahman/1520485
  // was a huge pain
  console.log(JSON.stringify(req.body));
  ip = req.body.ip;
  datadict.ip = ip;
});

app.post('/datadict', function (req, res) {
  // finally got this working from here: https://gist.github.com/diorahman/1520485
  // was a huge pain
  //console.log(JSON.stringify(req.body));
  datadict = req.body;
  //console.log(datadict);
});

// this is the last cookie to come through usually
app.post('/flash_cookie', function (req, res) {
  // finally got this working from here: https://gist.github.com/diorahman/1520485
  // was a huge pain
  console.log(JSON.stringify(req.body));
  fc = req.body.flash_cookie;
});

// this happens after everything has been sent to the server
app.get('/id', function(req, res) {
  findDevice(db, fp, cook, fc, res);
})

var findDevice = function(db, fp, cook, fc, res) {
  // Find some documents
  collection.find({uid: fp}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(docs);
    if (docs.length == 0) {
      console.log('no docs');
      checkDataDict(res);
    } else {
      console.log(docs[0]['uid']);
      updateEntry(fp, docs[0]['alt_ids'], res);
    }
  });
}

var checkRest = function(res) {
  if (cook != undefined) {
    collection.find({alt_id: cook}).toArray(function(err, docs) {
      if (docs.length == 0) {
        console.log('still no docs');
        if (fc != undefined) {
          return findAltCookFC(res);
        } else {
          insertNewEntry(fp, res);
        }
      } else {
        console.log('found docs:');
        console.log(docs);
        updateEntry(docs[0]['uid'], _.difference(docs[0]['alt_ids'], cook), res);
      }
    });
  } else if (fc != undefined) {
    return findAltCookFC(res);
  } else {
    insertNewEntry(fp, res);
  }
}

var checkDataDict = function(res) {
  collection.find({datadict: datadict}).toArray(function(err, docs) {
    if (docs.length == 0) {
      console.log('didnt find datadict');
      checkRest(res);
    } else {
      console.log('found datadict');
      updateEntry(docs[0]['uid'], _.difference(docs[0]['alt_ids'], fp), res);
    }
  });
}

var findAltCookFC = function(res) { // finds flash cookie in alternate ids
  collection.find({alt_id: fc}).toArray(function(err, docs) {
    if (docs.length == 0) {
      console.log('STILL no docs');
      insertNewEntry(fp, res);
    } else {
      updateEntry(docs[0]['uid'], _.difference(docs[0]['alt_ids'], fc), res);
    }
  });
}

var alt_ids;
var makeAltIds = function() {
  alt_ids = [];
  if (fc != undefined & fc != fp) {
    alt_ids.push(fc);
  }
  if (cook != undefined & fc != fp) {
    alt_ids.push(cook);
  }
  console.log(alt_ids);
}

var insertNewEntry = function(id, res) {
  makeAltIds();
  collection.insertOne({uid : id, alt_ids: alt_ids, datadict: datadict}, function(err, result) {
   assert.equal(err, null);
   console.log("Inserted new device entry");
  });
  sendID(fp, res);
}

var updateEntry = function(id, exist_alt_ids, res) {
  console.log('updating entry');
  makeAltIds();
  if (_.intersection(alt_ids, exist_alt_ids) != exist_alt_ids) {
    collection.updateOne({uid: id, alt_ids: _.difference(alt_ids, exist_alt_ids).concat(exist_alt_ids)})
  }
  sendID(id, res);
}

var sendID = function(id, res) {
  res.send({id: id});
}

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
