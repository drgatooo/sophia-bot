const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js-light')
const marketGame = require('../../helpers/marketGame.js')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['SEND_MESSAGES'],
	category: 'Diversión',

	data: new SlashCommandBuilder()
		.setName('marketgame')
		.setDescription('Intenta agarrar todas las frutas que puedas!'),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('Left').setStyle('PRIMARY').setEmoji('⬅'),
			new MessageButton().setCustomId('Right').setStyle('PRIMARY').setEmoji('➡'),
		)

		const iFilter = (i) => i.user.id == interaction.user.id

		let points = 0
		const game = new marketGame({ columns: 7 })
		game.generateArray()

		const ingame = new MessageEmbed()
			.setTitle('🛒 SuperMarket')
			.setDescription(
				`\`\`\`${game.ascii()}\`\`\` \n📈 Tu puntaje actual:\n${points}\nTe quedan : ${'❤'.repeat(
					game.lives,
				)} vidas`,
			)
			.setColor('WHITE')
			.setFooter({
				text: 'Trata de sobrevivir 30 segundos!',
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})

		await interaction.reply({ embeds: [ingame], components: [row] })

		const collector = interaction.channel.createMessageComponentCollector({
			filter: iFilter,
			time: 30000,
			componentType: 'BUTTON',
		})

		collector.on('collect', async (i) => {
			if (i.customId === 'Left') {
				try {
					game.moveLeft()
					await interaction.editReply({
						embeds: [
							ingame.setDescription(
								`\`\`\`${game.ascii()}\`\`\` \n📈 Tu puntaje actual:\n${points}\nTe quedan : ${'❤'.repeat(
									game.lives,
								)} vidas`,
							),
						],
					})
				} catch (err) {
					console.log(err)
				}
			}
			if (i.customId === 'Right') {
				try {
					game.moveRight()
					await interaction.editReply({
						embeds: [
							ingame.setDescription(
								`\`\`\`${game.ascii()}\`\`\` \n📈 Tu puntaje actual:\n${points}\nTe quedan : ${'❤'.repeat(
									game.lives,
								)} vidas`,
							),
						],
					})
				} catch (err) {
					console.log(err)
				}
			}
		})

		const Inter = await setInterval(() => {
			const isInPosX = game.checkCollectorPosition()
			game.updateFrame()
			interaction.editReply({
				embeds: [
					ingame.setDescription(
						`\`\`\`${game.ascii()}\`\`\` \n📈 Tu puntaje actual:\n${points}\nTe quedan : ${'❤'.repeat(
							game.lives,
						)} vidas`,
					),
				],
				components: [row],
			})
			if (!isInPosX) {
				if (game.lives < 1) {
					collector.stop('live')
					const noLives = new MessageEmbed()
						.setTitle('💔 Has perdido!')
						.setDescription('Suerte la proxima!')
						.setColor('RED')
					interaction.editReply({ embeds: [noLives], components: [] })
					clearInterval(Inter)
				}
			} else if (game.nextEmojiInfo().food) {
				points++
			}
		}, 1500)

		collector.on('end', () => {
			const timeOff = new MessageEmbed()
				.setTitle('🛒 SuperMarket')
				.addField('📊 Puntaje final:', `${[points]}`)
				.setColor('GREEN')
			clearInterval(Inter)

			interaction.editReply({ embeds: [timeOff], components: [] })
		})
	},
}

module.exports = command
