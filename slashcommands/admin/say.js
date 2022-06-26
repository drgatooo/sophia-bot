const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')

module.exports = {
	userPerms: ['ADMINISTRATOR'],
	botPerms: ['ADMINISTRATOR'],
	category: 'Administración',
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Envia un mensaje a traves del bot.')
		.addStringOption((o) =>
			o
				.setName('texto')
				.setDescription('Texto que enviará el bot.')
				.setRequired(true),
		),

	async run(client, interaction) {
		const text = interaction.options.getString('texto')

		const log = new MessageEmbed().setTitle('Comando Say usado.').addFields({ name: 'Texto:', value: text, inline: true }, { name: 'Autor:', value: `${client.users.cache.get(interaction.user.id).tag} (${interaction.user.id})`, inline: true }, { name: 'Servidor:', value: `${client.guilds.cache.get(interaction.guild.id).name} (${interaction.guild.id})` })
		const enviado = new MessageEmbed()
			.setTitle('<a:TPato_Check:911378912775397436> Enviado.')
			.setDescription('Tu mensaje fue enviado!')
			.setColor('GREEN')

		await interaction.channel.send(`${text}`)
		interaction.reply({ embeds: [enviado], ephemeral: true })
		client.channels.cache.get('990750031697039451').send({ embeds: [log] })
	},
}
