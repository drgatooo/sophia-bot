const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    category: "Música",


    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Reanuda la reproducción de la música."),

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
        if(!queue) return interaction.reply({embeds: [e.setDescription("No hay canciónes a la espera.")], ephemeral: true})
        if(!queue.pause) return interaction.reply({embeds: [e.setDescription("ya esta resumida la reproducción.")], ephemeral: true})
        if(queue.pause) return interaction.reply({embeds: [e.setDescription("La lista no está pausada.")], ephemeral: true})

        try{
            client.distube.resume(interaction.member.voice.channel)
            const exito = new MessageEmbed()
            .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
            .setDescription("Has reanudado la música.")
            .setFooter({text: "Este mensaje será eliminado en 10 segundos.", iconURL: interaction.user.displayAvatarURL({dynamic: true})})
            .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
            .setColor("GREEN")
            interaction.reply({embeds: [exito] }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000)
            })
        } catch {
            const erro = new MessageEmbed()
            .setColor("DARK_RED")
            .setDescription(":x: Ha ocurrido un error inesperado!, vuelve a intentarlo.")
            interaction.reply({embeds: [erro], ephemeral: true})
        }


    }
}

module.exports = command;