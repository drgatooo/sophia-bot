const marketGame = require('../../helpers/marketGame.js')
const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'marketgame',
    aliases: ['supermarket'],
    description: 'Trata de agarrar toda la comida posible!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,
    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
        
		
        
        
  
        }
}

module.exports = command
