const client = require('../index')
const { cyan, green, red } = require('colors'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	toml = require('toml'),
	config = toml.parse(fs.readFileSync('./config/config.toml', 'utf-8')),
	mongoURl = config.MongoDB_URL

client.once('ready', async () => {
	mongoose
		.connect(mongoURl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log(green('conectado a MongoDB'))
		})
		.catch((err) => {
			console.log(red(err))
		})
	console.log(
		`cliente listo en: ${cyan(`${client.user.tag}`)}` +
			'\n' +
			cyan(`
░██████╗░█████╗░██████╗░██╗░░██╗██╗░█████╗░
██╔════╝██╔══██╗██╔══██╗██║░░██║██║██╔══██╗
╚█████╗░██║░░██║██████╔╝███████║██║███████║
░╚═══██╗██║░░██║██╔═══╝░██╔══██║██║██╔══██║
██████╔╝╚█████╔╝██║░░░░░██║░░██║██║██║░░██║
╚═════╝░░╚════╝░╚═╝░░░░░╚═╝░░╚═╝╚═╝╚═╝░░╚═╝`),
	)

	const status = {
		activities: [
			'/help',
			'/invite',
			'¡SOPHIA 3.1.3!',
			`${client.guilds.cache.size} servidores.`,
			`${client.guilds.cache.reduce(
				(prev, guild) => prev + guild.memberCount,
				0,
			)} Usuarios.`,
			'Unifyware Association.',
		],
		activity_types: ['WATCHING', 'PLAYING', 'LISTENING', 'COMPETING'],
	}

	const AutoPresence = () => {
		const aleanum = Math.floor(Math.random() * status.activities.length)
		client.user.setPresence({
			activities: [
				{
					name: status.activities[aleanum],
					type: status.activity_types[aleanum],
				},
			],
		})
	}

	AutoPresence()
	setInterval(() => {
		AutoPresence()
	}, 60000)

	client.super.cache.purgeAll()

	console.log('Presencia del bot cargada exitosamente.')
})
