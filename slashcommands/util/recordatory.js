const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const ms = require('ms')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['SEND_MESSAGES'],
	category: 'Utilidad',

	data: new SlashCommandBuilder()
		.setName('recordatory')
		.setDescription(
			'Establece un recordartorio para que el bot te hable o te mencione!',
		)
		.addStringOption((o) =>
			o
				.setName('recordatorio')
				.setDescription('¿Que quieres que te recuerde?')
				.setRequired(true),
		)
		.addStringOption((o) =>
			o
				.setName('tiempo')
				.setDescription('¿En cuanto tiempo te hablo?')
				.setRequired(true),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(__, interaction) {
		const recuerdame = interaction.options.getString('recordatorio')
		const tiempo = Math.floor(
			(ms(interaction.options.getString('tiempo')) + Date.now()) / 1000,
		)
		const mensaje = new MessageEmbed()
			.setTitle('Recordatorio!')
			.addField('He establecido tu recordatorio!', recuerdame, true)
			.addField('Te avisaré:', `<t:${tiempo}:R>`, true)
			.setColor('GREEN')
		const embed = new MessageEmbed()
			.setTitle('Toc Toc, ¿Estas ahí?')
			.addField('Hola, te traigo tu recordatorio!', recuerdame, true)
			.setColor('GOLD')

		if (!Number.isInteger(tiempo) || isNaN(tiempo)) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setDescription('No puedes poner números inválidos.')
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}

		try {
			const msg = await interaction.reply({ embeds: [mensaje] })
			setTimeout(() => {
				msg.delete()
				interaction.user.send({ embeds: [embed] }).catch(() => {
					interaction.channel.send({
						content: `<@${interaction.user.id}>`,
						embeds: [embed],
					})
				})
			}, ms(interaction.options.getString('tiempo')))
		} catch (err) {
			console.log(err)
		}
	},
}

module.exports = command
