const { Client, Message, MessageEmbed, MessageAttachment } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'geotexto',
    aliases: ['gt'],
    description: 'Envia mensaje con la font de Geometry Dash.',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,
    uso: `geotexto <texto>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        const Error = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Escribe el texto que deseas imprimir.")
        .setColor("RED")

        const Error2 = new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedo imprimir una mención.")
        .setColor("RED")

        if(!args[0]) return message.reply({embeds: [Error]})
        let texto = args.join(' ');
        if(texto.length > 21) return message.reply('Solo puedes poner un maximo de 21 caracteres!');
        if(message.content.includes(message.mentions)) return message.reply({embeds: [Error2]})
        let attachment = new MessageAttachment(`https://gdcolon.com/tools/gdlogo/img/${texto}`, 'logo.png') 
        message.channel.send({ files: [attachment] });

    }
}

module.exports = command