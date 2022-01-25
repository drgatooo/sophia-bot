const client = require("../index.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"))
client.on(`guildDelete`, async (guild) => {
    const serverID = config.serverID

    const llegue = new MessageEmbed()
    .setTitle('😔 Sophia abandonando un servidor!')
    .addField('ℹ Nombre del servidor:',`${guild.name}`,true)
    .addField('ℹ ID del servidor:',`${guild.id}`,true)
    .addField('🌐 Owner:',`${guild.owner.tag}`,true)
    .setFooter({text:`🎀 Estoy actualmente en: ${client.guilds.cache.size} servidores.`})
    .setThumbnail(guild.iconURL({dynamic: true}))
    .setColor('BLACK')
    
   	client.channels.cache.get(serverID).send({embeds: [llegue]}).catch(()=>{});

})