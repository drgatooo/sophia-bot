const client = require('../index')
const { cyan, green, red, yellow } = require('colors'),
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

	const AutoPresence = () => {
		const status = {
			activities: [
				'/help',
				'/invite',
				'¡SOPHIA 3.1.4!',
				`${client.guilds.cache.size} servidores.`,
				`${client.guilds.cache.reduce(
					(prev, guild) => prev + guild.memberCount,
					0,
				)} Usuarios.`,
				'Unifyware Association.',
			],
			activity_types: ['WATCHING', 'PLAYING', 'LISTENING', 'COMPETING'],
		}

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

	console.log(yellow('Presencia del bot cargada exitosamente.'))

	client.channels.cache.get('940695048339734600').send('test')
})
