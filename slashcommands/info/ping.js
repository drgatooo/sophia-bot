/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Client, CommandInteraction } = require('discord.js-light')
const getLanguage = require('../../functions/getLanguage')

module.exports = {
	category: 'Información',
	language: [
		'CALCULATED',
		'WAIT_MOMENT',
		'STATISTICS',
		'CURRENT_PING',
		'CURRENT_RAM',
		'CURRENT_LANGUAGE'],
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Comando ping'),
	// .setDescriptionLocalization('en-US', 'Ping command'),

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {string[]} language
	 */

	async run(client, interaction, language) {
		await interaction.deferReply()
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
