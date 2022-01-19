// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require('../../models/setModLogs')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'setmodlogs',
    aliases: ['sml'],
    description: 'Establece el canal de logs!',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Configuration',
    premium: false,

     /** 
    * @param {Client} client
    * @param {MessageEmbed} MessageEmbed
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        let chid = message.mentions.channels.first() || args[0]

        const noArgs = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription('¨Pon una ID!')

        if (!chid) return message.reply({embeds: [noArgs]})


        let channelid = message.guild.channels.resolveId(chid.id || chid)


        const invalidID = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription('Po una ID valida!')

        const sameID = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription("El canal establecido tiene el mismo ID de antes, establece otro!")

        const success = new MessageEmbed()
        .setTitle('✅ Exito')
        .setColor('GREEN')
        .setDescription(`El nuevo canal de logs fue actualizado en el canal: <#${channelid}>`)

        const successv2 = new MessageEmbed()
        .setTitle('✅ Exito')
        .setColor('GREEN')
        .setDescription(`El nuevo canal de logs fue creado en el canal: <#${channelid}>`)

        const channel = await schema.findOne({ ServerID: message.guild.id})

        if (!channel) {
            message.reply({embeds: [successv2]})
        } else if (channel && channel.ChannelID !== channelid){
            message.reply({embeds: [success]})
        }

        if (channel && channel.ChannelID === channelid) {
            return message.reply({embeds: [sameID]})
        }

        if (!message.guild.channels.cache.has(channelid)){
            return message.reply({embeds: [invalidID]}) 
        } else {

            let ch = new schema({
                ServerID: message.guild.id,
                ChannelID: channelid
            })

            channel ? await schema.updateOne({serverID: message.guild.id}, {ChannelID: channelid}) : await ch.save()

        }

    }
}

module.exports = command