const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/shop-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'item-info',
    aliases: ['iteminfo', 'infoitem'],
    description: 'Revisa la información de un item de la tienda',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: `<numero-item>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        

    }
}

module.exports = command


                