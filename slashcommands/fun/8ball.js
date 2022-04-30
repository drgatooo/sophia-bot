const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton, version } = require('discord.js')
const info = require("../../package.json")
require('moment').locale('es');

module.exports = {
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Pregúntale algo de si o no al bot.")
    .addStringOption(o => o.setName('pregunta').setDescription('dime tu pregunta.').setRequired(true)),

    async run(client, interaction){
        const linkRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g);
        const discordInvite = new RegExp(/discord\.gg\/.[a-zA-Z0-9()]{1,256}/g)

		const respuesta = ["Si.", "No.", "Tal vez.", "Puede ser.", "No en absoluto.", "Mejor pregunta otra cosa.", "Mmmmm... no sé.", "Eso no se pregunta...", "No lo sé, dímelo tú."];
        const pregunta = interaction.options.getString('pregunta');
        if (linkRegex.test(pregunta) || discordInvite.test(pregunta)) return await interaction.reply({ embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription("No puedes poner links en la pregunta!")
                .setColor("RED")
            ], ephemeral: true});

        const embed = new MessageEmbed()
        .setTitle("8Ball :8ball:")
        .setDescription
        (
            "➡ ***Tu pregunta es:***" + "\n" +
            `${pregunta}` + "\n" +
            "👀 *Mi respuesta a la pregunta es:* \n" + 
            `||`+respuesta[Math.floor(Math.random() * respuesta.length)]+`||`,
        )
        .setColor("#00FFFF");
        interaction.reply({embeds: [embed]});
    }
}