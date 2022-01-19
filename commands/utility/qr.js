const { Client, MessageEmbed, MessageAttachment } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'qr',
    description: 'Genera un codigo qr facilmente',
    category: 'Utility',
    args: true,
    uso: '<url | texto>',
    premium: false,
    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
	text = args[0];
    const img = `http://qr-code-generator.iwwwit.com/image.php?${text}&err=L&back=255-255-255&fore=0-0-0&qrsize=300`;
    const attach = new MessageAttachment(img, "qr.jpg");
    const embedSuccess = new MessageEmbed()
    .setImage('attachment://qr.jpg')
    .setColor("RANDOM")
    .setFooter("QR generado con exito!", message.author.displayAvatarURL({dynamic: true}))
    .setTimestamp();

    message.reply({embeds: [embedSuccess], files: [attach]});
    }
}

module.exports = command
