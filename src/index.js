let Parser = require('./parser.js');
let fs = require('fs');
let regex = "";
let ParserFactory = new Parser.Factory();

let args = process.argv[2];

const HOSTS = [ "103.9.171.248", "104.16.62.3", "198.27.76.27", "202.181.132.41", 
              "211.125.123.69", "220.243.233.15", "94.228.132.139" ];
const FILE_NAMES = [ "igdo", "late", "sync" ];

for (let i = 0; i < HOSTS.length; ++i) {
  if (args == 'ping')
    parsePing(HOSTS[i]);
  else
  if (args == 'traceroute')
    parseTraceroute(HOSTS[i]);
}

for (let i = 0; i < FILE_NAMES.length; ++i) {
  if (args == 'wget')
    parseWGET(FILE_NAMES[i]);
  else
    console.log('No arguments given, terminating parser.');
}

function parsePing(IP) {
  fs.readFile('logs/PING/'+ IP +'.log', 'utf8', function(err, data) {
    if (err) throw err;
    let PingParser = ParserFactory.createParser('ping');
    let output = PingParser.parse(data);
    fs.writeFileSync("output/PING/"+IP+".txt", JSON.stringify(output, null, 4));
  });
}

function parseTraceroute(IP) {
  fs.readFile('logs/TRACEROUTE/'+ IP +'.log', 'utf8', function(err, data) {
    if (err) throw err;
    let TracerouteParser = ParserFactory.createParser('traceroute');
    let output = TracerouteParser.parse(data);
    fs.writeFileSync("output/TRACEROUTE/"+IP+".txt", JSON.stringify(output, null, 4));
  });
}

function parseWGET(filename) {
  fs.readFile('logs/WGET/'+ filename +'.log', 'utf8', function(err, data) {
    if (err) throw err;
    let WGETParser = ParserFactory.createParser('wget');
    let output = WGETParser.parse(data);
    fs.writeFileSync("output/WGET/"+filename+".txt", JSON.stringify(output, null, 4));
  });
}