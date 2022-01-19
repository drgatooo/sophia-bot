const client = require('../index.js')
const { MessageEmbed } = require('discord.js')
const schema = require('../models/setWelcome.js')


client.on('guildMemberRemove',async (member) => {
    
    const ch = await schema.findOne({ ServerID: member.guild.id })

    if (ch) {
        try {
            const channel = member.guild.channels.cache.get(ch.ChannelID)

            const goodbye = new MessageEmbed()
            .setTitle('🛫 Adíos!')
            .setDescription(`<@${member.id}> Ha abandonado el servidor :weary:\n
            Ahora somos: **${member.guild.memberCount}** Miembros!`)
            .setColor('ORANGE')
            channel.send({embeds: [goodbye]})
        } catch (err) {
            console.log(err)
        }

    } else {
        return
    }
    
   

})