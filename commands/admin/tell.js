const { Client, Message, MessageEmbed } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'tell',
    aliases: [],
    description: 'Envia un texto en un mensaje embed.',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Administration',
    premium: false,
    uso: `tell <texto>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        message.delete();
        const error = new MessageEmbed()
        .setDescription(":x: Debes introducir un texto!")
        .setColor("RED")

        let texto = args.slice(0).join(" ")
        if(!texto) return message.reply({embeds: [error] })

        const embed = new MessageEmbed()
        .setDescription(texto)
        .setColor("#00FFFF")

        message.channel.send({embeds: [embed] })
    }
}

module.exports = command