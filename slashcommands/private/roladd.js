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

        let guild = client.guilds.cache.get(config.supportID)
        let servers = client.guilds.cache

        for(var i in servers){
            console.log("asd")
            let owners = await guild.members.fetch(servers[i].ownerId)
            if(!owners)return;

            owners.roles.add(config.rolID).catch(console.log)
            console.log(`Rol añadido a ${owners.user.tag}`)
        }

        interaction.reply({ content: "Acción finalizada", ephemeral: true })

    }
}

module.exports = command;