const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageAttachment } = require('discord.js')

module.exports = {
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("mcstatus")
    .setDescription("Revisa el estado de un servidor de minecraft.")
	.addStringOption(o => o.setName('ip-del-servidor').setDescription('escribe la ip del servidor').setRequired(true)),

    async run(client, interaction){
 			const img = `http://status.mclive.eu/${interaction.options.getString('ip-del-servidor')}/${interaction.options.getString('ip-del-servidor')}/25565/banner.png`;
    		const attach = new MessageAttachment(img, 'info.png');
        setTimeout(() =>
        	interaction.reply({files: [attach]})
                   , 500);
    }
}