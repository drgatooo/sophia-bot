/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Client, CommandInteraction } = require('discord.js')
const getLanguage = require('../../functions/getLanguage')

module.exports = {
	category: 'Información',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Comando ping')
		.setDescriptionLocalization('en-US', 'Ping command'),

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		await interaction.deferReply()

		const language = getLanguage(
			client,
			interaction,
			'calculated',
			'waitMoment',
			'statistics',
			'currentPing',
			'currentRam',
			'currentLanguage',
		)
		const ping = Math.round(interaction.client.ws.ping)
		const embed = new MessageEmbed()
			.setTitle(':ping_pong: ' + language[0] + '...')
			.setDescription('⏳ ' + language[1] + '...')
			.setColor('RED')
		interaction.editReply({ embeds: [embed] }).then(async () => {
			embed.setTitle(language[2] + ' ' + client.user.tag)
			embed.setDescription(
				`> :ping_pong: **${language[3]}:**\n` +
					'`' +
					ping +
					' ms' +
					'`' +
					`\n\n > ⏳ **${language[4]}:**\n` +
					'`' +
					`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}` +
					' MB' +
					'`',
			)
			embed.setColor('#00FFFF')
			embed.setFooter({ text: language[5] })
			interaction.editReply({ embeds: [embed] })
		})
	},
}
