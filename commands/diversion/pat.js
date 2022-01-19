const { Client, Message, MessageEmbed } = require('discord.js');
const { pat } = require('../../helpers/gifs.js');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'pat',
    aliases: ['acariciar'],
    description: 'acaricia a un usuario',
    category: 'Diversion',
    args: true,
    uso: '<@usuario>',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
		let mention = message.mentions.members.first(); //-- define mention
  		if(!mention || mention.user.id == message.author.id || mention.user.bot) return message.channel.send('menciona a un usuario valido, que no seas tu y no sea un bot!');
  		message.reply({embeds: [
    		new MessageEmbed()
    			.setTitle(`${message.author.username} a acariciado a ${mention.user.username}`)
    			.setImage(pat[Math.floor(Math.random() * pat.length)])
    			.setColor('RANDOM')
    			.setFooter(`${message.author.username}`, `${message.author.avatarURL()}`)
    			.setTimestamp()
  			]
         });
    }
}

module.exports = command