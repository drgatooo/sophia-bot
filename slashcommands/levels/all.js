const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const levels = require('../../models/levels')
const seting = require('../../models/levels-set')
const error = new MessageEmbed().setTitle(':x: Error').setColor('RED')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {

	userPerms: ['SEND_MESSAGES'],
	botPerms: ['SEND_MESSAGES'],
	category: 'Niveles',

	data: new SlashCommandBuilder()
		.setName('levels')
		.setDescription('Sistema de niveles.')
		.addSubcommandGroup((z) =>
			z
				.setName('users')
				.setDescription('Comandos de usuarios')
				.addSubcommand((o) =>
					o
						.setName('rank')
						.setDescription('Mira tu Rank del sistema de niveles.')
						.addUserOption((x) =>
							x.setName('usuario').setDescription('Usuario a mirar.'),
						),
				)
				.addSubcommand((y) =>
					y
						.setName('top')
						.setDescription('Mira el TOP del sistema de niveles.'),
				),
		)
		.addSubcommandGroup((a) =>
			a
				.setName('admins')
				.setDescription('Comandos de administración')
				.addSubcommand((s) =>
					s
						.setName('set')
						.setDescription('Establece si el sistena estará on u off.')
						.addStringOption((o) =>
							o
								.setName('on-off')
								.setDescription(
									'Establece si el sistema estará prendido o apagado.',
								)
								.addChoices(
									{
										name: 'activar',
										value: 'true',
									},
									{
										name: 'desactivar',
										value: 'false',
									},
								),
						),
				)
				.addSubcommand((f) =>
					f
						.setName('channel')
						.setDescription('Establece un canal donde enviar ls anuncios de los niveles.')
						.addChannelOption((g) =>
							g
								.setName('canal')
								.setDescription('Establece un canal al cual enviar los anuncios de los niveles.')
								.setRequired(true),
						),
				),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const subcmdgroup = interaction.options.getSubcommandGroup()

		if (subcmdgroup === 'users') {
			const subcmd = interaction.options.getSubcommand()
			if (subcmd === 'rank') {
				const member =
					interaction.options.getMember('usuario') || interaction.member
				const datos = await levels.findOne({
					ServerID: interaction.guild.id,
					UserID: member.user.id,
				})
				const datosGlobales = await levels
					.find({ ServerID: interaction.guild.id })
					.sort([['XP', 'descending']])
					.exec()

				if (member.user.bot) {
					return interaction.reply({
						embeds: [
							error.setDescription(
								'Los bots no participan del sistema de niveles.',
							),
						],
						ephemeral: true,
					})
				}

				if (!datos) {
					return interaction.reply({
						embeds: [
							error.setDescription(
								'No hay un registro con progreso del usuario.',
							),
						],
						ephemeral: true,
					})
				}

				if (!datosGlobales) {
					return interaction.reply({
						embeds: [
							error.setDescription(
								'Nadie en el servidor tiene un progreso registrado.',
							),
						],
						ephemeral: true,
					})
				}


				const embed = new MessageEmbed()
					.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ size: 2048, format: 'png' }) })
					.setTitle('Rank Sophia levels..')
					.addFields(
						{
							name: 'XP:', value: `\`${datos.XP}\``, inline: true,
						},
						{
							name: 'XP REQUERIDA:', value: `\`${datos.Limit}\``, inline: true,
						},
						{
							name: 'NIVEL:', value: `\`${datos.Nivel}\``, inline: true,
						},
						{
							name: '\u200b', value: '\u200b', inline: true,
						},
						{
							name: 'RANK:', value: `${datosGlobales.findIndex((datosusuario) => datosusuario.UserID === member.user.id) + 1}`, inline: true,
						},
						{
							name: '\u200b', value: '\u200b', inline: true,
						},
					)
					.setColor('#00FFFF')

				interaction.reply({ embeds: [embed] })
			}

			if (subcmd === 'top') {
				await interaction.deferReply()
				let datosGlobales = await levels
					.find({ ServerID: interaction.guild.id })
					.sort([['XP', 'descending']])
					.exec()
				datosGlobales = datosGlobales.slice(0, 10)
				if (!datosGlobales) {
					return interaction.reply({
						embeds: [
							error.setDescription(
								'Nadie en el servidor tiene un progreso registrado.',
							),
						],
						ephemeral: true,
					})
				}

				const puestoInteraction =
					datosGlobales.findIndex(
						(datos) => datos.UserID === interaction.user.id,
					) + 1

				const embed = new MessageEmbed()
					.setTitle(`TOP ${interaction.guild.name}`)
					.setDescription(
						`${datosGlobales
							.map(
								(dato, indice) =>
									`${
										indice === 0 ? '🥇' : indice === 1 ? '🥈' : indice === 2 ? '🥉' : indice + 1
									}. **${
										client.users.cache.get(dato.UserID).tag
									}** - \`${dato.XP} XP\``,
							)
							.join('\n')}`,
					)
					.setColor('#00FFFF')
					.setFooter({
						text: `Eres el puesto: ${puestoInteraction}`,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					})

				interaction.followUp({ embeds: [embed] })
			}
		}

		if (subcmdgroup === 'admins') {
			const subcmd = interaction.options.getSubcommand()
			if (subcmd === 'set') {
				const data = await seting.findOne({ ServerID: interaction.guildId })
				if (data) {
					await seting.findOneAndUpdate(
						{
							ServerID: interaction.guildId,
						},
						{
							Set: interaction.options.getString('on-off') === 'true' ? true : false,
						},
					)
				} else {
					const newdb = new seting({
						ServerID: interaction.guildId,
						Set: interaction.options.getString('on-off') === 'true' ? 'true' : 'false',
					})
					await newdb.save()
				}
				const embed = new MessageEmbed()
					.setTitle('Vale.')
					.setDescription(`He dejado el sistema establecido como \`${interaction.options.getString('on-off') === 'true' ? 'activado' : 'desactivado' }\` en mi base de datos`)
					.setColor('GREEN')
				interaction.reply({ embeds: [embed] })
			}

			if (subcmd === 'channel') {
				if (!interaction.options.getChannel('canal').type === 'GUILD_TEXT') return interaction.reply({ embeds: [error.setDescription('Selecciona un canal de texto.')], ephemeral: true })
				const data = await seting.findOne({ ServerID: interaction.guildId })
				if (data) {
					await seting.findOneAndUpdate(
						{
							ServerID: interaction.guildId,
						},
						{
							ChannelSend: interaction.options.getChannel('canal').id,
						},
					)
				} else {
					const newdb = new seting({
						ServerID: interaction.guildId,
						ChannelSend: interaction.options.getChannel('canal').id,
					})
					await newdb.save()
				}
				const si = new MessageEmbed()
					.setTitle('Vale.')
					.setDescription(`He dejado el canal establecido en ${interaction.options.getChannel('canal')} en mi base de datos.`)
					.setColor('GREEN')
				interaction.reply({ embeds: [si] })
			}
		}
	},
}

module.exports = command