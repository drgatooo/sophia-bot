const { SlashCommandBuilder } = require('@discordjs/builders')
const { Rank } = require('canvacord')
const { MessageEmbed, MessageAttachment } = require('discord.js-light')
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
								.setName('on-false')
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
										value: 'false', // se supone que es un boolean, ya, pero la opcion es para un string, por algo existe boloeanOPtion, ese era el error
									},
								),
						),
				)
				.addSubcommand((f) =>// el problema es este comando
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

				const rankcard = new Rank()
					.setAvatar(
						member.user.displayAvatarURL({ size: 2048, format: 'png' }),
					)
					.setCurrentXP(datos.XP)
					.setRequiredXP(datos.Limit)
					.setLevel(datos.Nivel)
					.setStatus('online')
					.setProgressBar('#00FFFF', 'COLOR')
					.setUsername(member.user.username)
					.setDiscriminator(member.user.discriminator)
					.setRank(
						datosGlobales.findIndex(
							(datosusuario) => datosusuario.UserID === member.user.id,
						) + 1,
					)

				const buffer = await rankcard.build()
				const archivo = new MessageAttachment(buffer, 'sophia-rank.png')

				interaction.reply({ files: [archivo] })
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
				await seting.findOneAndUpdate(
					{
						ServerID: interaction.guildId,
					},
					{
						Set: interaction.options.getString('on-false') === 'true' ? true : false,
					},
				)
				const embed = new MessageEmbed()
					.setTitle('Vale.')
					.setDescription(`He dejado el sistema establecido como \`${interaction.options.getString('on-false') === 'true' ? 'activado' : 'desactivado' }\` en mi base de datos`)
					.setColor('GREEN')
				interaction.reply({ embeds: [embed] })
			}

			if (subcmd === 'channel') {
				if (!interaction.options.getChannel('canal').type === 'GUILD_TEXT') return interaction.reply({ embeds: [error.setDescription('Selecciona un canal de texto.')], ephemeral: true })
				await seting.findOneAndUpdate(
					{
						ServerID: interaction.guildId,
					},
					{
						ChannelSend: interaction.options.getChannel('canal'),
					},
				)
				const si = new MessageEmbed()
					.setTitle('Vale.')
					.setDescription(`He dejado el canal establecido en \`${interaction.options.getChannel('canal')}\` en mi base de datos.`)
					.setColor('GREEN')
				interaction.reply({ embeds: [si] })
			}
		}
	},
}

module.exports = command