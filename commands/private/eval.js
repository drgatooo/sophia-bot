const { Client, Message, MessageEmbed } = require('discord.js')
const { inspect } = require("util");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'eval',
    aliases: ['evaluar'],
    description: 'evalua un codigo js',
    category: 'Owner',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
		if(!args.join(" ")) return message.reply('escribe un codigo js');
        try {
        const js = eval(args.join(" "));
        message.reply('```js\n'+inspect(js, { depth: 0})+"```");
        } catch(err) {
            message.reply('```js\nerror: '+err+"```");
        }
    }
}

module.exports = command


                