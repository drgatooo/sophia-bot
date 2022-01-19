const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['MANAGE_CHANNELS'],
    botPerms: ['MANAGE_CHANNELS'],
    category: "premium",


    data: new SlashCommandBuilder()
    .setName("block-channel")
    .setDescription("Bloquea un canal para que no puedan usarlo. (comando deshabilitado por el momento)"),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
        return interaction.reply({
            content: 'comando deshabilitado por el momento.',
            ephemeral: true
        });
    }
}

module.exports = command;