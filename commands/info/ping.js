const { Client, Message, MessageEmbed } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/
const command = {
    name: 'ping',
    aliases: ['p', 'pp'],
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Information',
    premium: false,
    dailyUses: 3,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
      
        let pinging = new MessageEmbed()
            .setTitle('🏓 Pinging...')
            .setColor('WHITE')
            .setDescription('⏳ Wait...')

        const mssage = await message.reply({ embeds: [pinging] }).then(msg => {

            let pinged = new MessageEmbed()
                .setTitle('📈 Pinged!')
                .setColor('GREEN')
                .setDescription(`**WebSocket** : **${client.ws.ping}** ms!\n**Discord API** : **${Math.floor(msg.createdAt - message.createdAt)}** ms!`)
        
        msg.edit({ embeds: [pinged] })
        })
    }
  }
  
module.exports = command