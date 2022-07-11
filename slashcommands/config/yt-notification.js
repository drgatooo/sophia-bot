const { SlashCommandBuilder } = require('@discordjs/builders')
const db = require('../../models/yt-system')

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {
	userPerms: ['MANAGE_GUILD'],
	botPerms: ['MANAGE_GUILD'],
	category: 'Configuración',


	data: new SlashCommandBuilder()
		.setName('yt-notification')
		.setDescription('Establece notificaciones de videos de YouTube!')
		.addStringOption(o =>
			o.setName('ytchannelid')
				.setDescription('Define la ID de tu canal de YT'),
		)
		.addChannelOption(p =>
			p.setName('notificationchannel')
				.setDescription('Canal donde se enviará las notificaciones.'),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const channelYTID = interaction.options.getString('ytchannelid')
		const channel = interaction.options.getChannel('notificationchannel')
		const { id: channelID } = channel
		const { MessageEmbed } = require('discord.js-light')
		const error = new MessageEmbed().setColor('RED').setTitle(':x: Error')

		if (!channel.isText()) return interaction.reply({ embeds: [error.setDescription('El canal especificado no es de texto o es una categoría, ingresa uno nuevo.')], ephemeral: true })

		db.findOne({ serverID: interaction.guildId }, (err, result) => {
			if (err) throw err // a

			if (!result) {
				new db({
					serverID: interaction.guildId,
					channels: [{ channelID, channelYTID }],
				}).asave().catch(console.error)
			} else {
				result.channels.push({ channelID, channelYTID })
				result.save().catch(console.error)
			}
		})

	},
}

module.exports = command