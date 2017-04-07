var Parser = require('./parser.js');
var fs = require('fs');
var regex = "";
var ParserFactory = new Parser.Factory();

fs.readFile('./ping_test.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var PingParser = ParserFactory.createParser('ping');
  var output = PingParser.parse(data);
  console.log(output);
});

fs.readFile('./traceroute_test.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var TracerouteParser = ParserFactory.createParser('traceroute');
  var output = TracerouteParser.parse(data);
  console.log(output);
});

fs.readFile('./wget_test.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var WGETParser = ParserFactory.createParser('wget');
  var output = WGETParser.parse(data);
  console.log(output);
});