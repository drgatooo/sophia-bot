const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const schema = require('../../models/limitusecommands')
const { ChannelType } = require('discord-api-types/v10')
const getLanguage = require('../../functions/getLanguage')
/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['MANAGE_GUILD'],
	botPerms: ['MANAGE_GUILD'],
	category: 'Configuración',

	data: new SlashCommandBuilder()
		.setName('channelcommands')
		.setDescription(
			'Establece o quita el canal de uso de comandos de Sophia del servidor.',
		)
		.addSubcommand((s) =>
			s
				.setName('enable')
				.setDescription('Activa el sistema')
				.setDescriptionLocalization('en-US', 'Enable the system')
				.addChannelOption((o) =>
					o
						.addChannelTypes(ChannelType.GuildText, ChannelType.GuildPublicThread, ChannelType.GuildPublicThread, ChannelType.GuildNews, ChannelType.GuildNewsThread)
						.setName('canal')
						.setNameLocalization('en-US', 'channel')
						.setDescription('Canal de comandos')
						.setDescriptionLocalization('en-US', 'Command channel')
						.setRequired(true),
				),
		)
		.addSubcommand((o) =>
			o.setName('disable').setDescription('Desactiva el sistema.').setDescriptionLocalization('en-US', 'Disable the system'),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const args = interaction.options
		const subcmd = args.getSubcommand()
		const language = getLanguage(client, interaction, 'ESTABLISHES_ANOTHER_CHANNEL_ID', 'COMMAND_USAGE_UPDATE', 'READY', 'COMMAND_USAGE_SET', 'I_DEACTIVED_SYSTEM')

		if (subcmd === 'enable') {
			const chid = args.getChannel('canal')

			const sameID = new MessageEmbed()
				.setTitle('❌ Error')
				.setColor('RED')
				.setDescription(language[0])

			const successUpdate = new MessageEmbed()
				.setTitle(`✅ ${language[2]}`)
				.setColor('GREEN')
				.setDescription(language[1].replace('{channel}', `<#${chid.id}>`))

			const success = new MessageEmbed()
				.setTitle(`✅ ${language[2]}`)
				.setColor('GREEN')
				.setDescription(language[3].replace('{channel}', `<#${chid.id}>`))

			const channel = await schema.findOne({ ServerID: interaction.guild.id })

			if (!channel) {
				const ch = new schema({
					ServerID: interaction.guild.id,
					ChannelID: chid.id,
				})
				await ch.save()
				return await interaction.reply({ embeds: [success] })
			} else if (channel && channel.ChannelID !== chid.id) {
				await schema.updateOne(
					{ ServerID: interaction.guild.id },
					{ $set: { ChannelID: chid.id } },
				)
				return await interaction.reply({ embeds: [successUpdate] })
			}

			if (channel && channel.ChannelID === chid.id)
				return await interaction.reply({ embeds: [sameID], ephemeral: true })
		}

		if (subcmd === 'disable') {
			await schema.deleteOne({ ServerID: interaction.guild.id })

			const embed = new MessageEmbed()
				.setTitle(language[2])
				.setDescription(language[4])
				.setColor('GREEN')

			interaction.reply({ embeds: [embed] })
		}
	},
}

module.exports = command
