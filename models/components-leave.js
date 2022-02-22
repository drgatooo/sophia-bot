const { Schema, model } = require('mongoose')

const schema = new Schema({
    ServerID : String,
    Title: String,
    Description: String,
    Footer: String
})

module.exports = model('leave-components', schema)