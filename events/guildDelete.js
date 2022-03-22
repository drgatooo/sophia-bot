const client = require("../index.js")
const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"))
client.on(`guildDelete`, async (guild) => {

    const serverID = config.serverID
    const owner = await client.users.fetch(guild.ownerId)

    const promesas = [
        client.shard.fetchClientValues(`guilds.cache.size`),
        client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
    ]
    Promise.all(promesas).then(async results => {
        const guildNum = results[0].reduce((acc, guildCount) => acc + guildCount, 0)

    const llegue = new MessageEmbed()
    .setTitle('😔 Sophia ha abandonando un servidor! :(')
    .addField('ℹ Nombre del servidor:',`${guild.name}`,true)
    .addField('ℹ ID del servidor:',`${guild.id}`,true)
    .addField(`💔 Hemos perdido a:`, `${guild.memberCount} usuarios`)
    .addField('🌐 Owner:',`${owner.tag}`,true)
    .setFooter({text:`🎀 Estoy actualmente en: ${guildNum} servidores.`})
    .setThumbnail(guild.iconURL({dynamic: true}))
    .setColor('BLACK')
    
   	client.channels.cache.get(serverID).send({embeds: [llegue]}).catch(()=>{});
    
    let server = client.guilds.cache.get(config.supportID)
    let usu = await server.members.fetch(owner.id)

    usu.roles.remove(config.rolID).catch(console.log)
    })
})