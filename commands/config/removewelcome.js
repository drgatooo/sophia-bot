const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require('../../models/setWelcome')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'deletewelcome',
    aliases: ['dwl'],
    description: 'delete the welcome channel!',
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
        .setDescription('Provides an ID!')

        if (!chid) return message.reply({embeds: [noArgs]})

        let channelid = message.guild.channels.resolveId(chid.id || chid)


        const invalidID = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription('Provides a valid ID!')

        const success = new MessageEmbed()
        .setTitle('✅ Success')
        .setColor('GREEN')
        .setDescription(`The welcome channel has been deleted!`)

        const error = new MessageEmbed()
        .setTitle('❌ Error')
        .setDescription("The welcome channel don't exists!")
        .setColor('RED')


        const channel = await schema.findOne({ ServerID: message.guild.id})

        if (!message.guild.channels.cache.has(channelid)){
            return message.reply({embeds: [invalidID]}) 
        }
        if (!channel || channel && channel.ChannelID !== channelid) {
            return message.reply({embeds: [error]})
        } else {
            message.reply({embeds: [success]})
            const deleted = await schema.findOneAndDelete({ServerID: message.guild.id})
        }


    }
}

module.exports = command
