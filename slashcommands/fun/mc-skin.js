const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {
    category: "Diversión",


    data: new SlashCommandBuilder()
    .setName("mc-skin")
    .setDescription("Ve una skin de minecraft")
    .addStringOption(o =>
        o.setName("skin")
        .setDescription("La skin que quieres ver")
        .setRequired(true)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(_, interaction){
        const args = interaction.options.getString("skin");
        if(args.match(/ /g)) return await interaction.reply({ embeds: [
            new MessageEmbed()
            .setTitle(":x: Error")
            .setDescription('No puedes poner espacios en un nombre de minecraft!')
            .setColor('RED')
        ], ephemeral: true });
        if(args.length > 16) return await interaction.reply({ embeds: [
            new MessageEmbed()
            .setTitle(":x: Error")
            .setDescription('El maximo son 16 caracteres!')
            .setColor('RED')
        ], ephemeral: true });
        if(require('../../helpers/hasEmoji.js')(args)) return await interaction.reply({ embeds: [
            new MessageEmbed()
            .setTitle(":x: Error")
            .setDescription('No puedes poner emoji en un nombre de minecraft!')
            .setColor('RED')
        ], ephemeral: true });

    const skin = `https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${args}/700`;

    const attachSkin = new MessageAttachment(skin, 'skin.png');

    const embedSuccess = new MessageEmbed()
        .setDescription("Skin de: `"+args+"` **(si es una skin innexistente saldra una por defecto)**")
        .setImage("attachment://skin.png")
        .setColor("#00ff00")
        .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    await interaction.reply({ embeds: [embedSuccess], files: [attachSkin] });
    }
}

module.exports = command;