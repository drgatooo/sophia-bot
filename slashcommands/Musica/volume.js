const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    category: "Música",


    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sube o baja el volúmen a la música.")
    .addIntegerOption(o => o.setName("volumen").setDescription("establece el nivel de volumen").setRequired(true)),

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
        const args = interaction.options;
        const volumen = args.getInteger("volumen"); 
        if(volumen < 1) return interaction.reply({embeds: [e.setDescription("El volúmen debe ser mayor a 1")], ephemeral: true})
        if(volumen < 0) return interaction.reply({embeds: [e.setDescription("Ese volúmen no es válido.")], ephemeral: true})
        if(volumen === 0) return interaction.reply({embeds: [e.setDescription("El volúmen debe ser mayor a 0 y 1")], ephemeral: true})
        if(volumen > 100) return interaction.reply({embeds: [e.setDescription("El volúmen debe ser menor a 100")], ephemeral: true})
        
        try{
            client.distube.setVolume(interaction.member.voice.channel, volumen)
            const exito = new MessageEmbed()
            .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
            .setDescription(`Has establecido el volumen ha **${volumen}%**.`)
            .setFooter("Este mensaje será eliminado en 10 segundos.")
            .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
            .setColor("GREEN")
            interaction.reply({embeds: [exito] }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000)
            })
        }catch{
            const erro = new MessageEmbed()
            .setColor("DARK_RED")
            .setDescription(":x: Ha ocurrido un error inesperado!, vuelve a intentarlo.")
            interaction.reply({embeds: [erro], ephemeral: true})
        }

    }
}

module.exports = command;