const { Client, Message, MessageEmbed } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'reportbug',
    description: 'reporta un bug',
    category: 'Information',
	args: true,
    uso: '<bug>',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        client.channels.cache.get('904547739583520819').send({ embeds: [
            new MessageEmbed()
            .setTitle('han reportado un bug!')
            .setDescription('**bug reportado por:** '+message.author.tag+'\n\n**reporte:**\n'+args.join(" "))
        ]});
		message.reply('bug enviado correctamente.');
    }
}

module.exports = command


                