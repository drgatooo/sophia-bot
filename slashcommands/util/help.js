const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js-light')

module.exports = {
	category: 'Utilidad',
	languageKeys: [
		'DESCRIPTION_OPTION_MENU',
		'MAIN_OPTION_MENU_RETURN',
		'MAIN_OPTION_MENU_DESCRIPTION',
		'MAIN_EMBED_TITLE',
		'MAIN_EMBED_DESCRIPTION',
		'SELECT_CATEGORY',
		'NOT_INTERFERE',
		'COMMANDSOF_TITLE',
		'NSFW_CHANNEL',
	],
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Muestra los comandos del bot.')
		.setDescriptionLocalization('en-US', 'show the bot commands'),

	async run(client, interaction, language) {
		const emojis = {
			Administración: '💼',
			Moderación: '👮',
			Configuración: '🔩',
			Información: 'ℹ',
			Diversión: '🎡',
			Giveaways: '🎊',
			Utilidad: '🛠️',
			Música: '🎵',
			premium: '♥',
			Economía: '💸',
		}

		const data = client.sc
		const $data = data.map((a) => a.category)
		const categories = $data
			.filter((a, t) => data.map((ac) => ac.category).indexOf(a) === t)
			.filter((c) => c !== undefined)
			.filter((c) => c !== 'private')
		const obj = new Object()
		const options = new Array()
		categories.forEach((c) => {
			options.push({
				label: c,
				description: language[0].replace('{category}', c),
				value: c,
				emoji: emojis[c] || '➖',
			})
			data.filter((cmd) => cmd.category === c).forEach((commands) => {
				obj[c] = [...(obj[c] || []), commands.data]
			})
		})
		options.push({
			label: language[1],
			description: language[2],
			value: 'principal',
			emoji: '❌',
		})

		const embed = new MessageEmbed()
			.setColor('#00FFFF')
			.setTitle(language[3].replace('{ClientName}', client.user.username.toLowerCase()) + ' 🛠')

			.setDescription(language[4].replace('{user}', interaction.user.toString()).replace('{commandsSize}', `\`${client.sc.size}\``))
			.setThumbnail(client.user.avatarURL({ format: 'png' }))
			.setTimestamp()
			.setFooter({
				text: 'Unifyware Association 2022.',
				iconURL: interaction.user.avatarURL({ dynamic: true, format: 'png' }),
			})

		const menu = new MessageSelectMenu()
			.setCustomId('menu')
			.setPlaceholder(language[5])
			.addOptions(options)
		const row = new MessageActionRow().addComponents(menu)
		interaction.reply({ embeds: [embed], components: [row] })
		const time = 60 * 1000
		const collector = interaction.channel.createMessageComponentCollector({
			filter: (u) => u.user.id === interaction.user.id,
			time,
		})
		collector.on('collect', async (i) => {
			if (interaction.user.id !== i.user.id) {
				return interaction.reply({
					content: language[6],
					ephemeral: true,
				})
			}

			categories.forEach(async (c) => {
				if (i.values[0] === c && i.values[0] !== 'principal') {
					await i.deferUpdate()
					await i.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle(
									language[7] +
										c.toLowerCase() +
										' ' +
										(emojis[c] || '➖'),
								)
								.setDescription(
									`\`${
										!i.channel.nsfw &&
										c.toLowerCase() === 'nsfw'
											? language[8]
											: obj[c].map((cmd) => cmd.name).join('` `')
									}\``,
								)
								.setColor('#00FFFF')
								.setTimestamp()
								.setFooter({
									text: interaction.user.username,
									iconURL: interaction.user.avatarURL({ format: 'png' }),
								}),
						],
						components: [row],
					})
				}
			})
			if (i.values[0] === 'principal') {
				await i.deferUpdate()
				await i.editReply({ embeds: [embed], components: [row] })
			}
		})
		setTimeout(async () => await interaction.editReply({ components: [] }), time)
	},
}
