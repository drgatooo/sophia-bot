const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const { imagenesEspañol } = require('discord-memes');

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {
    category: "Diversión",


    data: new SlashCommandBuilder()
    .setName("memes")
    .setDescription("Diviertete con memes!"),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
        const attachment = new MessageAttachment(imagenesEspañol(), 'meme.jpg');
        await interaction.reply({ embeds: [
            new MessageEmbed()
                .setImage('attachment://meme.jpg')
                .setColor('RANDOM')
        ], files: [attachment]});
    }
}

module.exports = command;