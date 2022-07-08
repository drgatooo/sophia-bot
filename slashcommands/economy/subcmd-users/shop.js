const { SlashCommandSubcommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const schema = require('../../../models/shop-model.js')
const bigInt = require('big-integer')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	category: 'Economía',

	data: new SlashCommandSubcommandBuilder().setName('shop').setDescription('Revisa la tienda.'),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(_, interaction) {
		const results = await schema.findOne({ guildid: interaction.guild.id })

		if (results && results.store.length > 0) {
			const embedSuccess = new MessageEmbed()
				.setTitle(`🛒 Tienda de ${interaction.guild.name}`)
				.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
				.setDescription(
					'Para ver la información detallada de un producto escribe: `/item-info `' +
						results.store
							.map(
								(p, i) =>
									`\n\n\`#${i + 1}\`** ${new Intl.NumberFormat().format(
										bigInt(parseInt(p.price)),
									)}$ - ${p.product}**`,
							)
							.toString()
							.replace(/,/g, ' '),
				)
				.setColor('WHITE')
				.setFooter({
					text: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp()
			return await interaction.reply({ embeds: [embedSuccess] })
		} else {
			const embedFail = new MessageEmbed()
				.setTitle(`🛒 Tienda de ${interaction.guild.name}`)
				.setDescription('☹ No hay productos en la tienda, agregalos!')
				.setColor('RED')
				.setFooter({
					text: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp()
			return await interaction.reply({ embeds: [embedFail] })
		}
	},
}

module.exports = command
