const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const getLanguage = require('../../functions/getLanguage')
require('moment').locale('es')

module.exports = {
	category: 'Diversión',
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Pregúntale algo de si o no al bot.')
		.setDescriptionLocalization('en-US', 'Ask the bot a yes or no question.')
		.addStringOption((o) =>
			o.setName('pregunta').setDescription('dime tu pregunta.').setRequired(true).setNameLocalization('en-US', 'question').setDescriptionLocalization('en-US', 'Tell me your question'),
		),

	async run(client, interaction) {
		const linkRegex = new RegExp(
			/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g,
		)
		const discordInvite = new RegExp(/discord\.gg\/.[a-zA-Z0-9()]{1,256}/g)
		const language = getLanguage(client, interaction, 'RESPONSES_EIGHT_BALL', 'YOU_CANT_PUT_TEXT_MORE', 'YOU_CANT_PUT_LINKS_IN_QUESTION', 'YOUR_QUESTION', 'MY_ANSWER_TO_QUESTION', 'EIGHT_BALL')

		const pregunta = interaction.options.getString('pregunta')
		if (pregunta.length > 40) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(':x: Error')
						.setDescription(language[1].replace('{max}', '40'))
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}
		if (linkRegex.test(pregunta) || discordInvite.test(pregunta)) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(':x: Error')
						.setDescription(language[2])
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}

		const embed = new MessageEmbed()
			.setTitle(`${language[5]} :8ball:`)
			.setDescription(
				`➡ ***${language[3]}:***` +
					'\n' +
					`${pregunta}` +
					'\n' +
					`👀 *${language[4]}:* \n` +
					'||' +
					language[0] +
					'||',
			)
			.setColor('#00FFFF')
		interaction.reply({ embeds: [embed] })
	},
}
