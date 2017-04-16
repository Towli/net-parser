var Parser = require('./parser.js');
var fs = require('fs');
var regex = "";
var ParserFactory = new Parser.Factory();

var args = process.argv[2];

if (args == 'ping')
  parsePing();
else
if (args == 'traceroute')
  parseTraceroute();
else
if (args == 'wget')
  parseWGET();
else
  console.log('No arguments given, terminating parser.');


function parsePing() {
  fs.readFile('./example_logs/PING/103.9.171.248.log', 'utf8', function(err, data) {
    if (err) throw err;
    var PingParser = ParserFactory.createParser('ping');
    var output = PingParser.parse(data);
    console.log(output);
  });
}

function parseTraceroute() {
  fs.readFile('../TRACEROUTE/220.243.233.15.log', 'utf8', function(err, data) {
    if (err) throw err;
    var TracerouteParser = ParserFactory.createParser('traceroute');
    var output = TracerouteParser.parse(data);
    fs.writeFile("220.txt", JSON.stringify(output, null, 4));
  });
}

function parseWGET() {
  fs.readFile('../WGET/sync.log', 'utf8', function(err, data) {
    if (err) throw err;
    var WGETParser = ParserFactory.createParser('wget');
    var output = WGETParser.parse(data);
    console.log(output);
  });
}
