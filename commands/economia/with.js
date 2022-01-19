const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/economy-model.js");
const schemaBank = require("../../models/bank-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'with',
    aliases: ['withdraw', 'retirar'],
    description: 'Retira dinero de tu banco',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: `<cantidad | all>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        

    }
}

module.exports = command


                