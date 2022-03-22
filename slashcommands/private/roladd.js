const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    devOnly: true,
    category: "private",

    data: new SlashCommandBuilder()
    .setName("roladd")
    .setDescription("Sin descripción."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const promesas = [
            client.shard.broadcastEval((c) => c.guilds.cache.map((guild) => guild.members.cache))
        ]
        Promise.all(promesas).then(async results => {
        
        const guildNum = results[0].reduce((acc, guildCount) => acc + guildCount, 0)
    
        let supportGuild = client.guilds.cache.get(config.supportID)
        let servers = guildNum

        let owners = await supportGuild.members.fetch(servers[i].ownerId)
        if(!owners){
            return interaction.reply({content: "No existen owners dentro del servidor."})
        }

        //if(interaction.guild.id !== config.supportID) return interaction.reply({embeds: [new MessageEmbed().setDescription("Este servidor no es el de soporte.").setColor("RED")], ephemeral: true})
        
        for(var i in servers){
            owners.roles.add(config.rolID).catch(console.log)
            console.log(`Rol añadido a ${owners.user.tag}`)
        }

        interaction.reply({ content: "Acción finalizada", ephemeral: true })
        })
    }
}

module.exports = command;