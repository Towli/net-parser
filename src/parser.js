
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
    let output = data.match(regex)[0];
    output = output.replace("% packet loss", "");
    return output;
  }
  getIPAddress(data) {
    var regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
    return data.match(regex)[0];
  }
  getRoundTripStats(data) {
    let regex = /(round-trip|rtt.*)/gi;
    let statsRegex = /([0-9]+\.?[0-9]*)/gi;
    let RTStats = data.match(regex);
    if (RTStats === null) {
      return {
        RTTMin: null,
        RTTAvg: null,
        RTTMax: null,
        RTTDev: null
      }
    }
    RTStats = RTStats[0].match(statsRegex);
    return {
      RTTMin: RTStats[0],
      RTTAvg: RTStats[1],
      RTTMax: RTStats[2],
      RTTDev: RTStats[3]
    };
  }

  parse(data) {
    let blocks = this.getPingBlocks(data);
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
        "RTTMin": RTStats.RTTMin,
        "RTTAvg": RTStats.RTTAvg,
        "RTTMax": RTStats.RTTMax,
        "RTTDev": RTStats.RTTDev
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

    this.getWGETBlocks = function(data) {
      let regex = /(?=\d{10})/g;
      let blocks = data.split(regex);
      blocks.shift();
      return blocks;
    }

  }
  getIPAddress(data) {
    var regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
    return data.match(regex)[0];
  }
  getTimestamp(data) {
    var regex = /[0-9]{10}/gi;
    return data.match(regex)[0];
  }
  getSize(data) {
    let regex = /Length: [0-9]+/gi;
    let output = data.match(regex)[0];
    output = output.replace("Length: ", "");
    return output;
  }
  getSpeed(data) {
    var regex = /\(([0-9]+\.?[0-9]*) ([^\s]+)\)/gi;
    return data.match(regex)[0];
  }
  parse(data) {
    let blocks = this.getWGETBlocks(data);
    let output = [];
    for (let i = 0; i < blocks.length; i++) {
      let hostname = this.getIPAddress(blocks[i]);
      let timestamp = this.getTimestamp(blocks[i]);
      let size = this.getSize(blocks[i]);
      let speed = this.getSpeed(blocks[i]);
      let parsedBlock = {
        "Timestamp": timestamp,
        "Hostname": hostname,
        "Size": size,
        "Throughput": speed
      };
      output[i] = parsedBlock;
    }
    return output;
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
