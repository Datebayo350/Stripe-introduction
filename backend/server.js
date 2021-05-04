require('dotenv').config();
const StripeController = require("./controllers/Stripe");
const express = require('express');
const mongoose = require('mongoose')
const app = express();
// app.use(express,urlencoded({ extended : true}));
// app.use(express.json())
//! Intents 
app.post('/api/intents/create', StripeController.intents.create);
app.get('/api/intents/retrieve', StripeController.intents.retrieve);
app.put('/api/intents/update', StripeController.intents.update);

app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))