const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Información",


    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Observa información del servidor."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setLabel("Mapa de los roles.")
            .setStyle("DANGER")
            .setCustomId("mapa")
        )
        const icono = interaction.guild.iconURL({size : 2048, dynamic: true})
        const Embed = new MessageEmbed()
            .setColor("#00FFFF")
            .setTitle(`Nombre del Servidor: ${interaction.guild.name}`)
            .addField("**Dueño ID:**", interaction.guild.ownerId)
            .addField("**Server ID:** ", `${interaction.guild.id}`)
            .addField("**Dueño:**", `<@${interaction.guild.ownerId}>`, true)
            .addField("**Fecha de Creación:** ", `${interaction.guild.createdAt}`, true)
            .addField("**Miembros:** ", `${interaction.guild.memberCount}`, true)
            .addField("**Bots:**", `${interaction.guild.members.cache.filter(m => m.user.bot).size}`, true)
            .addField("**Canales:** ", `${interaction.guild.channels.cache.size}`, true)
            .addField("**Roles:** ", `${interaction.guild.roles.cache.size}`, true)
            .setThumbnail(`${icono}`)
            .setFooter({text: "Consultado por: " + interaction.member.displayName, iconURL: interaction.user.displayAvatarURL({dynamic: true, size : 1024 })});
            
            if(interaction.guild.banner != null) {
                Embed.setImage(`${interaction.guild.bannerURL({ dynamic: true })}`); 
            }
        
        await interaction.reply({embeds: [Embed], components: [row]})

        const filtro = x => x.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({filter: filtro, time: 15000})

        collector.on("collect", async i => {
            i.deferUpdate()

            if(i.customId === "mapa"){
                const embed = new MessageEmbed()
                .setTitle("Mapa de roles.")
                .addField("Roles:", interaction.guild.roles.cache.map(x => x.name).join("\n"))
                .setColor("GREEN")
                interaction.followUp({embeds: [embed], ephemeral: true})
            } 
        })

        collector.on("end", async i => {
            interaction.editReply({embeds: [Embed], components: []})
        })
    }
}

module.exports = command;