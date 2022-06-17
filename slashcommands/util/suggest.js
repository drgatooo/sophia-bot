const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const schema = require('../../models/suggestions-model.js')
const moment = require('moment')

module.exports = {
	category: 'Utilidad',
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Envía una sugerencia.')
		.addStringOption((o) =>
			o
				.setName('sugerencia')
				.setDescription('sugerencia a envíar')
				.setRequired(true),
		),

	async run(client, interaction) {
		const args = interaction.options
		const suggest = args.getString('sugerencia')
		const err = new MessageEmbed().setTitle(':x: Error').setColor('RED')
		const enviada = new MessageEmbed()
			.setTitle('✔ Todo ha salido bien :)')
			.setDescription('Tu sugerencia ha sido enviada con exito.')
			.setColor('GREEN')

		const channel = await schema.findOne({ guildid: interaction.guild.id })
		if (!channel || !interaction.guild.channels.cache.get(channel.channelid)) {
			err.setDescription(
				'No hay ningun de sugerencias para este servidor, o ha sido eliminado. (para solucionarlo escribe: `/setsuggest`)',
			)
			return interaction.reply({ embeds: [err], ephemeral: true })
		}
		const embedSuggest = new MessageEmbed()
			.setColor('#00FFFF')
			.setTitle('Nueva sugerencia')
			.addField('Autor', `\`${interaction.user.tag}\``, true)
			.addField(
				'Fecha',
				`\`${moment(Date.now()).format('DD/MM/YYYY HH:mm A')}\``,
				true,
			)
			.addField('Sugerencia', `\`${suggest}\``)
		interaction.guild.channels.cache
			.get(channel.channelid)
			.send({ embeds: [embedSuggest] })
			.then((msg) => {
				msg.react('✅')
				msg.react('❌')
			})
		interaction.reply({ embeds: [enviada], ephemeral: true })
	},
}
