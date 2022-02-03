const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const nekoClient = require('nekos.life');
const {nsfw} = new nekoClient();

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    category: "NSFW",
    data: new SlashCommandBuilder()
    .setName("trap")
    .setDescription("Observa contenido NSFW"),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        if(!interaction.channel.nsfw) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription("No estamos en un canal NSFW, para poder usar el comando vamos a uno con el filtro NSFW activado.")
                .setColor("RED")
            ]
        })

        let { url } = await nsfw.trap()
        
        const titsEmbed = new MessageEmbed()
        .setTitle('🕵️‍♀️ Acá tienes amigo mío ;)')
        .setColor('BLACK')
        .setImage(url)
        return interaction.reply({embeds: [titsEmbed]})

    }
}

module.exports = command;