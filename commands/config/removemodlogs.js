// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS

const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require('../../models/setModLogs')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'deletewelcome',
    aliases: ['dwl'],
    description: 'remueve el canal de bienvenidas!',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Configuration',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        
        let chid = message.mentions.channels.first() || args[0]

        const noArgs = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription('Pon una ID!')

        if (!chid) return message.reply({embeds: [noArgs]})

        let channelid = message.guild.channels.resolveId(chid.id || chid)


        const invalidID = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription('Pon una ID valida')

        const success = new MessageEmbed()
        .setTitle('✅ Exito')
        .setColor('GREEN')
        .setDescription(`El canal de bienvenidas fue eliminado con exito!`)

        const error = new MessageEmbed()
        .setTitle('❌ Error')
        .setDescription("El canal de bienvenidas no existe!")
        .setColor('RED')


        const channel = await schema.findOne({ ServerID: message.guild.id})

        if (!message.guild.channels.cache.has(channelid)){
                return message.reply({embeds: [invalidID]}) 
        }
        if (!channel || channel && channel.ChannelID !== channelid) {
                return message.reply({embeds: [error]})
        } else {
            message.reply({embeds: [success]})
                await schema.findOneAndDelete({ServerID: message.guild.id})
        }


    }
}

module.exports = command
