const client = require('../index.js')
const { MessageEmbed } = require('discord.js')
const schema = require('../models/setWelcome.js')


client.on('guildMemberAdd', async (member) => {

    const ch = await schema.findOne({ ServerID: member.guild.id })

    if (ch && ch.ChannelID) {
        try {
            const channel = member.guild.channels.cache.get(ch.ChannelID)
            const welcome = new MessageEmbed()
                .setTitle('🛬 Nuevo Miembro!')
                .setDescription(`Bienvenido! <@${member.id}> a ${member.guild.name}!\n
                Ahora en total somos: **${member.guild.memberCount}** Miembros! Que felicidad.`)
                .setColor('RANDOM')
            channel.send({ embeds: [welcome] })
        } catch (err) {
            console.log(err)
        }

    } else {
        return
    }

})