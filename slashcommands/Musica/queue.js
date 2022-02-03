const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    category: "Música",


    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Revisa el listado de canciones que ahi a la espera."),

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

        const embed = new MessageEmbed()
        .setTitle(`Lista de reproducción: ${interaction.guild.name}`)
        .setDescription('\n' + queue.songs.map((song, id) => `**${id+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n"))
        .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
        .setColor("GREEN")
    
        interaction.reply({embeds: [embed]})
    }
}

module.exports = command;