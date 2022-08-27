const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-light')
const getLanguage = require('../../functions/getLanguage')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['SEND_MESSAGES'],
	category: 'Diversión',

	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Mira tu avatar o el de un usuario.')
		// .setDescriptionLocalization('en-US', 'View your avatar or that of another user')
		.addUserOption((o) =>
			o
				.setName('usuario')
				.setDescription('Usuario a mirar')
				/* .setNameLocalization('en-US', 'user')
				.setDescriptionLocalization('en-US', 'User whose avatar you want to see')*/
				.setRequired(false),
		),

	async run(client, interaction) {
		const language = getLanguage(client, interaction, 'LITLE_QUESTION', 'AVATAR_IN_DM_OR_HERE', 'DM', 'HERE', 'AVATAR_OF', 'AVATAR_REQUESTED_BY', 'READY', 'SENDED', 'ERROR', 'OPEN_DM')
		const User = interaction.options.getUser('usuario') || interaction.user

		const pregunta = new MessageEmbed()
			.setTitle(`${language[0]}... <a:cora:925477856711180379>`)
			.setDescription(language[1])
			.setColor('#00FFFF')
		const row = new MessageActionRow().addComponents(
			new MessageButton().setLabel(language[2]).setStyle('SUCCESS').setCustomId('md'),

			new MessageButton().setLabel(language[3]).setStyle('SUCCESS').setCustomId('aqui'),
		)

		await interaction.reply({
			embeds: [pregunta],
			components: [row],
			ephemeral: true,
		})
		const filtro = (i) => i.user.id === interaction.user.id
		const collector = interaction.channel.createMessageComponentCollector({
			filter: filtro,
			time: 15000,
		})

		collector.on('collect', async (i) => {
			i.deferUpdate()

			if (i.customId === 'md') {
				interaction.user
					.send({
						embeds: [
							new MessageEmbed()
								.setTitle(language[4].replace('{user}', User.username))
								.setColor('#00FFFF')
								.setFooter({
									text: language[5].replace('{user}', interaction.user.username),
									iconURL: interaction.user.displayAvatarURL({
										dynamic: true,
									}),
								})
								.setImage(
									User.displayAvatarURL({
										size: 4096,
										dynamic: true,
										format: 'png',
									}),
								),
						],
					})
					.then(() => {
						interaction.followUp({
							embeds: [
								new MessageEmbed()
									.setTitle(`✅ ${language[6]}`)
									.setDescription(language[7])
									.setColor('GREEN'),
							],
							ephemeral: true,
						})
					})
					.catch(() => {
						interaction.followUp({
							embeds: [
								new MessageEmbed()
									.setTitle(`:x: ${language[8]}`)
									.setDescription(language[9])
									.setColor('RED'),
							],
							ephemeral: true,
						})
					})
			}
			if (i.customId === 'aqui') {
				interaction.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(language[4].replace('{user}', User.username))
							.setColor('#00FFFF')
							.setFooter({
								text: language[5].replace('{user}', interaction.user.username),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							})
							.setImage(
								User.displayAvatarURL({
									size: 4096,
									dynamic: true,
									format: 'png',
								}),
							),
					],
				})
				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setTitle(`${language[6]} ✅`)
							.setDescription(language[7])
							.setColor('GREEN'),
					],
					components: [],
				})
			}
		})
	},
}

module.exports = command
