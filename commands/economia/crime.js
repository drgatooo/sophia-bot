const { Client, Message, MessageEmbed } = require('discord.js')
const add = require("../../helpers/add-money.js");
const remove = require("../../helpers/remove-money.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'crime',
    aliases: ['crimen'],
    description: 'Comete un delito en la economia',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: ``,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

    

    }
}

module.exports = command


                