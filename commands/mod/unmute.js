const { Client, Message, MessageEmbed } = require('discord.js');
const setMute = require('../../models/setmuterole');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'unmute',
    aliases: ['um', `desilenciar`],
    description: 'Quitale el mute a un usuario!',
    userPerms: ['MANAGE_ROLES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Moderation',
    premium: false,
    uso: "unmute @usuario",

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {try{
        const nomention = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Debes mencionar a un usuario.")
        .setColor("RED")
        const norol = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este servidor no cuenta con un rol de mute establecido.")
        .setColor("RED")
        const onmute = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este usuario no se encuentra muteado.")
        .setColor("RED")

        let mencion = message.mentions.members.first()
        if(!mencion) return message.reply({embeds: [nomention]})

        const muterol = await setMute.findOne({ServerID: message.guild.id})
        if(!muterol) return message.reply({embeds: [norol]})

        if(!mencion.roles.cache.has(muterol.RoleID)) return message.reply({embeds: [onmute] })
        mencion.roles.remove(muterol.RoleID)
        const muted = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`⚠ El usuario ${mencion} ha sido des muteado:\n👮‍♀️**Staff:** <@${message.author.id}>`)
        .setColor("GREEN")
        message.channel.send({embeds: [muted]})


        }catch(err){console.log(err)}
    }
}

module.exports = command