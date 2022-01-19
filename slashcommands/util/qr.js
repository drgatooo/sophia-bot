const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    category: "Utilidad",
    data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("Crea un codigo QR de manera rapida!")
    .addStringOption(o => o.setName("link").setDescription("Ingresa lo que quieres transformar en un QR.").setRequired(true)),
    

    async run(client, interaction){

        const args = interaction.options;
        const text = args.getString("link");
        
        const img = `http://qr-code-generator.iwwwit.com/image.php?${text}&err=L&back=255-255-255&fore=0-0-0&qrsize=200`;
        const attach = new MessageAttachment(img, "qr.jpg");
        const embedSuccess = new MessageEmbed()
        .setImage('attachment://qr.jpg')
        .setColor("WHITE")
        .setFooter("QR generado con exito!", interaction.user.displayAvatarURL({dynamic: true}))
        .setTimestamp();

        interaction.reply({embeds: [embedSuccess], files: [attach]});
    }
}