const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const setMute = require('../../models/setmuterole');

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Desmutea a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Menciona al usuario a desmutear").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options

        const norol = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este servidor no cuenta con un rol de mute establecido.")
        .setColor("RED")
        const onmute = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este usuario no se encuentra muteado.")
        .setColor("RED")

        const mencion = args.getMember("usuario")
        const muterol = await setMute.findOne({ServerID: interaction.guild.id})
        if(!muterol) return interaction.reply({embeds: [norol], ephemeral: true })
        if(!mencion.roles.cache.has(muterol.RoleID)) return interaction.reply({embeds: [onmute], ephemeral: true })

        mencion.roles.remove(muterol.RoleID)
        const muted = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`⚠ El usuario ${mencion} ha sido desmuteado:\n👮‍♀️**Staff:** <@${interaction.user.id}>`)
        .setColor("GREEN")
        interaction.reply({embeds: [muted]})

    }
}

module.exports = command;