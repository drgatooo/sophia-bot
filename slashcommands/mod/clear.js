const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')

module.exports = {
	userPerms: ['MANAGE_MESSAGES'],
	category: 'Moderación',
	languageKeys: ['MUST_WRITE_INTEGER', 'THERE_NOT_MESSAGE_DELETE', 'SUCCESSFUL', 'HAVE_BEEN_DELETED', 'MESSAGES', 'MESSAGES_OLDER_CANT_DELETED'],
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Borra una cantidad de mensajes')
		.setDescriptionLocalization('en-US', 'Delete a number of messages')
		.addIntegerOption((o) =>
			o
				.setName('cantidad')
				.setDescription('escribe un cantidad menor a 100.')
				.setNameLocalization('en-US', 'amount')
				.setDescriptionLocalization('en-US', 'Write an amount')
				.setMaxValue(100)
				.setMinValue(1)
				.setRequired(true),
		),

	async run(client, interaction, language) {
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
		if (!Number.isInteger(cantidad)) return error(language[0])
		interaction.channel
			.bulkDelete(
				await interaction.channel.messages.fetch({ limit: cantidad }),
				true,
			)
			.then(async (c) => {
				if (c.size < 1) return error(language[1])
				interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle('<a:TPato_Check:911378912775397436> ' + language[2])
							.setDescription(
								language[3] + ' `' +
									c.size +
									'/' +
									cantidad.toString() +
									'` ' + language[4].toLowerCase(),
							)
							.setFooter({
								text: language[5],
							})
							.setColor('GREEN'),
					],
				})
				setTimeout(async () => await interaction.deleteReply(), 5000)
			})
	},
}
