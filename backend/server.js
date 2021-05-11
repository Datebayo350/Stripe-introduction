require('dotenv').config();
const SECRET_API_KEY = process.env.SECRET_API_KEY;
const StripeController = require("./controllers/Stripe");
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const asyncHandler = require("express-async-handler");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());



app.listen(5000, () => (console.log("Serveur démaré sur le port 5000")))