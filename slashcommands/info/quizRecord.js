/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-light')
const { SlashCommandBuilder } = require('@discordjs/builders')
const timeModel = require('../../models/quizTime')

module.exports = {
	botPerms: ['ADMINISTRATOR'],
	category: 'Información',
	languageKeys: [
		'RESET_RECORD',
		'EXIT',
		'STATISTICS_GAME',
		'RECORD_TIME',
		'NEVER_PLAYED',
		'STREAK',
		'WORD_LONGEST',
		'ACCERTS_LONGTH',
		'NONE',
		'MISSED_WORDS_LONGTH',
		'STATISCTICS_OF',
		'RESETED_RECORD',
		'NO_RESETED',
		'SECOND',
		'NO_RECORD',
		'YOUR_STREAK',
		'OKAY',
	],
	data: new SlashCommandBuilder()
		.setName('quizrecords')
		.setDescription('Revisa tus estadisticas del juego quiz.')
		.setDescriptionLocalization('en-US', 'Check your game statistics quiz.')
		.addUserOption((o) =>
			o
				.setName('usuario')
				.setNameLocalization('en-US', 'user')
				.setDescription('Revisa las estadisticas de algún usuario en particular.')
				.setDescriptionLocalization('en-US', 'Check the statistics of a particular user')
				.setRequired(false),
		),

	async run(client, interaction, language) {
		const usuario = interaction.options.getMember('usuario') || interaction.member
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle('PRIMARY')
				.setLabel(`${language[0]}`)
				.setDisabled(usuario.id !== interaction.user.id ? true : false)
				.setCustomId('Si'),
			new MessageButton()
				.setStyle('SECONDARY')
				.setLabel(`${language[1]}`)
				.setCustomId('No'),
		)

		if (usuario) quizTimer = await timeModel.findOne({ UserID: usuario.id })
		else quizTimer = await timeModel.findOne({ UserID: interaction.user.id })

		if (!quizTimer) {
			const embedTiempo2 = new MessageEmbed()
				.setTitle(`🎲 ${language[2]}`)
				.setColor('ORANGE')

			embedTiempo2.addFields([
				{
					name: `⌛ ${language[3]}`, value: `\`${language[4]}!\``,
				},
				{
					name: `🔥 ${language[5]}`, value: `${language[6]}`,
				},
				{
					name: `🔠 ${language[7]}`, value: `${language[6]}`,
				},
				{
					name: `✅ ${language[8]}`, value: '`0`',
				},
				{
					name: `❎ ${language[9]}`, value: '`0`',
				},
				{
					name: `🌐 ${language[10]}`, value: '`0`',
				},
			])

			return interaction.reply({ embeds: [embedTiempo2] })
		}

		const embedTiempo = new MessageEmbed().setColor('ORANGE').setTitle('🎲 Estadisticas de QuizWords')

		embedTiempo.addField(
			`⌛ ${language[3]}`,
			`${
				quizTimer.TimeMax
					? `\`${quizTimer.TimeMax}\` ${language[13]}!`
					: `\`${language[14]}\``
			}`,
		)
		embedTiempo.addField(
			`🔥 ${language[5]}`,
			`${
				quizTimer.Racha
					? `${language[15].replace('{data}', `\`${quizTimer.Racha}\``)}`
					: '`0`'
			}`,
		)
		embedTiempo.addField(
			`🔠 ${language[7]}`,
			`${quizTimer.LongWord ? `\`${quizTimer.LongWord}\`` : `\`${language[6]}\``}`,
		)
		embedTiempo.addField(
			`✅ ${language[8]}`,
			`${quizTimer.Assertions ? `\`${quizTimer.Assertions}\`` : '`0`'}`,
		)
		embedTiempo.addField(
			`❎ ${language[9]}`,
			`${quizTimer.NoAssertions ? `\`${quizTimer.NoAssertions}\`` : '`0`'}`,
		)
		embedTiempo.addField(
			`🌐 ${language[10].replaceAll('{user}', usuario.user.tag)}`,
			`\`${quizTimer.Assertions + quizTimer.NoAssertions}\``,
		)
		embedTiempo.setFooter({
			text: `${language[11]}`,
		})

		if (quizTimer && quizTimer.TimeMax > 0) {
			await interaction.reply({ embeds: [embedTiempo], components: [row] })
			const iFilter = (i) => i.user.id === interaction.user.id

			const collector = interaction.channel.createMessageComponentCollector({
				filter: iFilter,
				time: 60000,
				errors: ['time'],
			})

			collector.on('collect', async (i) => {
				if (i.customId === 'Si') {
					await timeModel.updateOne(
						{ UserID: interaction.user.id },
						{ TimeMax: null },
					)
					const Si = new MessageEmbed()
						.setTitle(`✅ ${language[16]}`)
						.setColor('GREEN')
						.setDescription(`${language[12]}`)
					await i.deferUpdate()
					i.editReply({ embeds: [Si], components: [] })
				}
				if (i.customId === 'No') {
					const No = new MessageEmbed()
						.setTitle(`✅ ${language[16]}`)
						.setColor('GREEN')
						.setDescription(`✅ ${language[13]} ;)`)
					await i.deferUpdate()
					i.editReply({ embeds: [No], components: [] })
				}
			})
		} else {
			return interaction.reply({ embeds: [embedTiempo] })
		}
	},
}
