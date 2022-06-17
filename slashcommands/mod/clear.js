const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
	userPerms: ['MANAGE_MESSAGES'],
	category: 'Moderación',
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('borra una cantidad de mensajes')
		.addIntegerOption((o) =>
			o
				.setName('cantidad')
				.setDescription('escribe un cantidad menor a 100.')
				.setRequired(true),
		),

	async run(client, interaction) {
		function error(msg) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(':x: Error')
						.setDescription(msg)
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}
		const args = interaction.options
		const cantidad = +args.getInteger('cantidad')
		if (!Number.isInteger(cantidad)) return error('Debes escribir un numero entero!')
		if (cantidad > 100 || cantidad < 1)
			return error('Escribe un numero valido! (menor a 100 y mayor a 1)')
		interaction.channel
			.bulkDelete(
				await interaction.channel.messages.fetch({ limit: cantidad }),
				true,
			)
			.then(async (c) => {
				if (c.size < 1) return error('No hay ningún mensaje para borrar.')
				interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle('<a:TPato_Check:911378912775397436> Exito!')
							.setDescription(
								'se han borrado `' +
									c.size +
									'/' +
									cantidad.toString() +
									'` mensajes.',
							)
							.setFooter({
								text: 'Los mensajes de 14 días de antigüedad, no podrán ser borrados.',
							})
							.setColor('GREEN'),
					],
				})
				setTimeout(async () => await interaction.deleteReply(), 5000)
			})
	},
}
