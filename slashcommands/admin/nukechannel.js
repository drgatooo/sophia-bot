/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } = require('discord.js-light')
const { ChannelType } = require('discord-api-types/v10')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['ADMINISTRATOR'],
	botPerms: ['ADMINISTRATOR'],
	category: 'Administración',
	languageKeys: ['YES_IM_SURE', 'IVE_REGRETTED', 'ATENTION', 'NUKE_WARN', 'I_CANT_PERMS_TO_NUKE_CHANNEL', 'TEXT_CHANNEL_WAS_EXPECTED', 'CHANNEL_DELETED', 'THIS_MESSAGE_DELETED_10S', 'PERFECT', 'CHANNEL_NUKED', 'LEAVE', 'CHOOSING_TIME_OUT_RETRY_COMMAND'],

	data: new SlashCommandBuilder()
		.setName('nukechannel')
		.setDescription('Nukea un canal de tu servidor!')
		.setDescriptionLocalization('en-US', 'Nuke a channel of the server')
		.addChannelOption((o) =>
			o
				.setName('canal')
				.setNameLocalization('en-US', 'channel')
				.setDescription('Menciona el canal a nukear')
				.setDescriptionLocalization('en-US', 'Channel to nuke')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(false),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction, language) {
		const canal = interaction.options.getChannel('canal') || interaction.channel
		const posicion = canal.position

		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel(language[0])
				.setStyle('SECONDARY')
				.setCustomId('SI'),
			new MessageButton()
				.setLabel(language[1])
				.setStyle('DANGER')
				.setCustomId('NO'),
		)

		const confirmacion = new MessageEmbed()
			.setTitle(`⚠ ${language[2]}`)
			.setDescription(
				`➡ ${language[3].replace('{channel}', `<#${canal.id}>`)}`,
			)
			.setColor('ORANGE')

		await interaction.reply({ embeds: [confirmacion], components: [row] })
		const iFilter = (i) => i.user.id === interaction.user.id

		const collector = interaction.channel.createMessageComponentCollector({
			filter: iFilter,
			time: 30000,
		})
		collector.on('collect', async (i) => {
			if (i.customId == 'SI') {
				if (!canal.deletable) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle(':x: Error')
								.setDescription(language[4])
								.setColor('RED'),
						],
						components: [],
						ephemeral: true,
					})
				}

				if (!['GUILD_TEXT', 'GUILD_NEWS'].includes(canal.type)) {
					return interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle(':x: Error')
								.setDescription(language[5])
								.setColor('RED'),
						],
						components: [],
						ephemeral: true,
					})
				}

				const canalClonado = await canal.clone()
				canalClonado.setPosition(posicion)
				setTimeout(() => {
					canal.delete()
				}, 3000)

				const Embed = new MessageEmbed()
					.setTitle(`:recycle: ${language[6]}`)
					.setFooter({ text: language[7] })
					.setImage(
						'https://i.pinimg.com/originals/01/82/5e/01825e981b49caaa693395ca637376db.gif',
					)
					.setColor('#00FFFF')

				if (canalClonado.type == 'GUILD_TEXT') {
					await canalClonado.send({ embeds: [Embed] }).then((msg) => {
						setTimeout(() => {
							msg.delete()
						}, 10000)
					})
				}

				if (canalClonado.type == 'GUILD_VOICE') {
					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle(':x: Error')
								.setDescription(language[5])
								.setColor('RED'),
						],
						components: [],
					})
				}

				interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setTitle(`<a:Giveaways:878324188753068072> ${language[8]}`)
							.setDescription(language[9])
							.setColor('GREEN'),
					],
					components: [],
				})
			}

			if (i.customId == 'NO') {
				const exit = new MessageEmbed()
					.setTitle(`⬅ ${language[10]}`)
					.setColor('WHITE')
					.setDescription(language[7])
				interaction.editReply({ embeds: [exit], components: [] })
				setTimeout(() => interaction.deleteReply(), 10000)
			}
		})

		collector.on('end', (_collector, reason) => {
			if (reason === 'time') {
				const offTime = new MessageEmbed()
					.setColor('RED')
					.setDescription(language[11])
					.setTitle(':x: Error')
				interaction.editReply({ embeds: [offTime], components: [] })
				setTimeout(() => interaction.deleteReply(), 5000)
			}
		})
	},
}

module.exports = command
