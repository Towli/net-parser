var Parser = require('./parser.js');
var fs = require('fs');
var regex = "";

fs.readFile('./test.txt', 'utf8', function(err, data) {
	if (err) throw err;
	var ParserFactory = new Parser.Factory();
	var PingParser = ParserFactory.createParser('ping');
	var output = PingParser.parse(data);
	console.log(output);
});