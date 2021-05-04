require('dotenv').config();
const StripeController = require("./controllers/Stripe");
const express = require('express');
const mongoose = require('mongoose')
const app = express();


//! Intents 
app.post('/api/intents/create', StripeController.intents.create);
app.get('/api/intents/retrieve', StripeController.intents.retrieve);
app.put('/api/intents/update', StripeController.intents.update);

//! Payments
app.post('/api/payments/create', StripeController.payments.create);
app.post('/api/payments/saveToUser', StripeController.payments.savePaymentMethodToAnUser);
app.get('/api/payments/retrieve', StripeController.payments.retrieve);
app.put('/api/payments/update', StripeController.payments.update);


app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))