const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const snipe = require("../../models/snipe");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["MANAGE_MESSAGES"],
    botPerms: ["MANAGE_MESSAGES"],
    isPremium: true,
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("¿Borraron un mensaje? leelo!"),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const data = await snipe.findOne({ channelid: interaction.channel.id })
        
        if(!data){
            return interaction.reply({embeds: [
                new MessageEmbed()
                    .setTitle(":x: Error")
                    .setDescription("No se ha borrado ningún mensaje recientemente...")
                    .setColor("RED")
                ], ephemeral: true
            })
        } else {
            const embed = new MessageEmbed()
            .setTitle(`Mensaje eliminado por: ${data.author}`)
            .setDescription(`**Mensaje:**\n\`${data.message}\``)
            .addField(`Tiempo:`, `<t:${data.time}:R>`, true)
            .addField(`Canal:`, `<#${data.channelid}>`, true)
            .setColor("GREEN")
            .setTimestamp()

            return interaction.reply({embeds: [embed]})
        }

    }
}

module.exports = command;