
class Parser {
	constructor() {
		console.log('Parser created!');
	}
}

class PingParser extends Parser {
	constructor() {
		super()
		console.log('IAMA PingParser.');
	}
}

class TracerouteParser extends Parser {
	constructor() {
		super()
		console.log('IAMA TracerouteParser.');
	}
}

class WGETParser extends Parser {
	constructor() {
		super()
		console.log('IAMA WGETParser.');
	}
}

class Factory {
	createParser(type) {
		var parser;
		if (type.toUpperCase() === 'ping'.toUpperCase())
			parser = new PingParser();
		else
		if (type.toUpperCase() === 'traceroute'.toUpperCase())
			parser = new TracerouteParser();
		else
		if(type.toUpperCase() === 'wget'.toUpperCase())
			parser = new WGETParser();
	}
}

module.exports = { Parser, PingParser, TracerouteParser, WGETParser, Factory };