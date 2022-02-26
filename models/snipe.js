const { Schema, model } = require("mongoose")

const snipe = new Schema({
    channelid: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    time: {
        type: Number,
        required: true
    }
})

module.exports = model("snipe", snipe)