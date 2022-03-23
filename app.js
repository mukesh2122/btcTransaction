var express = require('express');
var bodyParser = require('body-parser');
const CryptoAccount = require("send-crypto");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/createWallet', async function(req, res){
	const privateKey = CryptoAccount.newPrivateKey();
	const account = new CryptoAccount(privateKey, { network: "testnet" });
	var btcAddress = await account.address("BTC");
	res.json({privateKey, btcAddress});
});

app.get('/walletBalance/:privateKey', async function(req, res){
	const { privateKey } = req.params;
	const account = new CryptoAccount(privateKey, { network: "testnet" });
	var btcBalance = await account.getBalance("BTC");
	res.json({ btcBalance });
});

app.get('/sendBtc/:privateKey/:receiverAddress/:btc', async function(req, res){
	try{
		const { privateKey, receiverAddress, btc } = req.params;
		const account = new CryptoAccount(privateKey, { network: "testnet" });
		const txHash = await account.send("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", btc, "BTC")
		.on("transactionHash", function(result){
			res.json({
			  status: 1,
			  result
			});
		})
		.on("confirmation", function(result){
			res.json({
			  status: 1,
			  result
			});
		});
	} catch (err) {
      return res.json({ status: 0, result: err.message });
    }
});

app.listen(8080);