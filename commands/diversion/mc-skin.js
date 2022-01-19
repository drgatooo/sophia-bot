const { Client, Message, MessageEmbed, MessageAttachment } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'mc-skin',
    aliases: ['mcskin'],
    description: 'Ve una skin de minecraft',
    args: true,
    uso: "<nombre de la skin>",
    category: 'Diversion',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
		if(args[0].length > 16) return message.reply("El maximo son 16 caracteres!");
        if(require('../../helpers/hasEmoji.js')(args[0])) return message.reply('No puedes pasar un emoji como nombre!');

    const skin = `https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${args[0]}/700`;

    const attachSkin = new MessageAttachment(skin, 'skin.png');

    const embedSuccess = new MessageEmbed()
        .setDescription("Skin de: `"+args[0]+"` **(si es una skin innexistente saldra una por defecto)**")
        .setImage("attachment://skin.png")
        .setColor("#00ff00")
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    message.reply({ embeds: [embedSuccess], files: [attachSkin] });
    }
}

module.exports = command