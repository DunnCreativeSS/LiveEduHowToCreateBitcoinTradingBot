const express = require ("express")
const BitMEXClient = require('bitmex-realtime-api');
const ccxt = require ("ccxt");
var ROC = require('technicalindicators').ROC
var crypto = require('crypto');

var apiKey = "vsOt8RPbQmCMQIQnbnHq5MFq";
var apiSecret = "zQFrjGe6jLDxqzsq9LwdUlg5C_HVxFM5w7AzfW6z3xks4sA_";
// See 'options' reference below
const client = new BitMEXClient(
{
  testnet: false, // set `true` to connect to the testnet site (testnet.bitmex.com)
  // Set API Key ID and Secret to subscribe to private streams.
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
exchange = new ccxt['bitmex'] (  {'apiKey': apiKey,
'secret': apiSecret})
var flastClose;
var fbalance;
	var list3 = [];//36 minute
	var first = true;
async function fetchOHLCV(){
let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));
if (exchange.has.fetchOHLCV) {
    var symbol = "BTC/USD";
	await sleep (exchange.rateLimit) // milliseconds
	var ONE_HOUR = 36 * 60 * 1000; /* ms */

	var since = (new Date().getTime() - ONE_HOUR)                       

	var candles = (await exchange.fetchOHLCV (symbol, '1m',since=since)) // one minute
	var last;
	for (var candle in candles){
		list3.push(candles[candle][4]);
		last = candles[candle][5];
	}
    }
	
	 var bal = await exchange.fetchBalance ()
	fbalance = bal.free.BTC;
	console.log(fbalance);
client.addStream('XBTUSD', 'tradeBin1m', async function (data, symbol, tableName) {
	if (first == true){
		first = false;
		flastClose = data[data.length-1].close;
	}
	console.log(data[data.length-1]);
	    var bal = await exchange.fetchBalance ()
		//profitablity.push([new Date(data[data.length-1].timestamp).getTime(), (100 * (-1 * (1 - (parseFloat(fbalance) / parseFloat(bal.free.BTC)))))]);
		xbtusdprices.push([new Date(data[data.length-1].timestamp).getTime(), (100 * (-1 * (1 - (parseFloat(flastClose) / parseFloat(data[data.length-1].close)))))]);
		console.log(xbtusdprices);
		console.log(profitablity);
  log+=data[data.length-1].close + "\r\n";
  list3.push(data[data.length-1].close);
	  var firstVal = ROC.calculate({period : 12, values : list3})

	  var secondVal = ROC.calculate({period : 24, values : list3})

	  var thirdVal	  = ROC.calculate({period : 36, values : list3})
	var one = (firstVal[firstVal.length - 1]);
	var two = (secondVal[secondVal.length - 1]);
	var three = (thirdVal[thirdVal.length - 1]);
	console.log(one);
	console.log(two);
	console.log(three);
	if (one > 0 && two > 0 && three > 0){
		//buy!buy!
		leverage();
		buy(list3[list3.length - 1]);
	}
	if (one < 0 && two < 0 && three < 0){
		//sell! sell!
		leverage();
		sell(list3[list3.length-1]);
	}
});
}
var lot = 0.001;

function sell(close){
var verb = 'POST',
  path = '/api/v1/order',
  expires = new Date().getTime() + (60 * 1000), // 1 min in the future
  data = {symbol:'XBT/USD',orderQty:-1*lot,price:close,ordType:"Limit"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
var postBody = JSON.stringify(data);

var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

var headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
  // https://testnet.bitmex.com/app/apiKeysUsage for more details.
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

var requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
request(requestOptions, function(error, response, body) {
});	
}
function buy(close){
var verb = 'POST',
  path = '/api/v1/order',
  expires = new Date().getTime() + (60 * 1000), // 1 min in the future
  data = {symbol:'XBT/USD',orderQty:lot,price:close,ordType:"Limit"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
var postBody = JSON.stringify(data);

var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

var headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
  // https://testnet.bitmex.com/app/apiKeysUsage for more details.
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

var requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
request(requestOptions, function(error, response, body) {
});	
}

function leverage(){
	var verb = 'POST',
  path = '/api/v1/position/leverage',
  expires = new Date().getTime() + (60 * 1000), // 1 min in the future
  data = {symbol:'XBT/USD',leverage:0};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
var postBody = JSON.stringify(data);

var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

var headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
  // https://testnet.bitmex.com/app/apiKeysUsage for more details.
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

var requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};

request(requestOptions, function(error, response, body) {
  console.log(body);
});

}

fetchOHLCV();

var xbtusdprices = []
var profitablity = []


app.get('/', (req, res) => {
var msg = "";
msg = msg + "<html><body><script src=\"https://code.jquery.com/jquery-3.1.1.min.js\"></script><div id=\"container\" style=\"height: 400px; min-width: 310px\"></div><script src=\"https://code.highcharts.com/stock/highstock.js\"></script><script src=\"https://code.highcharts.com/stock/modules/exporting.js\"></script>";
msg = msg + "<script>$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/new-intraday.json', function (data){ Highcharts.stockChart('container',{title:{text: 'XBT/USD Perpetual'}, rangeSelector:{buttons: [{type: 'minute', count: 1, text: '1m'},{type: 'day', count: 1, text: '1D'},{type: 'all', count: 1, text: 'All'}], selected: 1, inputEnabled: false}, series: [{name: 'Profitability', type: 'line', data: " + JSON.stringify(profitablity) + ", tooltip:{valueDecimals: 2}},{name: 'XBT/USD', type: 'line', data: " + JSON.stringify(xbtusdprices) + ", tooltip:{valueDecimals: 2}}]});});</script>";
msg = msg +"</body></html>";
msg = msg + log;
	res.send(msg)
	
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))