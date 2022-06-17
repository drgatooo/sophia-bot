const client = require('../index')
const cliente = require('@androz2091/discord-invites-tracker')
const { MessageEmbed } = require('discord.js-light')
const schema = require('../models/setinvitechannel')
const inv = cliente.init(client, {
	fetchGuilds: true,
	fetchVanity: true,
	fetchAuditLogs: true,
})

inv.on('guildMemberAdd', async (member, type, invite) => {
	const invitechannel = await schema.findOne({ ServerID: member.guild.id })

	if (invitechannel && invitechannel.ChannelID) {
		try {
			const canal = member.guild.channels.cache.get(invitechannel.ChannelID)
			const embed = new MessageEmbed().setColor('#00FFFF').setFooter({
				text: member.user.username,
				iconURL: member.user.displayAvatarURL({ dynamic: true }),
			})

			if (type === 'normal') {
				canal.send({
					embeds: [
						embed.setDescription(
							`Bienvenido/a ${member}, has sido invitado/a por **${invite.inviter.username}**, quien ahora tiene ***${invite.uses}*** invitaciónes con el link que te ha invitado.`,
						),
					],
				})
				canal.send({ content: `${member}` }).then((msg) => {
					setTimeout(() => {
						msg.delete()
					}, 1000)
				})
			} else if (type === 'vanity') {
				canal.send({
					embeds: [
						embed.setDescription(
							`Bienvenido/a ${member}, te has unido al servidor usando una URL personalizada!`,
						),
					],
				})
				canal.send({ content: `${member}` }).then((msg) => {
					setTimeout(() => {
						msg.delete()
					}, 1000)
				})
			} else if (type === 'permissions') {
				if (member.user.bot) {
					return canal.send({
						embeds: [
							embed.setDescription(
								`${member} se ha unido a traves del OAuth.`,
							),
						],
					})
				}
				canal.send({
					embeds: [
						embed.setDescription(
							`Bienvenido/a ${member}, no puedo ver quien te invitó por falta de permisos!`,
						),
					],
				})
				canal.send({ content: `${member}` }).then((msg) => {
					setTimeout(() => {
						msg.delete()
					}, 1000)
				})
			} else if (type === 'unknown') {
				if (member.user.bot) {
					return canal.send({
						embeds: [
							embed.setDescription(
								`${member} se ha unido a traves del OAuth.`,
							),
						],
					})
				}
				canal.send({
					embeds: [
						embed.setDescription(
							`Bienvenido/a ${member}, no tengo claro quien te ha invitado, lo siento!`,
						),
					],
				})
				canal.send({ content: `${member}` }).then((msg) => {
					setTimeout(() => {
						msg.delete()
					}, 1000)
				})
			}
		} catch (e) {
			console.log(e)
		}
	} else {
		return
	}
})
