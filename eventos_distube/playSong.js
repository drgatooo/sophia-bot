const { MessageEmbed } = require("discord.js")

module.exports = (client, queue, song) => {

queue.textChannel.send({ 
    embeds: [
        new MessageEmbed()
        .setColor("GREEN")
        .addField("**Reproduciendo:**", `[${song.name}](${song.url})`, true)
        .addField("**Solicitada por:**", `<@${song.user.id}>`, true)
        .setAuthor(`${song.user.username}`, song.user.displayAvatarURL({dynamic: true}))
        .setColor("GREEN")
    ]
})

}