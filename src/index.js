var Parser = require('./parser.js');
var fs = require('fs');
var regex = "";

fs.readFile('./test.txt', 'utf8', function(err, data) {
	if (err) throw err;
	console.log(data);
});

var ParserFactory = new Parser.Factory();

ParserFactory.createParser('ping');
ParserFactory.createParser('wget');
ParserFactory.createParser('traceroute');