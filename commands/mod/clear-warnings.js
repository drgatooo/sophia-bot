const Discord = require('discord.js');
const { Client, Message, MessageEmbed } = Discord;

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'clear-warnings',
    aliases: ['clear-warns', 'eliminar-advertencias'],
    userPerms: ['KICK_MEMBERS'],
    description: 'Elimina todas las advertencias de un usuario',
    args: true,
    uso: '<@usuario>',
    category: 'Moderation',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
  
    }
}

module.exports = command