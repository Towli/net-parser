
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
    var regex = /(round-trip|rtt.*)/gi;
    var RTStats = data.match(regex);
    return {
      RTStats: RTStats
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
      var IPregex = /(\d+.\d+.\d+.\d+)/gi;
      var RTTregex = /(\d+.\d+ ms)/gi;
      var hopIPs = data.match(IPregex);
      var RTStats = data.match(RTTregex);
      if (hopIPs != null) {
        if (hopIPs.length > 1) {
          return {
            IP: hopIPs[0],
            RTStats: RTStats[0]
          }
        }
        return {
          IP: hopIPs[0],
          RTStats: JSON.stringify(RTStats)
        }
      }
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
    var regex = /\(([0-9]+\.?[0-9]*) ([^\s]+)\)/gi;
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
