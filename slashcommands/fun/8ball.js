const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton, version } = require('discord.js')
const info = require("../../package.json")
require('moment').locale('es');

module.exports = {
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("preguntale algo de si o no al bot.")
    .addStringOption(o => o.setName('pregunta').setDescription('dime tu pregunta.').setRequired(true)),

    async run(client, interaction){
		const respuesta = ["Si.", "No.", "Tal vez.", "Puede ser.", "No en absoluto.", "Mejor pregunta otra cosa.", "Mmmmm... no se.", "Eso no se pregunta...", "No lo se, dimelo tu."];
        const pregunta = interaction.options.getString('pregunta');
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