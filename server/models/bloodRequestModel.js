// IMPORTS -
const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },

    requestedAddress

});


