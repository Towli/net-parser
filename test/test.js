var expect = require('chai').expect;
var fs = require('fs');

describe('index.js', function() {
	describe('#fs.readFile', function() {
		it('should read a file', function() {
			fs.readFile('./file.txt', 'utf8', function(err, data) {
				if (err) throw err;
				expect(data).to.be.a('string');
			});
		});
	});
	describe('#parse', function() {
		
	});
});