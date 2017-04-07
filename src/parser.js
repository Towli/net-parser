
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
    RTStats = RTStats.toString().match(/\d+.\d+/gi);
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

    /* Private methods */
    this.getHops = function(data) {
      var regex = /([\n]\d\s*([^\n\r]*))|([\n] \s*([^\n\r]*))/gi;
      return data.match(regex);
    }
    this.getRoundTripStats = function(data) {
      var regex = /(\d+.\d+.\d+.\d+)|(\d+.\d+ ms)/gi;
      var RTStats = data.match(regex);
      var validStats = (RTStats);
      if (validStats) {
        return {
          IP: RTStats[0],
          RTT1: RTStats[2],
          RTT2: RTStats[3],
          RTT3: RTStats[4]
        }
      }
      else
        return;
    }
  }
  getTimestamp(data) {
    var regex = /[0-9]{10}/gi;
    return data.match(regex);
  }
  getHopStats(data) {
    var hops = this.getHops(data);
    var hopStats = []
    for (var i in hops) {
      hopStats[i] = this.getRoundTripStats(hops[i]);
    }
    return hopStats;
  }
  getIPAddress(data) {
    var regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
    return data.match(regex)[0];
  }
  parse(data) {
    return {
      IPAddress: this.getIPAddress(data),
      timestamp: this.getTimestamp(data),
      maxHops: "Traceroutes's default is 30 (change through Parser API)",
      hopStats: this.getHopStats(data)
    }
  }
}

class WGETParser extends Parser {
  constructor() {
    super()
    console.log('IAMA WGETParser.');
  }
  getIPAddress(data) {
    var regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
    return data.match(regex)[0];
  }
  getTimestamp(data) {
    var regex = /[0-9]{10}/gi;
    return data.match(regex);
  }
  getSize(data) {
    var regex = /Length: [0-9]+/gi;
    return data.match(regex);
  }
  getSpeed(data) {
    var regex = /\(([0-9]+) ([^\s]+)\)/gi;
    return data.match(regex);
  }
  parse(data) {
    return {
      IPAddress: this.getIPAddress(data),
      timestamp: this.getTimestamp(data),
      size: this.getSize(data),
      speed: this.getSpeed(data)
    }
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