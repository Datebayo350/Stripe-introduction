require('dotenv').config();
const SECRET_CLEVER_DATABSE_CONNECTION = process.env.SECRET_CLEVER_DATABSE_CONNECTION;
const StripeController = require("./controllers/Stripe");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose')
const express = require('express');
const cors = require("cors");
const app = express();

try {
    mongoose.connect(SECRET_CLEVER_DATABSE_CONNECTION,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true, 
        autoIndex: true,
    })
    console.log("Connexion database réussie !");
} catch (error) {
    console.log(error);
}

//! Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//! Intents (intentions de paiement)
app.post('/api/intents/create', StripeController.intents.create);
app.get('/api/intents/retrieve', StripeController.intents.retrieve);
app.put('/api/intents/update', StripeController.intents.update);

//! Payments (moyens de paiement)
app.post('/api/payments/create', StripeController.payments.create);
app.post('/api/payments/saveToUser', StripeController.payments.savePaymentMethodToAnUser);
app.get('/api/payments/retrieve', StripeController.payments.retrieve);
app.put('/api/payments/update', StripeController.payments.update);

//! Customers
app.post('/api/customers/create', StripeController.customers.create);
app.get('/api/customers/retrieveAll', StripeController.customers.retrieveAll);
app.post('/api/customers/retrieve', StripeController.customers.retrieve);
app.put('/api/customers/update', StripeController.customers.update);

//! Prices
app.get('/api/prices/retrieveAll', StripeController.prices.retrieveAll);
app.post('/api/prices/retrieve', StripeController.prices.retrieve);
// app.post('/api/prices/create', StripeController.prices.create);
// app.get('/api/prices/retrieve', StripeController.prices.retrieve);
// app.put('/api/prices/update', StripeController.prices.update);

//! Products
app.get('/api/products/retrieveAll', StripeController.products.retrieveAll);
// app.post('/api/products/create', StripeController.products.create);
// app.get('/api/products/retrieve', StripeController.products.retrieve);
// app.put('/api/products/update', StripeController.products.update);

//! Sessions
app.post('/api/sessions/create', StripeController.sessions.create);
app.get('/api/sessions/retrieveAll', StripeController.sessions.retrieveAll);
// app.get('/api/sessions/retrieve', StripeController.sessions.retrieve);
// app.put('/api/sessions/update', StripeController.sessions.update);

//! Subscriptions
app.get('/api/subscriptions/retrieveAll', StripeController.subscriptions.retrieveAll);
// app.post('/api/subscriptions/create', StripeController.subscriptions.create);
// app.get('/api/subscriptions/retrieve', StripeController.subscriptions.retrieve);
// app.put('/api/subscriptions/update', StripeController.subscriptions.update);

app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))