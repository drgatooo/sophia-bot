const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const setMute = require('../../models/setmuterole');
const ms = require("ms");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("tempmute")
    .setDescription("Da un mute temporal a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Menciona el usuario a mutear temporalmente.").setRequired(true))
    .addStringOption(o => o.setName("tiempo").setDescription("Tiempo total del mute temporal.").setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Razón del mute temporal.").setRequired(false)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

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
        const norol = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este servidor no cuenta con un rol de mute establecido.")
        .setColor("RED")
        const onmute = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este usuario ya se encuentra muteado.")
        .setColor("RED")
        const tiempo = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedes dar un mute de más de 6 horas.")
        .setColor("RED")

        const args = interaction.options
        const mencion = args.getMember("usuario")
        let time = args.getString("tiempo")
        var razon = args.getString("razon")
        let timer = ms(time)
        

        if(mencion == interaction.user.id) return interaction.reply({embeds: [noautomute], ephemeral: true})
        if(mencion == client.user.id) return interaction.reply({embeds: [noautomutebot], ephemeral: true})
        if(mencion.bot) return interaction.reply({embeds: [nomutebot], ephemeral: true})
        if(timer > 21600000) return interaction.reply({embeds: [tiempo], ephemeral: true})
        if(!razon){
            razon = "No especificada."
        }

        const muterol = await setMute.findOne({ServerID: interaction.guild.id})
        if(!muterol) return interaction.reply({embeds: [norol]})

        if(mencion.roles.cache.has(muterol.RoleID)) return interaction.reply({embeds: [onmute] })
        mencion.roles.add(muterol.RoleID)
        const muted = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`⚠ El usuario ${mencion} ha sido muteado:\n👮‍♀️**Staff:** <@${interaction.user.id}>,\n😐**Razón:** ${razon}`)
        .setColor("GREEN")
        interaction.reply({embeds: [muted]})

        const finmute = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`😎 Se ha acabado el mute de ${mencion}.`)
        .setColor("GREEN")
        await setTimeout(async function() {
            await mencion.roles.remove(muterol.RoleID)
            await interaction.channel.send({embeds: [finmute]})
        }, timer)
    }
}

module.exports = command;