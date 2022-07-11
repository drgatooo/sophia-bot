const { Schema, model } = require('mongoose')

const schema = new Schema({
	ServerID: String,
	channels: [
		{
			channelID: String,
			channelYTID: String,
		},
	],
})

module.exports = model('yt-notification', schema)