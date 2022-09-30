const { SlashCommandBuilder } = require('@discordjs/builders')
// eslint-disable-next-line no-unused-vars
const { MessageEmbed, Client, CommandInteraction } = require('discord.js-light')

module.exports = {
	userPerms: ['BAN_MEMBERS'],
	category: 'Moderación',
	languageKeys: ['UNSPECIFIED', 'ERROR', 'CANT_BAN_BOT', 'YOU_CANT_SELF_BAN', 'I_CANT_SELF_BAN', 'YOU_CANT_BAN_HIGHER_ROLE', 'I_CANT_BAN_USER', 'MEMBER_BANNED', 'USER_SUCCESSFULLY_BANNED', 'MEMBER', 'STAFF', 'REASON', 'ERROR_OCURRED_DEVELOPERS_ALREADY_NOTIFIED'],
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Banea a un usuario')
		.setDescriptionLocalization('en-US', 'Ban a member')
		.addUserOption((o) =>
			o
				.setName('usuario')
				.setDescription('Usuario a banear')
				.setNameLocalization('en-US', 'user')
				.setDescriptionLocalization('en-US', 'User to ban')
				.setRequired(true),
		)
		.addStringOption((o) =>
			o
				.setName('razón')
				.setDescription('Razón del baneo')
				.setNameLocalization('en-US', 'reason')
				.setDescriptionLocalizations('en-US', 'The reasonfor the ban')
				.setRequired(false),
		),

	/**
		* @param {Client} client Client
		* @param {CommandInteraction} interaction Interaction
	  */

	async run(client, interaction, language) {
		const args = interaction.options
		const member = interaction.guild.members.cache.get(args.getUser('usuario').id)
		let reason = args.getString('razón')
		if (!reason) reason = language[0]

		if (member.user.bot) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(`:x: ${language[1]}`)
						.setDescription(language[2])
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}

		if (member.user.id === interaction.member.id) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(`:x: ${language[1]}`)
						.setDescription(language[3])
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}

		if (member.user.id === client.user.id) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(`:x: ${language[1]}`)
						.setDescription(language[4])
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}

		if (
			member.roles.highest.position >= interaction.member.roles.highest.position &&
			interaction.member.guild.ownerId !== interaction.member.id
		) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(`:x: ${language[1]}`)
						.setDescription(language[5])
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}

		if (!member.bannable) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(`:x: ${language[1]}`)
						.setDescription(language[6])
						.setColor('RED'),
				],
				ephemeral: true,
			})
		}

		const success = new MessageEmbed()
			.setTitle(`👋 ${language[7]}`)
			.setDescription(language[8])
			.setColor('GREEN')
			.addField(`👤 ${language[9]}: `, `${member}`, true)
			.addField(`👮‍♂️ ${language[10]}: `, `<@${interaction.member.id}>`, true)
			.setTimestamp()
		if (reason !== language[0]) success.addField(`💥 ${language[11]}: `, reason, true)

		await member
			.ban({ reason })
			.then(() => interaction.reply({ embeds: [success] }))
			.catch((err) => {
				interaction.reply({
					content: language[12],
					ephemeral: true,
				})
				console.log(err)
			})
	},
}
