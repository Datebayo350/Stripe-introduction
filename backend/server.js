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

//! customers
app.post('/api/customers/create', StripeController.customers.create);
app.get('/api/customers/retrieve', StripeController.customers.retrieve);
app.put('/api/customers/update', StripeController.customers.update);

app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))