const { Schema, model } = require('mongoose')

const schema = new Schema({
    ServerID : String,
    Reason: String,
    ModeratorID: String,
    Date: Date,
    expire: Number
})

module.exports = model('blacklist-guild', schema)