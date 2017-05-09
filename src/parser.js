
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

    this.getPingBlocks = function(data) {
      let regex = /(?=\d{10})/g;
      let blocks = data.split(regex);
      blocks.shift();
      return blocks;
    }

  }
  getTimestamp(data) {
    var regex = /[0-9]{10}/gi;
    return data.match(regex)[0];
  }
  getPacketLoss(data) {
    var regex = /\d*.\d*% packet loss/gi;
    return data.match(regex)[0];
  }
  getIPAddress(data) {
    var regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
    return data.match(regex)[0];
  }
  getRoundTripStats(data) {
    var regex = /(round-trip|rtt.*)/gi;
    var RTStats = data.match(regex)[0];
    return RTStats;
  }
  
  parse(data) {
    let blocks = this.getPingBlocks(data);
    let RTTMin = "";
    let RTTAvg = "";
    let RTTMax = "";
    let RTTDev = "";
    let output = [];
    
    for (let i = 0; i < blocks.length; i++) {
      let timestamp = this.getTimestamp(blocks[i]);
      let packetLoss = this.getPacketLoss(blocks[i]);
      let RTStats = this.getRoundTripStats(blocks[i]);
      let hostname = this.getIPAddress(blocks[i]);
      let parsedBlock = {
        "Timestamp": timestamp,
        "Hostname": hostname,
        "Packet loss": packetLoss,
        "RTStats": RTStats
        //"RTTMin": RTTMin,
        //"RTTAvg": RTTAvg,
        //"RTTMax": RTTMax,
        //"RTTDev": RTTDev
      };
      output[i] = parsedBlock;
    }
    return output;
  }
}

class TracerouteParser extends Parser {
  constructor() {
    super();

    this.getLines = function(data) {
      var regex = /.*(\n)+/gi;
      return data.match(regex);
    }

    this.getTracerouteBlocks = function(data) {
      let regex = /(?=\d{10})/g;
      let blocks = data.split(regex);
      blocks.shift();
      return blocks;
    }

  }

  getTargetIP(data) {
    let regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
    return data.match(regex)[0];
  }

  getNumHops(data) {
    let irrelevantLines = 2;
    return data.length - irrelevantLines;
  }

  getHopIP(data) {
    let regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
    if (data.match(regex))
      return data.match(regex)[0];
    else
      return "unresponsive"
  }

  getTimeStamp(data) {
    var regex = /[0-9]{10}/gi;
    return data.match(regex)[0];
  }

  parse(data) {
    let blocks = this.getTracerouteBlocks(data);
    let output = [];
    for (let i = 0; i < blocks.length; i++) {
      let timeStamp = this.getTimeStamp(blocks[i]);
      let lines = this.getLines(blocks[i]);
      let targetIP = this.getTargetIP(blocks[i]);
      let numHops = this.getNumHops(lines);
      let hop;
      
      let parsedBlock = {
        "Timestamp": timeStamp,
        "Target IP": targetIP,
        "# Hops": numHops
      };

      for (let i = 2; i < lines.length; i++) {
        hop = this.getHopIP(lines[i]);
        parsedBlock['hop'+(i-1)]= hop;
      }
      output[i] = parsedBlock;
    }
    return output;
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
