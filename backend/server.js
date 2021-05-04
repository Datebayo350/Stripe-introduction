require('dotenv').config();
const SECRET_API_KEY = process.env.SECRET_API_KEY;
const StripeController = require("./controllers/Stripe");
const express = require('express');
const mongoose = require('mongoose')
const stripe = require('stripe')(SECRET_API_KEY);
const app = express();



app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))