const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    category: "Música",


    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Salta a la siguiente canción de la reproducción de música."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const e = new MessageEmbed()
        .setTitle("Error<a:puntos:878324208864722954>")
        .setColor("DARK_RED")
        
        const queue = client.distube.getQueue(interaction.member.voice.channel)
        if(!queue) return interaction.reply({embeds: [e.setDescription("No hay canciónes a la espera.")], ephemeral: true})    
        if(!interaction.member.voice.channel) return interaction.reply({embeds: [e.setDescription("Debes estar en un canal de voz.")], ephemeral: true})
        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({embeds: [e.setDescription("Debes estar en el mismo canal de voz que yo.")], ephemeral: true})
        
        if(!queue.songs[1]) return interaction.reply({ content: "No hay una próxima canción en la lista.", ephemeral: true })

        try{
            client.distube.skip(interaction.member.voice.channel)
            const exito = new MessageEmbed()
            .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
            .setDescription("Has saltado a la siguiente canción.")
            .setFooter("Este mensaje será eliminado en 10 segundos.")
            .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
            .setColor("GREEN")
            interaction.reply({embeds: [exito] }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000)
            })
        } catch {
            const bad = new MessageEmbed()
            .setTitle(":x: Algo ha salido mal!")
            .setDescription("No se ha saltado la cancion, puede que no haya mas a la lista.")
            .setFooter("Este mensaje será eliminado en 10 segundos.")
            .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
            .setColor("GREEN")
            interaction.reply({embeds: [bad] }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000)
            })
        }


    }
}

module.exports = command;