const { Schema, model } = require('mongoose')

const schema = new Schema({
    ServerID : String,
    RoleID : String
})

module.exports = model('MuteRole', schema)