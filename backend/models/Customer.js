const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: {type: String, required: true},
    phone:{type: Number, required: true},
    email:{type: String, required: true},
    address: {
        city: String,
        country: String,
        state: String,
        postal_code: Number,
    },
    balance: Number,
    description:{type: String, required: true},

})

module.exports = mongoose.model('customer', CustomerSchema);