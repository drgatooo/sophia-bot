const { Client, MessageEmbed, MessageAttachment} = require('discord.js')
const { imagenesEspañol } = require('discord-memes');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'memes',
    aliases: ['mm'],
    description: 'Muestra un meme',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,
    uso: `meme`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        const attachment = new MessageAttachment(imagenesEspañol(), 'meme.jpg');
        message.reply({ embeds: [
            new MessageEmbed()
            	.setImage('attachment://meme.jpg')
            	.setColor('RANDOM')
        ], files: [attachment]});
    }
}

module.exports = command
