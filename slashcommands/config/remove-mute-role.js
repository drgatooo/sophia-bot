const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const setMute = require('../../models/setmuterole');

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['MANAGE_GUILD'],
    category: "Configuración",


    data: new SlashCommandBuilder()
    .setName("remove-mute-role")
    .setDescription("Elimina el rol de mute de este servidor."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(_, interaction){
        const deleted = new MessageEmbed()
        .setTitle("✅ Hecho!")
        .setDescription("El rol de mute en este servidor ha sido eliminado.")
        .setColor("GREEN")
        
        const muterol = await setMute.findOne({ ServerID: interaction.guild.id});

        if(muterol){
            await setMute.deleteOne({ ServerID: interaction.guild.id});
            return await interaction.reply({ embeds: [deleted] });
        } else {
            return await interaction.reply({ embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription("No hay un rol de mute en este servidor.")
                .setColor("RED")
            ], ephemeral: true });
        }
    }
}

module.exports = command;