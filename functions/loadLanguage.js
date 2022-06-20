const csvParser = require('csv-parser'),
	{ createReadStream } = require('fs'),
	{ green } = require('colors')

module.exports = async (client) => {
	createReadStream('./language.csv')
		.pipe(csvParser({}))
		.on('data', (data) => {
			client.language.set(data.key, delKey(data))
		})
		.on('end', () => {
			console.log(green('Se cargaron los idiomas correctamente'))
		})
}

function delKey(data) {
	delete data.key
	return data
}
