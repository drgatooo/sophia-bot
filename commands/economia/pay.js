const { Client, Message, MessageEmbed } = require('discord.js');
const schema = require('../../models/economy-model.js');
const add = require('../../helpers/add-money.js');
const remove = require('../../helpers/remove-money.js');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'pay',
    aliases: ['pagar', 'dardinero', 'give-money'],
    description: 'Da de tu dinero a un usuario.',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: `<@usuario> <cantidad>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        

    }
}

module.exports = command


                