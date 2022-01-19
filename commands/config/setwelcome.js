const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require('../../models/setWelcome')

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'setwelcome',
    aliases: ['swl'],
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

        let chid = message.mentions.channels.first()
        
        if (chid.type == 'GUILD_VOICE') {
            
            const noVoice = new MessageEmbed()
            .setTitle('❌ Error')
            .setDescription('ℹ Ese es un canal de voz!')
            .setColor('RED')
            
            return message.reply({embeds: [noVoice]})
        } else if (chid.type == 'GUILD_CATEGORY') {
            
            const noVoice = new MessageEmbed()
            .setTitle('❌ Error')
            .setDescription('ℹ Esa es una categoria!')
            .setColor('RED')
            
            return message.reply({embeds: [noVoice]})
        }


        const noArgs = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription('Menciona un canal!')

        
        if (!chid) return message.reply({embeds: [noArgs]})


        const invalidID = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription('Menciona un canal valido!')

        const sameID = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor('RED')
        .setDescription("El canal establecido tiene el mismo ID de antes, establece otro!")

        const success = new MessageEmbed()
        .setTitle('✅ Exito')
        .setColor('GREEN')
        .setDescription(`El canal de bienvenidas fue actualizado a <#${chid}>`)

        const successv2 = new MessageEmbed()
        .setTitle('✅ Exito')
        .setColor('GREEN')
        .setDescription(`El canal de bienvenidas fue establecido a <#${chid}>`)

        const channel = await schema.findOne({ ServerID: message.guild.id})

        if (!channel) {
            message.reply({embeds: [successv2]})
        } else if (channel && channel.ChannelID !== chid.id){
            message.reply({embeds: [success]})
        }

        if (channel && channel.ChannelID === chid.id) {
            return message.reply({embeds: [sameID]})
        }

        if (!message.guild.channels.cache.has(chid)){
            return message.reply({embeds: [invalidID]}) 
        } else {

            let ch = new schema({
                ServerID: message.guild.id,
                ChannelID: chid.id
            })

            channel ? await schema.updateOne({serverID: message.guild.id}, {ChannelID: chid.id}) : await ch.save()

        }

    }
}

module.exports = command