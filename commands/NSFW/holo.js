const { Client, Message, MessageEmbed } = require('discord.js')
const nekoClient = require('nekos.life');
const {nsfw} = new nekoClient();
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'nsfw-holo',
    aliases: ["nsfwholo"],
    description: '👀 Mira holo',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'NSFW',
    premium: false,
    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
        let { url } = await nsfw.holo()
        
        let holoEmbed = new MessageEmbed()
        .setTitle('🕵️‍♀️ Aca tenes amigo mio ;)')
        .setColor('BLACK')
        .setImage(url)
        return message.reply({embeds: [holoEmbed]})

    }
}

module.exports = command