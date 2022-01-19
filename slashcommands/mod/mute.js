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
    .setName("mute")
    .setDescription("Mutea a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Menciona al usuario a mutear").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const norol = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este servidor no cuenta con un rol de mute establecido.")
        .setColor("RED")
        const noautomute = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No te puedes mutear a ti mismo.")
        .setColor("RED")
        const nomutebot = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedes mutearme a mi misma.")
        .setColor("RED")
        const noautomutebot = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedes mutear a un bot.")
        .setColor("RED")
        const onmute = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este usuario ya se encuentra muteado.")
        .setColor("RED")

        const args = interaction.options
        const mencion = args.getMember("usuario")
        if(mencion == interaction.user.id) return interaction.reply({embeds: [noautomute], ephemeral: true})
        if(mencion == client.user.id) return interaction.reply({embeds: [noautomutebot], ephemeral: true})
        if(mencion.bot) return interaction.reply({embeds: [nomutebot], ephemeral: true})

        const muterol = await setMute.findOne({ServerID: interaction.guild.id})
        if(!muterol) return interaction.reply({embeds: [norol], ephemeral: true})

        if(mencion.roles.cache.has(muterol.RoleID)) return interaction.reply({embeds: [onmute], ephemeral: true })
        mencion.roles.add(muterol.RoleID)
        const muted = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`⚠ El usuario ${mencion} ha sido muteado:\n👮‍♀️**Staff:** <@${interaction.user.id}>`)
        .setColor("GREEN")
        interaction.reply({embeds: [muted]})

    }
}

module.exports = command;