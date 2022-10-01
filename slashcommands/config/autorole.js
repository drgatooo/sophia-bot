const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-light')
const schema = require('../../models/autorole.js')
const { ChannelType } = require('discord-api-types/v10')
/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['MANAGE_GUILD', 'MANAGE_ROLES'],
	botPerms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	category: 'Configuración',

	data: new SlashCommandBuilder()
		.setName('autorole')
		.setDescription('Establece el canal para usar los autoroles (BETA)')
		.setDescriptionLocalization('en-US', 'Set a channel to use autoroles (BETA)')
		.addSubcommand((s) =>
			s
				.setName('set')
				.setDescription('Establece los datos para el autoroles')
				.setDescriptionLocalization('en-US', 'Set a data for the autoroles')
				.addStringOption((o) =>
					o
						.setName('titulo')
						.setNameLocalization('en-US', 'title')
						.setDescription('Qué titulo llevará el embed?')
						.setDescriptionLocalization('en-US', 'Title that the embed will carry')
						.setRequired(true),
				)
				.addStringOption((o) =>
					o
						.setName('descripcion')
						.setNameLocalization('en-US', 'description')
						.setDescription('Qué descripción llevará el embed?')
						.setDescriptionLocalization('en-US', 'Description that the embed will carry')
						.setRequired(true),
				)
				.addChannelOption((o) =>
					o
						.setName('channel')
						.setDescription('El canal donde se creará el autorole')
						.setDescriptionLocalization('en-US', 'The channel where autoroles will be created')
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true),
				)
				.addStringOption((o) =>
					o
						.setName('roles')
						.setDescription('Tabla con la información de los roles')
						.setDescriptionLocalization('en-US', 'Table with the autoroles information')
						.setRequired(true),
				),
		)
		.addSubcommand((s) =>
			s.setName('help').setDescription('Muestra como setear los auto roles').setDescriptionLocalization('en-US', 'Show how to use autoroles'),
		),
	languageKeys: ['CHANNEL_NOT_VALID', 'INVALID_AUTOROLE_FORMAT', 'CANT_MANAGE_SOME_ROLES', 'DONT_REPEAT_ROLES', 'READY', 'CANT_TRANSFORM_JSON', 'HELP_AUTOROLE', 'HOW_SET_AUTOROLES', 'ONLY_SET_ONE_CHANNEL_AUTOROLE', 'AUTOROLE_SET_SUCCESSFULLY', 'BUTTON_TEXT_DISPLAY'],

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {string[]} language
	 */
	async run(_, interaction, language) {
		console.log(language)
		const args = interaction.options
		const subcmd = args.getSubcommand()
		if (subcmd === 'set') {
			const componentsArr = new Array()
			try {
				const channel = args.getChannel('channel')
				if (!channel.viewable) {
					return await interaction.reply({
						embeds: [
							new MessageEmbed()
								.setTitle('❌ Error')
								.setDescription(language[0])
								.setColor('RED'),
						],
						ephemeral: true,
					})
				}

				const roles = args.getString('roles')

				let rolesObj = JSON.parse(roles)
				rolesObj = rolesObj.map((r) => {
					return {
						nombreBoton: r.nombreBoton,
						rol: r.rol.trim().replace(/<@&/g, '').replace(/>/g, ''),
					}
				})

				const validateArrayData = rolesObj.every(
					(obj) =>
						typeof obj.rol === 'string' &&
						typeof obj.nombreBoton === 'string',
				)
				const validateRoleEditable = rolesObj.every(
					(obj) => interaction.guild.roles.cache.get(obj.rol).editable === true,
				)
				if (!validateArrayData) {
					return await interaction.reply({
						embeds: [
							new MessageEmbed()
								.setTitle(':x: Error')
								.setDescription(language[1].replace('{command}', '</autorole help:962759744181895238>'))
								.setColor('RED'),
						],
						ephemeral: true,
					})
				}
				if (!validateRoleEditable) {
					return await interaction.reply({
						embeds: [
							new MessageEmbed()
								.setTitle(':x: Error')
								.setDescription(language[2])
								.setColor('RED'),
						],
						ephemeral: true,
					})
				}

				rolesObj.forEach((obj) => {
					componentsArr.push(
						new MessageButton()
							.setLabel(obj.nombreBoton)
							.setCustomId(obj.rol)
							.setStyle('SECONDARY'),
					)
				})

				const repeatedIds = componentsArr
					.map((obj) => obj.customId)
					.filter((value, index, self) => self.indexOf(value) !== index)
				if (repeatedIds.length > 0) {
					return await interaction.reply({
						embeds: [
							new MessageEmbed()
								.setTitle(':x: Error')
								.setDescription(language[3])
								.setColor('RED'),
						],
					})
				}

				const components = new MessageActionRow().addComponents(...componentsArr)

				const embed = new MessageEmbed()
					.setTitle(args.getString('titulo'))
					.setDescription(args.getString('descripcion'))
					.setColor('GREEN')

				// save data
				const results = await schema.findOne({ guildId: interaction.guild.id })
				if (results) {
					await schema.updateOne(
						{ guildId: interaction.guild.id },
						{
							guildId: interaction.guild.id,
							channelId: channel.id,
							roles: rolesObj,
						},
					)
				} else {
					new schema({
						guildId: interaction.guild.id,
						channelId: channel.id,
						roles: rolesObj,
					}).save()
				}

				await interaction.guild.channels.cache
					.get(channel.id)
					.send({ embeds: [embed], components: [components] })

				await interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(language[4])
							.setDescription(language[9])
							.setColor('GREEN'),
					],
					ephemeral: true,
				})
			} catch (er) {
				console.log(er)
				await interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(':x: Error')
							.setDescription(language[5].replace('{command}', '</autorole help:962759744181895238>'))
							.setColor('RED'),
					],
					ephemeral: true,
				})
			}
		}

		if (subcmd === 'help') {
			const embed = new MessageEmbed()
				.setTitle(language[7])
				.setDescription(language[6].replace('{command}', '</autorole set:962759744181895238>').replace('{example}', '```json\n[{\n    "nombreBoton": "{textButton}",\n    "rol": "@rol"\n},\n{\n    "nombreBoton": "{textButton}",\n    "rol": "@rol"\n}]```'.replaceAll('{textButton}', language[10])))
				.setImage(
					'https://cdn.discordapp.com/attachments/894970556632403979/962770758784909312/unknown.png',
				)
				.setColor('GREEN')
				.setFooter({
					text: language[8],
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp()
			await interaction.reply({ embeds: [embed], ephemeral: true })
		}
	},
}

module.exports = command
