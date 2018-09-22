const express = require ("express")
const BitMEXClient = require('bitmex-realtime-api');
// See 'options' reference below
const client = new BitMEXClient(
{
  testnet: true, // set `true` to connect to the testnet site (testnet.bitmex.com)
  // Set API Key ID and Secret to subscribe to private streams.
  // See `Available Private Streams` below.
  apiKeyID: 'B-Cg886lsAQdymvKQcd0HNne',
  apiKeySecret: 'BtGVg4v3vsRkcsG56wRfoG-JR72ZSyPFF4rzo-39Sogx8f7g',
  maxTableLen: 10000  // the maximum number of table elements to keep in memory (FIFO queue)
}
);

const app = express()
const port = process.env.PORT || 3000;
var log = "";
var request = require("request")
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

client.addStream('XBTUSD', 'tradeBin1m', function (data, symbol, tableName) {
  log+=data[data.length-1].close + "\r\n";
  console.log(data[data.length-1].close);
});



app.get('/', (req, res) => {
var msg = "";
msg = msg + "<html><body><script src=\"https://code.jquery.com/jquery-3.1.1.min.js\"></script><div id=\"container\" style=\"height: 400px; min-width: 310px\"></div><script src=\"https://code.highcharts.com/stock/highstock.js\"></script><script src=\"https://code.highcharts.com/stock/modules/exporting.js\"></script>";
msg = msg + "<script>$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/new-intraday.json', function (data){ Highcharts.stockChart('container',{title:{text: 'XBT/USD Perpetual'}, rangeSelector:{buttons: [{type: 'minute', count: 1, text: '1m'},{type: 'day', count: 1, text: '1D'},{type: 'all', count: 1, text: 'All'}], selected: 1, inputEnabled: false}, series: [{name: 'XBT/USD', type: 'candlestick', data: data, tooltip:{valueDecimals: 2}}]});});</script>";
msg = msg +"</body></html>";
msg = msg + log;
	res.send(msg)
	
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))