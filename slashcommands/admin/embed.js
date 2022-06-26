/* eslint-disable no-shadow */
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-light')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['ADMINISTRATOR'],
	botPerms: ['ADMINISTRATOR'],
	category: 'Administración',

	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Envia un mensaje en embed')
		.addStringOption((o) =>
			o
				.setName('descripcion')
				.setDescription('Descripción del embed.')
				.setRequired(true),
		)
		.addStringOption((o) =>
			o.setName('titulo').setDescription('Titulo del embed.').setRequired(false),
		)
		.addStringOption((o) =>
			o.setName('footer').setDescription('Footer del embed.').setRequired(false),
		)
		.addStringOption((o) =>
			o
				.setName('imagen')
				.setDescription('Imagen que llevará el embed.')
				.setRequired(false),
		)
		.addChannelOption((o) =>
			o
				.setName('canal')
				.setDescription('Canal a enviar el embed.')
				.setRequired(false),
		),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const args = interaction.options
		const canal = args.getChannel('canal') || interaction.channel

		if (canal) {
			if (!canal.isText()) {
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(':x: Error')
							.setDescription('El canal debe ser de texto.')
							.setColor('RED'),
					],
					ephemeral: true,
				})
			}
		}
		const title = args.getString('titulo')
		const description = args.getString('descripcion')
		const footer = args.getString('footer')
		const imagen = args.getString('imagen')

		const log = new MessageEmbed()
			.setTitle('Comando Embed usado.')
			.addFields(
				{ name: 'Title:', value: title, inline: true },
				{ name: 'Description:', value: description, inline: true },
				{ name: 'Footer:', value: footer, inline: true },
				{
					name: 'Autor:',
					value: `${client.users.cache.get(interaction.user.id).tag} (${
						interaction.user.id
					})`,
					inline: true,
				},
				{
					name: 'Servidor:',
					value: `${client.guilds.cache.get(interaction.guild.id).name} (${
						interaction.guild.id
					})`,
				},
			)
			.setImage(imagen || 'https://i.imgur.com/anPh4kJ.jpg')

		const embed = new MessageEmbed()
			.setColor('#00FFFF')
			.setDescription(`${description}`)

		if (title) embed.setTitle(title)

		if (footer) {
			embed.setFooter({
				text: footer,
				iconURL: interaction.guild.iconURL({ dynamic: true }),
			})
		}
		if (imagen) {
			const linkRegex = new RegExp(
				/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g,
			)
			if (!imagen.match(linkRegex)) {
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(':x: Error')
							.setDescription('Ingresa una url de imagen valida.')
							.setColor('RED'),
					],
					ephemeral: true,
				})
			}
			embed.setImage(imagen)
		}

		const pregunta = new MessageEmbed()
			.setTitle('<a:HeartBlack:878324191559032894> Preguntita...')
			.setDescription('¿Deseas que el embed lo envie mencionando a everyone?')
			.setColor('#00FFFF')

		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel('Con everyone')
				.setStyle('DANGER')
				.setCustomId('everyone'),

			new MessageButton()
				.setLabel('Sin everyone')
				.setStyle('PRIMARY')
				.setCustomId('sineveryone'),
		)

		const enviado = new MessageEmbed()
			.setTitle('<a:TPato_Check:911378912775397436> Enviado.')
			.setDescription('Tu mensaje fue enviado!')
			.setColor('GREEN')

		await interaction.reply({
			embeds: [pregunta],
			components: [row],
			ephemeral: true,
		})
		const filtro = (i) => i.user.id === interaction.user.id
		const collector = interaction.channel.createMessageComponentCollector({
			filter: filtro,
			time: 15000,
		})

		collector.on('collect', async (i) => {
			i.deferUpdate()

			if (i.customId === 'everyone') {
				canal.send({ embeds: [embed] })
				canal.send('@everyone').then((msg) => {
					setTimeout(() => {
						msg.delete()
					}, 2000)
				})
				interaction.editReply({
					embeds: [enviado],
					components: [],
					ephemeral: true,
				})
				client.channels.cache.get('990747964337160192').send({ embeds: [log] })
			}
			if (i.customId === 'sineveryone') {
				canal.send({ embeds: [embed] })
				interaction.editReply({
					embeds: [enviado],
					components: [],
					ephemeral: true,
				})
				client.channels.cache.get('990747964337160192').send({ embeds: [log] })
			}
		})

		collector.on('end', () => {
			interaction.editReply({ embeds: [], components: [] })
		})
	},
}

module.exports = command
