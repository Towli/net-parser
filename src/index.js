var fs = require('fs');
var regex = "";

fs.readFile('./test.txt', 'utf8', function(err, data) {
	if (err) throw err;
	console.log(data);
});

