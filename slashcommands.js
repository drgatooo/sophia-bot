const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const toml = require('toml')
const config = toml.parse(fs.readFileSync('./config/config.toml', 'utf-8'))
const { token, botId } = config
const commands = []
const slashcommandsFiles = fs.readdirSync('./slashcommands')

for (const folder of slashcommandsFiles) {
	const Folder = fs
		.readdirSync(`./slashcommands/${folder}/`)
		.filter((file) => file.endsWith('js'))
	for (const cmd of Folder) {
		const slash = require(`./slashcommands/${folder}/${cmd}`)
		commands.push(slash.data.toJSON())
	}
}

const rest = new REST({ version: '9' }).setToken(token)

createSlash()

async function createSlash() {
	try {
		await rest.put(Routes.applicationCommands(botId), {
			body: commands,
		})
		console.log('slash commands agregados.')
	} catch (e) {
		console.log(e)
	}
}
