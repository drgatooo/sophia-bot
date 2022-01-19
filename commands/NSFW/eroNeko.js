const { Client, Message, MessageEmbed } = require('discord.js')
const nekoClient = require('nekos.life');
const {nsfw} = new nekoClient();
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'eroneko',
    aliases: [],
    description: '👀 Mira Neko con forma de Ero',
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
        
        let { url } = await nsfw.eroNeko()
        
        let eroNekoEmbed = new MessageEmbed()
        .setTitle('🕵️‍♀️ Aca tenes amigo mio ;)')
        .setColor('BLACK')
        .setImage(url)
        return message.reply({embeds: [eroNekoEmbed]})

    }
}

module.exports = command