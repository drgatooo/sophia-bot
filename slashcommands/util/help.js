const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js-light')

module.exports = {
	category: 'Utilidad',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Muestra los comandos del bot.'),

	async run(client, interaction) {
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
			// eslint-disable-next-line no-shadow
			.filter((a, t) => data.map((a) => a.category).indexOf(a) === t)
			.filter((c) => c !== undefined)
			.filter((c) => c !== 'private')
		const obj = new Object()
		const options = new Array()
		categories.forEach((c) => {
			options.push({
				label: c,
				description: 'revisa los comandos de la categoria ' + c,
				value: c,
				emoji: emojis[c] || '➖',
			})
			data.filter((cmd) => cmd.category === c).forEach((commands) => {
				obj[c] = [...(obj[c] || []), commands.data]
			})
		})
		options.push({
			label: 'volver',
			description: 'vuelve al menú principal',
			value: 'principal',
			emoji: '❌',
		})
		// const embed1 = new MessageEmbed().setColor('#00FFFF').setTitle('¿Ayuda , alguien necesita ayuda? Acá está Sophia para ayudarte!').setDescription('🎀 Hola <@'+interaction.user.id+'> ! aca tenes una lista de comandos que podes usar\n🌐 Tengo un total de ['+client.sc.size+'] comandos para que puedas usar!\n💡 Recuerda que mis comandos se usan con slash commands (/)');

		const embed = new MessageEmbed()
			.setColor('#00FFFF')
			.setTitle('Comandos de ' + client.user.username.toLowerCase() + ' 🛠')
			.setDescription(
				'🎀 Hola <@' +
					interaction.user.id +
					'>, Tengo un total de `' +
					client.sc.size +
					'` comandos para que puedas usar! para verlos selecciona la categoria que quieras!\n\n*Espero que los disfrutes y te sean utiles!*',
			)
			.setThumbnail(client.user.avatarURL({ format: 'png' }))
			.setTimestamp()
			.setFooter({
				text: 'Unifyware Association 2022.',
				iconURL: interaction.user.avatarURL({ dynamic: true, format: 'png' }),
			})
		// categories.forEach(async (item, i) => embed.addField((emojis[Object.keys(obj)[i].toString()]||'➖')+' '+Object.keys(obj)[i].toString()+' ['+obj[item].length+']', `\`${!interaction.channel.nsfw && Object.keys(obj)[i].toLowerCase() === 'nsfw' ? 'Debes estar en un canal nsfw para ver o usar estos comandos' : obj[item].map(cmd => cmd.name).join('` `')}\``));
		const menu = new MessageSelectMenu()
			.setCustomId('menu')
			.setPlaceholder('Selecciona una categoría')
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
					content: 'No puedes interferir en el comando de otra persona.',
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
									'comandos de ' +
										c.toLowerCase() +
										' ' +
										(emojis[c] || '➖'),
								)
								.setDescription(
									`\`${
										!i.channel.nsfw &&
										c.toLowerCase() === 'nsfw'
											? 'Debes estar en un canal nsfw para ver o usar estos comandos'
											: obj[c].map((cmd) => cmd.name).join('` `')
									}\``,
								)
								.setColor('#00FFFF')
								.setTimestamp()
								.setFooter(
									interaction.user.username,
									interaction.user.avatarURL({ format: 'png' }),
								),
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
