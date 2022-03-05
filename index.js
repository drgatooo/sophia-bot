const { Collection, Client } = require("discord.js");
const { red, yellow, blue, green} = require("colors")
const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_VOICE_STATES",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    // "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
  ]});
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));
const token = config.token;
const { DiscordTogether } = require('discord-together');
const Distube = require("distube");
const discordModals = require('discord-modals');
discordModals(client);

client.discordTogether = new DiscordTogether(client);
client.queue = new Map()
module.exports = client;

client.commands = new Collection();
client.slashcommands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.distube = new Distube.default(client);

["event"].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './config/giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#00FFFF',
        embedColorEnd: 'RED',
        reaction: '🎉'
    }
});

client.giveawaysManager = manager

const slashcommandsFiles = fs.readdirSync("./slashcommands");
for(const folder of slashcommandsFiles){
    for(const cmd of fs.readdirSync(`./slashcommands/${folder}/`).filter(f => f.endsWith('.js'))){
        const slash = require(`./slashcommands/${folder}/${cmd}`)
        if(slash.data) {
	        console.log(yellow(`Comando (/) - ${cmd} cargado.`))
            client.slashcommands.set(slash.data.name, slash)
        } else {
            console.log(blue(`Comando (/) - ${cmd} no fue cargado`))
        }
        console.log(green(`${client.slashcommands.size} comandos cargados en total.`))
    }
}

for(const file of fs.readdirSync(`./eventos_distube/`)){
    if(file.endsWith(".js")){
        let fileName = file.substring(0, file.length - 3)
        let fileContents = require(`./eventos_distube/${file}`)
        client.distube.on(fileName, fileContents.bind(null, client))
    }
}

require('./web/index.js');

process.on('unhandledRejection', err => console.log(red('Al parecer hubo un error.\n' + err.stack)) );
client.on("shardError", err => console.log(red('Al parecer hubo un error.\n' + err.stack)) );
client.on("Error", err => console.log(red('Al parecer hubo un error.\n' + err.stack)) );
client.on("Warn", err => console.log(red('Al parecer hubo un error.\n' + err.stack)) );

client.login(token);