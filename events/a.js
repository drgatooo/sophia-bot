const client = require("../index")
const canal = "940695048339734600"
const { MessageEmbed } = require("discord.js");

client.on("ready", () => {
    client.channels.cache.get(canal).send({embeds: [
        new MessageEmbed()
        .setTitle("Bot en linea!")
        .setDescription(`Bot iniciado: <t:${parseInt(Math.round(client.readyTimestamp / 1000))}:R>`)
        .setColor("GREEN")

    ]}).then((msg) => {

        client.off("ready", () => {
            msg.edit({embeds: [
                new MessageEmbed()
                .setTitle("Bot en linea!")
                .setDescription(`Bot iniciado: <t:${parseInt(Math.round(client.readyTimestamp / 1000))}:R>`)
                .setColor("GREEN")
            ]})
        })
    })
})