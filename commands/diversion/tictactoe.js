const { Client, Message, MessageEmbed } = require('discord.js');
const simpledjs = require('simply-djs');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'tictactoe',
    aliases: ['tres-en-raya', 'ttt'],
    description: 'Juega tictactoe con un oponente',
    category: 'Diversion',
    args: true,
    uso: '<@usuario>',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
		simpledjs.tictactoe(message, {
        xEmoji: '❌',
        oEmoji: '⭕',
        idleEmoji: '➖',
        embedColor: '#075FFF',
        embedFoot: 'Suerte!',
        credit: false
    });
    }
}

module.exports = command