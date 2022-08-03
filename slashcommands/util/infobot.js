const { SlashCommandBuilder } = require('@discordjs/builders')
const {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	version,
} = require('discord.js-light')
const { name, owners, programadores } = require('../../package.json')
const getLanguage = require('../../functions/getLanguage')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['SEND_MESSAGES'],
	category: 'Utilidad',

	data: new SlashCommandBuilder()
		.setName('infobot')
		.setDescription('Revisa la información general de Sophia')
		.setDescriptionLocalizations({ 'en-US': 'Review Sophia\'s general information' }),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const language = getLanguage(client, interaction, ['INVITATION', 'SUPPORT_SERVER', 'SOPHIA_INFO', 'WELCOME_TO_ABOUT_ME', 'NAME', 'DISCRIMINATOR', 'OWNERS', 'DEVELOPERS', 'CREATION_DATE', 'UPTIME', 'PROGRAMMING_LANGUAGE', 'PACKAGE', 'SERVERS', 'USERS', 'TOTAL_COMMANDS'])
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel(language[0])
				.setStyle('LINK')
				.setURL('https://invite.sophia-bot.com/'),

			new MessageButton()
				.setLabel(language[1])
				.setStyle('LINK')
				.setURL('https://discord.gg/8PSwGHhZM8'),
		)

		const embed = new MessageEmbed()
			.setTitle(language[2])
			.setDescription(
				language[3],
			)
			.addField('<a:ArrowRightGlow:878324199171690518> ' + language[4] + ':', `${name}`, true)
			.addField(
				'<a:check:878324190804070440> ' + language[5] + ':',
				`${client.user.discriminator}`,
				true,
			)
			.addField('<a:emoji_142:878324216242524190> ' + language[6] + ':', `${owners}`, true)
			.addField(
				'<a:emoji_142:878324216242524190> ' + language[7] + ':',
				`${programadores}`,
				true,
			)
			.addField(
				'<a:puntos:878324208864722954> ' + language[8] + ':',
				`<t:${parseInt(client.user.createdTimestamp / 1000)}:d>`,
				true,
			)
			.addField(
				'<a:cora:925477856711180379> ' + language[9] + ':',
				`<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
				true,
			)
			.addField(
				'<:vyxter:904595485615087636> Host:',
				'[VyxterHost](https://vyxterhost.com)',
				true,
			)
			.addField(
				'<a:de07f1a598f3418bad40172ddc1aba3a:878324224140390400> ' + language[10] + ':',
				'Javascript',
				true,
			)
			.addField(
				'<a:de07f1a598f3418bad40172ddc1aba3a:878324224140390400> ' + language[11] + ':',
				`discord.js-light ${version}`,
				true,
			)
			.addField(
				'<a:palomita_YELLOW:881940973721116763> ' + language[12] + ':',
				`${client.guilds.cache.size}`,
				true,
			)
			.addField(
				'<a:palo:883588606290194432> ' + language[13] + ':',
				`${client.guilds.cache.reduce(
					(prev, guild) => prev + guild.memberCount,
					0,
				)}`,
				true,
			)
			.addField(
				'<a:Giveaways:878324188753068072> ' + language[14] + ':',
				client.sc.filter((cmd) => cmd.category !== 'Owner').size.toString(),
				true,
			)
			.setColor('00FFFF')

		interaction.reply({ embeds: [embed], components: [row] })
	},
}

module.exports = command
