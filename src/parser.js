
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
    super();

    this.getLines = function(data) {
      var regex = /.*(\n)+/gi;
      return data.match(regex);
    }

    /*this.getTracerouteBlocks = function(data) {
      var lines = this.getLines(data);
      var blocks = [], block = [];
      var blocksCounter = 0, blockCounter = 0;
      for (let i = 0; i < lines.length; ++i) {
        let regex = /\d{10}/;
        if(!lines[i].match(regex)) {
          block[blockCounter] = lines[i];
          blockCounter++;
        } else {
          blocks[blocksCounter++] = block;
          blockCounter = 0;
        }

      }
      return blocks;
    }*/

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
      
      let parsedBlock = {
        "Timestamp": timeStamp,
        "Target IP": targetIP,
        "# Hops": numHops,
        hops: []
      };

      for (let i = 0; i < lines.length; i++) {
        parsedBlock.hops[i] = this.getHopIP(lines[i]);
      }
      parsedBlock.hops.shift();
      parsedBlock.hops.shift();
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
