const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const emojisi = '<a:Stable:910938393968517180>'
const emojino = '<a:Down:910938393993699350>'

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['MANAGE_GUILD'],
	botPerms: ['MANAGE_GUILD'],
	category: 'Moderación',

	data: new SlashCommandBuilder()
		.setName('encuesta')
		.setDescription('Crea una encuesta con 2 opciones!')
		.addStringOption((o) =>
			o
				.setName('pregunta')
				.setDescription('La opcion a votar a favor')
				.setRequired(true),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {Commandteraction} interaction
	 */

	async run(client, interaction) {
		const args = interaction.options
		const si = args.getString('pregunta')

		const embed = new MessageEmbed()
			.setTitle('Nueva encuesta!')
			.setDescription(
				'Se ha generado una nueva encuesta en la que tú puedes participar, a continuación, elige tu opción haciendo click sobre esa reacción.',
			)
			.addField('LA PREGUNTA ES:', si, true)
			.setColor('#00FFFF')

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(`${emojisi} Encuesta enviada`)
					.setColor('GREEN'),
			],
			ephemeral: true,
		})
		await interaction.channel.send({ embeds: [embed] }).then(async (msg) => {
			await msg.react(emojisi)
			await msg.react(emojino)
		})
	},
}

module.exports = command
