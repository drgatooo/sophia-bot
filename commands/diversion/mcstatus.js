const { Client, MessageEmbed, MessageAttachment } = require('discord.js');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'mcstatus',
    description: 'ver el estado de un servidor de minecraft',
    category: 'Diversion',
    args: true,
    uso: '<ip del servidor>',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
			const img = `http://status.mclive.eu/${args[0]}/${args[0]}/25565/banner.png`;
    		const attach = new MessageAttachment(img, 'info.png');
    		message.channel.send({files: [attach]});
    }
}

module.exports = command
