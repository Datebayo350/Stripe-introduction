const StripeController = require("./controllers/Stripe");
const express = require('express');
const mongoose = require('mongoose')
const app = express();



app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))