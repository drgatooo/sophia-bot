const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/inventory-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'inventario',
    aliases: ['inv'],
    description: 'Revisa tu inventario de items',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: `<@usuario (opcional)>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {

                

    }
}

module.exports = command


                