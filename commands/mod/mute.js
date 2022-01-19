const { Client, Message, MessageEmbed } = require('discord.js');
const setMute = require('../../models/setmuterole');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'mute',
    aliases: ['m', `silenciar`],
    description: 'Silencia a un usuario!',
    userPerms: ['MANAGE_ROLES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Moderation',
    premium: false,
    uso: "mute @usuario razón",

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        const nomention = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Debes mencionar a un usuario.")
        .setColor("RED")
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

        let mencion = message.mentions.members.first()
        if(!mencion) return message.reply({embeds: [nomention]})
        if(mencion == message.author.id) return message.reply({embeds: [noautomute]})
        if(mencion == client.user.id) return message.reply({embeds: [noautomutebot]})
        if(mencion.user.bot) return message.reply({embeds: [nomutebot]})

        const muterol = await setMute.findOne({ServerID: message.guild.id})
        if(!muterol) return message.reply({embeds: [norol]})

        if(mencion.roles.cache.has(muterol.RoleID)) return message.reply({embeds: [onmute] })
        mencion.roles.add(muterol.RoleID)
        const muted = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`⚠ El usuario ${mencion} ha sido muteado:\n👮‍♀️**Staff:** <@${message.author.id}>`)
        .setColor("GREEN")
        message.channel.send({embeds: [muted]})

    }
}

module.exports = command