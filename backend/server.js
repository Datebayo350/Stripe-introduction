require('dotenv').config();
const SECRET_API_KEY = process.env.SECRET_API_KEY;
const StripeController = require("./controllers/Stripe");
const asyncHandler = require("express-async-handler");
const stripe = require('stripe')(SECRET_API_KEY);
const mongoose = require('mongoose')
const express = require('express');
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/api/intents/create', async (req, res, next) => {

    console.log("req =>",req.body);
    try {
        const paymentIntention = await stripe.paymentIntents
        .create(req.body)

        return res.json({ sucess: true, secret: paymentIntention.client_secret})
    } 
    
    catch (error) {
        next(error);
    }

})

app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))