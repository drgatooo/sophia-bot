const { Schema, model } = require('mongoose')

const schema = new Schema({
	ServerID: String,
	ChannelYTID: {
		type: String,
		default: 'No defined',
	},
	ChannelID: {
		type: String,
		default: 'No defined',
	},
	Title: {
		type: String,
		default: 'No defined',
	},
})

module.exports = model('yt-notification', schema)