const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
require('moment').locale('es')

module.exports = {
	category: 'Diversión',
	data: new SlashCommandBuilder()
		.setName('quiz-zeew')
		.setDescription('Quiz del evento zeew'),

	async run(client, interaction) {
		const questions = [
			{
				question: 'Cuál es el animal más grande del planeta?',
				answer: 'ballena azul',
			},
			{
				question: 'cuantos minutos tiene un día?',
				answer: '1440',
			},
			{
				question: 'Quien es el dueño de amazon?',
				answer: 'jeff bezos',
			},
		]

		let actualQuestion = 0

		const embed = new MessageEmbed()
			.setTitle('quiz')
			.setDescription(`**pregunta:** ${questions[actualQuestion].question}`)
			.setColor('RANDOM')

		await interaction.reply({ embeds: [embed] })

		const collector = interaction.channel.createMessageCollector()

		collector.on('collect', async msg => {
			if (msg.author.id !== interaction.user.id) return

			console.log(actualQuestion)

			if (msg.content.toLowerCase().includes(questions[actualQuestion].answer)) {
				if (actualQuestion === questions.length - 1) {
					console.log('end')
					collector.stop('gameEnded')
					return interaction.editReply({
						embeds: [
							embed.setDescription('fin del juego.'),
						],
					})
				}
				actualQuestion++

				await interaction.editReply({
					embeds: [
						embed.setDescription('**pregunta:** ' + questions[actualQuestion].question),
					],
				})
			}
		})
	},
}
