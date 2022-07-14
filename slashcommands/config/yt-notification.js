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
		.setDescription('Administra notificaciones de videos de YouTube!')
		.addSubcommand(oC =>
			oC
				.setName('set')
				.setDescription('Establece una notificación para un video de YouTube')
				.addStringOption(o =>
					o.setName('ytchannelid')
						.setDescription('Define la ID del canal de YT')
						.setRequired(true),
				)
				.addChannelOption(p =>
					p.setName('notificationchannel')
						.setDescription('Canal donde se enviará las notificaciones.')
						.setRequired(true),
				),
		)
		.addSubcommand(oC =>
			oC
				.setName('remove')
				.setDescription('Elimina una notificación para un video de YouTube')
				.addStringOption(o =>
					o.setName('ytchannelid')
						.setDescription('Define la ID del canal de YT'),
				),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const subcmd = interaction.options.getSubcommand()

		if (subcmd === 'set') {

			const ChannelYTID = interaction.options.getString('ytchannelid')
			const channel = interaction.options.getChannel('notificationchannel')
			const { id: ChannelID } = channel
			const { MessageEmbed } = require('discord.js-light')
			const error = new MessageEmbed().setColor('RED').setTitle(':x: Error')

			if (!channel.isText()) return interaction.reply({ embeds: [error.setDescription('El canal especificado no es de texto o es una categoría, ingresa uno nuevo.')], ephemeral: true })

			const data = await db.findOne({ ServerID: interaction.guildId })

			if (!data) {
				const newdb = new db({
					ServerID: interaction.guildId,
					ChannelYTID,
					ChannelID,
				})
				await newdb.save()

				const ok = new MessageEmbed()
					.setTitle('❤ Listo!')
					.setDescription(`He establecido el canal de YouTube con la id: ${ChannelYTID}\nEl canal de notificaciones será: ${channel}`)
					.setColor('GREEN')

				interaction.reply({ embeds: [ok] })
			} else {
				await db.findOneAndUpdate({
					ServerID: interaction.guildId,
				}, {
					ChannelYTID,
					ChannelID,
				})

				const rewrite = new MessageEmbed()
					.setTitle('❤ Vale, lo hago')
					.setDescription('He actualizado los datos...')
					.addFields({ name: 'ID YT:', value: ChannelYTID, inline: true }, { name: 'Canal notificación:', value: ChannelID, inline: true })
					.setColor('GREEN')

				return await interaction.reply({ embeds: [rewrite] })
			}
		}

		if (subcmd === 'remove') {
			const okay = new MessageEmbed()
				.setTitle('👌 Vale')
				.setDescription('He eliminado los datos almacenados, ya puedes setear uno nuevo.')
				.setColor('GREEN')
		

			const error = new MessageEmbed().setTitle(':x: Error').setColor('RED')
			const data = await db.findOne({ ServerID: interaction.guildId })

			if(!data) return interaction.reply({ embeds: [error.setDescription('No existe información en mi base de datos.')], ephemeral: true })
			
			await db.findOneAndDelete({
				ServerID: interaction.guildId,
			})
			
			interaction.reply({ embeds: [okay] }) // no son necesarioos
			
			}
		},
	}
}
module.exports = command