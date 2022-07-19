const { SlashCommandSubcommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-light')
const economyModel = require('../../../models/economy-model')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	category: 'Economía',

	data: new SlashCommandSubcommandBuilder()
		.setName('blackjack')
		.setDescription('Juega al blackjack.')
		.addIntegerOption(o =>
			o
				.setName('cantidad')
				.setDescription('La cantidad de dinero que quieres apostar.')
				.setRequired(true),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(_, interaction) {
		const amount = interaction.options.getInteger('cantidad')

		if (amount < 50) return await interaction.reply('Debes apostar más de 50$!')

		const balance = await economyModel.findOne({
			guildid: interaction.guild.id,
			userid: interaction.user.id,
		})

		if (!balance || balance.money < amount) return await interaction.reply('No tienes suficiente dinero para apostar!')

		const deck = [
			'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
		]

		const player = []
		const dealer = []

		const scores = {
			playerScore() {
				let score = 0
				player.forEach(card => {
					if (card === 'A') score += 1
					else if (card === 'J' || card === 'Q' || card === 'K') score += 10
					else score += parseInt(card)
				})
				return score
			},

			dealerScore() {
				let score = 0
				dealer.forEach(card => {
					if (card === 'A') score += 1
					else if (card === 'J' || card === 'Q' || card === 'K') score += 10
					else score += parseInt(card)
				})
				return score
			},
		}

		const getWinner = () => {
			if ((scores.playerScore() > scores.dealerScore()) && scores.playerScore() <= 21) return 'player'
			if ((scores.dealerScore() > scores.playerScore()) && scores.dealerScore() <= 21) return 'dealer'
			if (scores.playerScore() > 21) return 'dealer'
			if (scores.dealerScore() > 21) return 'player'
			return null
		}

		const hit = (user) => {
			const card = deck[Math.floor(Math.random() * deck.length)]
			user.push(card)
			return card
		}

		const embed = new MessageEmbed()
			.setTitle('Blackjack')
			.addField('Jugador', `"${hit(player)}" "${hit(player)}"\n\nPuntos: ${scores.playerScore()}`)
			.addField('Dealer', `"${hit(dealer)}" "${hit(dealer)}"\n\nPuntos: ${scores.dealerScore()}`)
			.setColor('#0099ff')
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp()

		const hitButton = new MessageButton()
			.setLabel('nueva carta')
			.setStyle('PRIMARY')
			.setCustomId('hit')

		const standButton = new MessageButton()
			.setLabel('terminar')
			.setStyle('PRIMARY')
			.setCustomId('stand')

		const doubleDownButton = new MessageButton()
			.setLabel('doblar')
			.setStyle('SECONDARY')
			.setCustomId('doubleDown')

		const splitButton = new MessageButton()
			.setLabel('dividir')
			.setStyle('SECONDARY')
			.setCustomId('split')
			.setDisabled(true)

		const row = new MessageActionRow()
			.addComponents(hitButton, standButton, doubleDownButton, splitButton)

		await interaction.reply({
			embeds: [embed],
			components: [row],
		})

		const collector = interaction.channel.createMessageComponentCollector({ filter: m => m.user.id === interaction.user.id, time: 300000 })

		collector.on('collect', async m => {
			if (m.customId === 'hit') {
				hit(player)
				await interaction.editReply({ embeds: [
					new MessageEmbed()
						.setTitle('Blackjack')
						.addField('Jugador', player.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.playerScore()}`)
						.addField('Dealer', dealer.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.dealerScore()}`)
						.setColor('#0099ff')
						.setThumbnail(interaction.user.avatarURL())
						.setTimestamp(),
				] })

				if (scores.playerScore() > 21) {
					await economyModel.updateOne({
						guildid: interaction.guild.id,
						userid: interaction.user.id,
					}, {
						$inc: {
							money: -amount,
						},
					})

					await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle('Blackjack')
								.addField('Jugador', player.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.playerScore()}`)
								.addField('Dealer', dealer.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.dealerScore()}`)
								.setColor('#0099ff')
								.setThumbnail(interaction.user.avatarURL())
								.setTimestamp()
								.addField('Jugador', 'Ha perdido!')
								.setColor('#ff0000'),
						], components: [],
					})
					return collector.stop()
				}
			}

			if (m.customId === 'stand') {
				hit(dealer)
				while (scores.dealerScore() < 17) hit(dealer)

				const winner = getWinner()
				if (winner === 'player') {
					await economyModel.updateOne(
						{
							guildid: interaction.guild.id,
							userid: interaction.user.id,
						},
						{
							$inc: {
								money: amount,
							},
						},
					)

					await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle('Blackjack')
								.addField('Jugador', player.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.playerScore()}`)
								.addField('Dealer', dealer.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.dealerScore()}`)
								.setColor('#0099ff')
								.setThumbnail(interaction.user.avatarURL())
								.setTimestamp()
								.addField('Jugador', 'Ha ganado!'),
						], components: [],
					})

					return collector.stop()
				}

				if (winner === 'dealer') {
					await economyModel.updateOne(
						{
							guildid: interaction.guild.id,
							userid: interaction.user.id,
						},
						{
							$inc: {
								money: -amount,
							},
						},
					)

					await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle('Blackjack')
								.addField('Jugador', player.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.playerScore()}`)
								.addField('Dealer', dealer.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.dealerScore()}`)
								.setColor('#0099ff')
								.setThumbnail(interaction.user.avatarURL())
								.setTimestamp()
								.addField('Jugador', 'Ha perdido!'),
						], components: [],
					})

					return collector.stop()
				}
			}

			if (m.customId === 'doubleDown') {
				hit(player)
				hit(dealer)

				const winner = getWinner()
				if (winner === 'player') {
					await economyModel.updateOne(
						{
							guildid: interaction.guild.id,
							userid: interaction.user.id,
						},
						{
							$inc: {
								money: amount * 2,
							},
						},
					)

					await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle('Blackjack')
								.addField('Jugador', player.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.playerScore()}`)
								.addField('Dealer', dealer.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.dealerScore()}`)
								.setColor('#0099ff')
								.setThumbnail(interaction.user.avatarURL())
								.setTimestamp()
								.addField('Jugador', 'Ha ganado!'),
						], components: [],
					})

					return collector.stop()
				}

				if (winner === 'dealer') {
					await economyModel.updateOne(
						{
							guildid: interaction.guild.id,
							userid: interaction.user.id,
						},
						{
							$inc: {
								money: -amount * 2,
							},
						},
					)

					await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle('Blackjack')
								.addField('Jugador', player.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.playerScore()}`)
								.addField('Dealer', dealer.map(card => `"${card}"`).join(' ') + `\n\nPuntos: ${scores.dealerScore()}`)
								.setColor('#0099ff')
								.setThumbnail(interaction.user.avatarURL())
								.setTimestamp()
								.addField('Jugador', 'Ha perdido!'),
						], components: [],
					})

					return collector.stop()
				}
			}

			// if (m.customId === 'split') {

			// }
		})

	},
}

module.exports = command