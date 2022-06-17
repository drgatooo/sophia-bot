const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['KICK_MEMBERS'],
	botPerms: ['KICK_MEMBERS'],
	category: 'Moderación',

	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Aisla temporalmente a un usuario.')
		.addUserOption((o) =>
			o
				.setName('usuario')
				.setDescription('El usuario al cual aislaras.')
				.setRequired(true),
		)
		.addIntegerOption((o) =>
			o.setName('minutos').setDescription('Minutos a aislar.').setRequired(true),
		)
		.addStringOption((o) =>
			o
				.setName('razon')
				.setDescription('Razon del aislamiento.')
				.setRequired(false),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const ms = require('ms')
		const args = interaction.options
		const usuario = args.getMember('usuario')
		let razon = args.getString('razon')
		const tiempo = args.getInteger('minutos')
		const time = ms(`${tiempo}m`)
		const embed = new MessageEmbed().setTitle(':x: Error').setColor('RED')

		if (usuario.id === interaction.user.id) {
			return interaction.reply({
				embeds: [embed.setDescription('No te puedes auto mutear.')],
				ephemeral: true,
			})
		}
		if (usuario.user.bot) {
			return interaction.reply({
				embeds: [embed.setDescription('No puedes mutear a un bot.')],
				ephemeral: true,
			})
		}
		if (usuario.isCommunicationDisabled()) {
			return interaction.reply({
				embeds: [
					embed.setDescription(
						`El usuario **${usuario.user.username}** ya se encuentra en un hard mute`,
					),
				],
				ephemeral: true,
			})
		}
		if (
			interaction.member.roles.highest.comparePositionTo(usuario.roles.highest) <= 0
		) {
			return interaction.reply({
				embeds: [
					embed.setDescription('El miembro tiene un rol superior al tuyo.'),
				],
				ephemeral: true,
			})
		}
		if (
			interaction.guild.me.roles.highest.comparePositionTo(usuario.roles.highest) <=
			0
		) {
			return interaction.reply({
				embeds: [
					embed.setDescription('El miembro tiene un rol superior al mio.'),
				],
				ephemeral: true,
			})
		}
		if (interaction.guild.ownerId === usuario.id) {
			return interaction.reply({
				embeds: [embed.setDescription('No puedo mutear al dueño del servidor.')],
				ephemeral: true,
			})
		}
		if (!Number.isInteger(tiempo)) {
			return interaction.reply({
				embeds: [embed.setDescription('No puedes poner números con decima.')],
				ephemeral: true,
			})
		}
		if (time < 59000) {
			return interaction.reply({
				embeds: [
					embed.setDescription('No puedo dar un mute por menos de 1 minuto.'),
				],
				ephemeral: true,
			})
		}
		if (time > 2419200000) {
			return interaction.reply({
				embeds: [
					embed.setDescription('No puedo dar un mute por más de 28 días.'),
				],
				ephemeral: true,
			})
		}
		if (!razon) razon = 'No especificada..'

		usuario.timeout(time, razon)
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('<a:cora:925477856711180379> Exito')
					.setDescription(
						`Que mala suerte, al parecer el usuario ${usuario} ha sido hard muteado (aislado) del resto de personas, el actualmente ve los mensajes pero no puede escribir, nos vemos luego amig@.`,
					)
					.addField('Usuario:', `${usuario}`, true)
					.addField('Tiempo:', `${tiempo} minuto(s)`, true)
					.addField('Razón:', `${razon}`, true)
					.setColor('#00FFFF'),
			],
		})

		usuario
			.send({
				embeds: [
					new MessageEmbed()
						.setTitle('<a:cora:925477856711180379> Hola')
						.setDescription(
							`Que mala suerte, ${usuario} has sido hard muteado (aislado) del resto de personas en ${interaction.guild.name}, nos vemos luego amig@.`,
						)
						.addField('Usuario:', `${usuario}`, true)
						.addField('Tiempo:', `${tiempo} minuto(s)`, true)
						.addField('Razón:', `${razon}`, true)
						.setColor('#00FFFF'),
				],
			})
			.then(async () => {
				await interaction
					.followUp({
						embeds: [
							new MessageEmbed()
								.setTitle(
									'<a:Stable:910938393968517180> Enviado al privado del usuario.',
								)
								.setColor('GREEN'),
						],
						ephemeral: true,
					})
					.catch(async () => {
						await interaction.followUp({
							embeds: [
								new MessageEmbed()
									.setTitle(
										// eslint-disable-next-line quotes
										"<a:Down:910938393993699350> No se ha podido enviar al privado. (MD'S bloqueados.)",
									)
									.setColor('RED'),
							],
							ephemeral: true,
						})
					})
			})
	},
}

module.exports = command
