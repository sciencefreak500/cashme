'use strict';

var util = require('util');
var express = require('express');
var braintree = require('braintree');
var bodyParser = require('body-parser')
// livereload = require('express-livereload')
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
  var customer;
  var data = req.body;
  var nonce = data.payment_method_nonce;
  var email = data.email;
  var customer_id = data.customer_id; //this is same as firebase UID

  //For editing credit card details
  var existingToken;
  if (data.existingToken){
    existingToken = data.existingToken;
  }
  console.log("nonce", nonce);

  //Create customer
  gateway.customer.find(customer_id, function(err, cust){
    if (err){
      if (err.type=="notFoundError"){
        console.log("not found customer");
        customer = createCustomer(customer_id, email, nonce);

        res.send(customer);

      }

    }
    else{
      console.log("Found customer", customer);
      customer = updateCustomer(customer_id, nonce, existingToken);
      res.send(customer);

    }
  })


})

app.post("/customer_info", jsonParser, function(req, res){
  var data = req.body;
  var customer_id = data.customer_id;
  // customer_id = data.customer_id;

  
  gateway.customer.find(customer_id, function(err, cust){
    if (err){
      res.send("Not found")
    }
    else{
      res.send(cust);
    }
  })
})
app.listen(3000, function() {
  console.log("Listening on port 3000!");
})

/**
 * [createCustomer creates a customer with id (firebase UID), email, and a payment nonce]
 * @param  {[type]} customer_id [description]
 * @param  {[type]} email       [description]
 * @param  {[type]} nonce       [description]
 * @return {[customer]}             [return the newly created customer]
 */
function createCustomer(customer_id, email, nonce){
  gateway.customer.create({
    id: customer_id,
    email: email,
    paymentMethodNonce: nonce
  }).then(function(err, result){
    if (err){
      console.error(err);
    }
    else{
      return result;
    }
  })
}

/**
 * [updateCustomer: Updates credit card information]
 * @param  {[type]} customer_id   [description]
 * @param  {[type]} nonce         [description]
 * @param  {[type]} existingToken [if existingToken exists, update payment method instead of create new one]
 * @return {[type]}               [description]
 */
function updateCustomer(customer_id, nonce, existingToken){
  //Updating payment method, not creating new one
  //NOTE: Only works for credit cards, other payment methods are updated differently
  if (existingToken){
    gateway.customer.update(customer_id, {
      paymentMethodNonce: nonce,
      creditCard: {
        options: { updateExistingToken: existingToken}
      }
    }, function(err, result){
      return result; //return updated customer
    })
  }

  //Else create a new payment method
  else {
    gateway.customer.update(customer_id, {
      paymentMethodNonce: nonce
    }, function (err, result){
      return result; //Returns updated customer
    })
  }
}

// function findCustomer(customer_id){
//   gateway.customer.find(customer_id, function(err, customer){
//     if (err){
//       return "Customer not found!";
//     }
//     else {
//       return customer;
//     }
//   })
// }
