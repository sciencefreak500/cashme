'use strict';

var util = require('util');
var express = require('express');
var braintree = require('braintree');
var bodyParser = require('body-parser')
var app = express();
var jsonParser = bodyParser.json();


/**
 * Enable CORS (http://enable-cors.org/server_expressjs.html)
 * to allow different clients to request data from your server
 */
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "s5t9mc389gbmpmq8",
  publicKey: "fs7qxrnhy2ffp3hd",
  privateKey: "233afe3b87a7e9123f2a45a5a81d9e57"
});
app.get("", function(req, res){
  res.write("This is the server for generating Braintree client token!")
  res.end();
})
app.post("/client_token", function(req, res){
  gateway.clientToken.generate({}, function(err, response){
    res.json({
      "client_token": response.clientToken
    });
  })
})

app.post("/add_payment_method", jsonParser, function(req, res){
  var data = req.body;
  var nonce = data.payment_method_nonce;
  var email = data.email;
  var customer_id = data.customer_id; //this is same as firebase UID
  console.log("nonce", nonce);

  //Create customer
  gateway.customer.find("customer_id", function(err, customer){
    if (err){
      console.log(err);
    }
  })
  // gateway.customer.create({
  //   id: customer_id,
  //   email: email,
  //   paymentMethodNonce: nonce
  // }).then(function(err, result){
  //   if (err){
  //     console.error(err);
  //   }
  //   res.send(result.success); //true if success
  // })

})

app.listen(3000, function() {
  console.log("Listening on port 3000!");
})
