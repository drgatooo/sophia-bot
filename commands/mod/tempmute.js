const { Client, Message, MessageEmbed } = require('discord.js');
const setMute = require('../../models/setmuterole');
const ms = require("ms");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'tempmute',
    aliases: ['tm', `silencio-temporal`],
    description: 'Silencia a un usuario por un tiempo determinado!',
    userPerms: ['MANAGE_ROLES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Moderation',
    premium: false,
    uso: "tempmute @usuario tiempo razón",

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {try{
        const time0 = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Debes introducir el tiempo de mute.")
        .setColor("RED")
        const nomention = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Debes mencionar a un usuario.")
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
        const norol = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este servidor no cuenta con un rol de mute establecido.")
        .setColor("RED")
        const onmute = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Este usuario ya se encuentra muteado.")
        .setColor("RED")

        let time = args[1]
        if(!time) return message.reply({embeds: [time0]})
        let timer = ms(time)
        let mencion = message.mentions.members.first()
        if(!mencion) return message.reply({embeds: [nomention]})
        if(mencion == message.author.id) return message.reply({embeds: [noautomute]})
        if(mencion == client.user.id) return message.reply({embeds: [noautomutebot]})
        if(mencion.user.bot) return message.reply({embeds: [nomutebot]})
        var razon = args[2]
        if(!razon){
            razon = "No especificada."
        }

        const muterol = await setMute.findOne({ServerID: message.guild.id})
        if(!muterol) return message.reply({embeds: [norol]})

        if(mencion.roles.cache.has(muterol.RoleID)) return message.reply({embeds: [onmute] })
        mencion.roles.add(muterol.RoleID)
        const muted = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`⚠ El usuario ${mencion} ha sido muteado:\n👮‍♀️**Staff:** <@${message.author.id}>,\n😐**Razón:** ${razon}`)
        .setColor("GREEN")
        message.channel.send({embeds: [muted]})

        const finmute = new MessageEmbed()
        .setTitle("✅ Exito")
        .setDescription(`😎 Se ha acabado el mute de ${mencion}.`)
        .setColor("GREEN")
        await setTimeout(async function() {
            await mencion.roles.remove(muterol.RoleID)
            await message.channel.send({embeds: [finmute]})
        }, timer)

        }catch(err){console.log(err)}
    }
}

module.exports = command