const { Schema, model } = require('mongoose')

const niveles = new Schema({
	ServerID: {
		type:   String,
		required: true,
	},
	UserID: {
		type:   String,
		required: true,
	},
	XP: {
		type: Number,
		default: 0,
	},
	Nivel: {
		type: Number,
		default: 0,
	},
	Limit: {
		type: Number,
		default: 100,
	},
})

module.exports = model('Niveles', niveles)