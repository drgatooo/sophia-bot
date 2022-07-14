/* eslint-disable no-shadow */
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const randomWords = require('random-spanish-words')

const timeModel = require('../../models/quizTime')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	category: 'Diversión',

	data: new SlashCommandBuilder()
		.setName('quiz')
		.setDescription('Juega un divertido juego de adivinar palabras ordenando letras'),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(_, interaction) {
		const Aciertos = 1

		const quizTimer = await timeModel.findOne({ UserID: interaction.user.id })

		if (!quizTimer) {
			const data = new timeModel({
				UserID: interaction.user.id,
				Assertions: 0,
				Racha: 0,
				LongWord: null,
				TimeMax: null,
				NoAssertions: 0,
			})
			await data.save()
		}

		let intentos = 3

		const palabra = randomWords()

		const array = palabra.split('')

		function random(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const a = Math.floor(Math.random() * (i + 1))
				const b = array[i]
				array[i] = array[a]
				array[a] = b
			}
			return array
		}

		const final = random(array).join('')

		// Embed

		const embedQuiz = new MessageEmbed()
			.setTitle('🎲 Adivina la palabra!')
			.setDescription(
				`😮 Te ha tocado \`${final}\` intenta adivinarlo!\n**⚠ Intentos restantes**\n${intentos}/3`,
			)
			.setFooter({ text: 'Recuerda escribir la palabra en minúsculas...' })
			.setColor('WHITE')

		await interaction.reply({ embeds: [embedQuiz] })
		const mfilter = (m) => m.author.id === interaction.user.id
		const mcollector = interaction.channel.createMessageCollector({
			filter: mfilter,
			max: 3,
			time: 30000,
			errors: ['time'],
		})

		mcollector.on('collect', async (m) => {
			const segundosInicio = interaction.createdTimestamp / 1000
			if (m.content !== palabra) {
				intentos = intentos - 1
				embedQuiz.setDescription(
					`😮 Te ha tocado \`${final}\` intenta adivinarlo!\n**⚠ Intentos restantes**\n${intentos}/3`,
				)
				await interaction.editReply({ embeds: [embedQuiz] })
			} else {
				const segundosFinal = Date.now() / 1000

				const segundosTardados = segundosFinal - segundosInicio

				const segundosCalculados = Math.floor(segundosTardados)

				embedQuiz.setTitle('🍀 Y tenemos un ganador!')
				embedQuiz.setDescription(
					`🎉  Ganaste, la palabra era **${palabra}**!\nTardaste \`${segundosCalculados}\` segundo/s en responder!`,
				)

				if (
					(quizTimer && !quizTimer.Assertions) ||
					(quizTimer && quizTimer.Assertions == 0)
				) {
					await timeModel.updateOne(
						{ UserID: interaction.user.id },
						{ Assertions: Aciertos },
					)
					embedQuiz.addField('🔠 Tus aciertos: ', `${quizTimer.Assertions + 1}`)
				} else if (quizTimer && quizTimer.Assertions !== 0) {
					await timeModel.updateOne(
						{ UserID: interaction.user.id },
						{ Assertions: quizTimer.Assertions + 1 },
					)
					embedQuiz.addField('🔠 Tus aciertos: ', `${quizTimer.Assertions + 1}`)
				}

				if (
					(quizTimer && !quizTimer.TimeMax) ||
					(quizTimer && quizTimer.TimeMax == null)
				) {
					embedQuiz.addField(
						'⌛ Has logrado tu primer record!:',
						`\`${segundosCalculados}\` segundos!`,
					)
					await timeModel.updateOne(
						{ UserID: interaction.user.id },
						{ TimeMax: segundosCalculados },
					)
				} else {
					if (quizTimer && quizTimer.TimeMax > segundosCalculados) {
						try {
							await timeModel.updateOne(
								{ UserID: interaction.user.id },
								{ TimeMax: segundosCalculados },
							)
						} catch (err) {
							console.log(err)
						}

						embedQuiz.addField(
							'⌛ Nuevo record!:',
							`\`${segundosCalculados}\` segundos!`,
						)
					}

					if (quizTimer && quizTimer.TimeMax < segundosCalculados) {
						embedQuiz.addField(
							'⌛Record:',
							`Estabas a \`${
								segundosCalculados - quizTimer.TimeMax
							}\` segundos de batir tu record!`,
						)
					}

					if (
						(quizTimer && !quizTimer.LongWord) ||
						(quizTimer && quizTimer.LongWord == 'null') ||
						(quizTimer && quizTimer.Assertions == 1)
					) {
						await timeModel.updateOne(
							{ UserID: interaction.user.id },
							{ LongWord: palabra },
						)
					} else if (quizTimer && quizTimer.LongWord.length < palabra.length) {
						await timeModel.updateOne(
							{ UserID: interaction.user.id },
							{ LongWord: palabra },
						)
					}

					if (
						(quizTimer && !quizTimer.Racha) ||
						(quizTimer && quizTimer.Racha == 0) ||
						(quizTimer && quizTimer.Assertions == 1)
					) {
						await timeModel.updateOne(
							{ UserID: interaction.user.id },
							{ Racha: 1 },
						)
					} else if (quizTimer && quizTimer.Racha) {
						await timeModel.updateOne(
							{ UserID: interaction.user.id },
							{ Racha: quizTimer.Racha + 1 },
						)
					}
				}

				await interaction.editReply({ embeds: [embedQuiz] })
				mcollector.stop('adivino')
			}

			if (intentos == 0) {
				if (quizTimer && quizTimer.Racha) {
					await timeModel.updateOne(
						{ UserID: interaction.user.id },
						{ Racha: 0 },
					)
				}

				if (quizTimer && quizTimer.NoAssertions == 0) {
					await timeModel.updateOne(
						{ UserID: interaction.user.id },
						{ NoAssertions: Aciertos },
					)
				} else if (quizTimer && quizTimer.NoAssertions > 0) {
					await timeModel.updateOne(
						{ UserID: interaction.user.id },
						{ NoAssertions: quizTimer.NoAssertions + 1 },
					)
				}

				const perder = new MessageEmbed()
					.setTitle('😔 Oh no... has perdido!')
					.setColor('RED')
					.setDescription(
						`✏ La palabra era: **${palabra}**\n❤ Ojala tengas mas suerte para la proxima!`,
					)

				await interaction.editReply({ embeds: [perder] })
			}
		})

		mcollector.on('end', async (_, razon) => {
			if (razon === 'time') {
				const perder = new MessageEmbed()
					.setTitle('⌛ Se acabo el tiempo!')
					.setColor('RED')
					.setDescription(
						`✏ La palabra era: **${palabra}**\n❤ Ojala tengas mas suerte para la proxima!`,
					)

				await interaction.editReply({ embeds: [perder] })
			}
		})
	},
}

module.exports = command
