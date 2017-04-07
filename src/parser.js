
class Parser {
	constructor() {
		console.log('Parser created!');
	}
	parse(data){}
}

class PingParser extends Parser {
	constructor() {
		super()
		console.log('IAMA PingParser.');
	}
	getTimestamp(data) {
		var regex = /[0-9]{10}/gi;
		return data.match(regex);
	}
	getPacketLoss(data) {
		var regex = /\d*.\d*% packet loss/gi;
		return data.match(regex);
	}
	getIPAddress(data) {
		var regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
		return data.match(regex)[0];
	}
	getRoundTripStats(data) {
		var regex = /(round-trip|rtt.*)$/gi;
		var RTStats = data.match(regex);
	 	RTStats = RTStats.toString()
		RTStats = RTStats.match(/\d+.\d+/gi);
		var min = RTStats[0];
		var avg = RTStats[1];
		var max = RTStats[2];
		var stdDev = RTStats[3];
		return {
			min: min,
			avg: avg,
			max: max,
			stdDev: stdDev
		}
	}
	parse(data) {
			return {
				IPAddress: this.getIPAddress(data),
				timestamp: this.getTimestamp(data),
				packetLoss: this.getPacketLoss(data),
				RTStats: this.getRoundTripStats(data)
			}
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
		if (type.toUpperCase() === 'ping'.toUpperCase())
			return new PingParser();
		else
		if (type.toUpperCase() === 'traceroute'.toUpperCase())
			return new TracerouteParser();
		else
		if(type.toUpperCase() === 'wget'.toUpperCase())
			return new WGETParser();
	}
}

module.exports = { Parser, PingParser, TracerouteParser, WGETParser, Factory };