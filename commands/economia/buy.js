const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/economy-model.js");
const schemaInv = require("../../models/inventory-model.js");
const schemaShop = require("../../models/shop-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'buy',
    aliases: ['comprar'],
    description: 'Compra un objeto de la economia',
    category: 'Economy',
    premium: false,
    args: true,
    uso: `<numero-producto>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {

    

    }
}

module.exports = command


                