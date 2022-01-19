const { Client, Message, MessageEmbed } = require('discord.js');
const gifs = require('../../helpers/gifs.js');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'highfive',
    aliases: ['chocar-5'],
    description: 'haz un highfive con un usuario',
    args: true,
    uso: '<@usuario>',
    category: 'Diversion',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
const mention = message.mentions.members.first();
    if(!mention) return message.reply('Menciona a un usuario valido!');
    if(mention.user.id === message.author.id || mention.user.bot) return message.reply('Menciona a alguien que no seas tú, ni sea un bot');

    message.reply({ embeds: [
        new MessageEmbed()
        .setTitle(message.author.username+' y '+mention.user.username+" hicieron un highfive")
        .setImage(gifs.highfive[Math.floor(Math.random() * gifs.highfive.length)])
        .setColor('RANDOM')
        .setTimestamp()
    ]});
    }
}

module.exports = command