const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    category: "Música",


    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pon pausa a la canción."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const e = new MessageEmbed()
        .setTitle("Error<a:puntos:878324208864722954>")
        .setColor("DARK_RED")
        
        if(!interaction.member.voice.channel) return interaction.reply({embeds: [e.setDescription("Debes estar en un canal de voz.")], ephemeral: true})
        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({embeds: [e.setDescription("Debes estar en el mismo canal de voz que yo.")], ephemeral: true})

        const queue = client.distube.getQueue(interaction.member.voice.channel)
        if(!queue) return interaction.reply({embeds: [e.setDescription("No hay canciones a la espera.")], ephemeral: true})
        if(queue.paused) return interaction.reply({embeds: [e.setDescription("La lista ya está pausada.")], ephemeral: true})

        try{
            client.distube.pause(interaction.member.voice.channel)
            const exito = new MessageEmbed()
            .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
            .setDescription("Has pausado la música.")
            .setFooter("Este mensaje será eliminado en 10 segundos.")
            .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
            .setColor("GREEN")
            interaction.reply({embeds: [exito] }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000)
            })
        } catch {
            interaction.reply({embeds: [e.setDescription("Ya esta pausado.")], ephemeral: true})  
        }
    }
}

module.exports = command;