require('dotenv').config();
const StripeController = require("./controllers/Stripe");
const express = require('express');
const mongoose = require('mongoose')
const app = express();

//! Intents 
app.post('/api/intents/create', StripeController.intents.create);


app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))