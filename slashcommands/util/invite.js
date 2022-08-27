const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-light')
const getLanguage = require('../../functions/getLanguage')

module.exports = {
	category: 'Utilidad',
	botPerms: 'ADMINISTRATOR',
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Invita el bot a tu servidor'),
	// .setDescriptionLocalization('en-US', 'Invite the bot to your server'),

	run(client, interaction) {
		const language = getLanguage(client, interaction, 'THANKS_FOR_INVITING_ME', 'THANKS_FOR_THE_OPPORTUNITY', 'INVITATION')
		const gracias = new MessageEmbed()
			.setTitle(language[0])
			.setDescription(language[1].replace('{user}', interaction.user.tag))
			.setTimestamp(new Date())
			.setImage(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
			.setColor('#00FFFF')

		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel(language[2])
				.setStyle('LINK')
				.setURL(
					`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`,
				),
		)

		interaction.reply({ embeds: [gracias], components: [row] })
	},
}
