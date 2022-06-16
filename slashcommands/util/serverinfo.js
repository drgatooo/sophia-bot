const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js-light");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Utilidad",


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
    const guild = interaction.guild

    const owner = await interaction.guild.fetchOwner()    
    let guildDescription = guild.description
    let guildTier = guild.premiumTier.toString()

    if(!guildDescription) {
      guildDescription = 'No establecida.'
    }
    if(guildTier == "NONE"){
        guildTier = "Sin nivel actual."
    }

    const Embed = new MessageEmbed()
    .setTitle('Información Servidor.')
    .addFields({
                name: 'NOMBRE:',
                value: guild.name,
                inline: true
              },
              {
                name: 'ID SERVIDOR:',
                value: guild.id,
                inline: true
              },
              {
                name: 'DESCRIPCIÓN:',
                value: guildDescription,
                inline: true
              },
              {
                name: 'CREADO:',
                value: `<t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>`,
                inline: true
              },
              {
                name: 'DUEÑO:',
                value: owner.user.tag,
                inline: true
              },
              {
                name: 'MIEMBROS TOTALES:',
                value: guild.memberCount.toString(),
                inline: true
              },
              {
                name: 'MEJORAS:',
                value: guild.premiumSubscriptionCount.toString(),
                inline: true
              },
              {
                  name: 'ROLES:',
                  value: guild.roles.cache.size.toString(),
                  inline: true
              },
              {
                name: 'NIVEL MEJORAS:',
                value: guildTier,
                inline: true
              })
        .setColor("#00FFFF")
        .setFooter({text: "Consultado por: " + interaction.member.displayName, iconURL: interaction.user.displayAvatarURL({dynamic: true, size : 1024 })});
        
        if(icono){
                Embed.setThumbnail(`${icono}`)
            }
            if(interaction.guild.banner != null) {
                Embed.setImage(`${interaction.guild.bannerURL({ dynamic: true })}`); 
            }
        
        await interaction.reply({embeds: [Embed], components: [row]})

        const filtro = x => x.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({filter: filtro, time: 30000})

        collector.on("collect", async i => {
            i.deferUpdate()
			if(i.user.id != interaction.user.id){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(":x: Error")
                    .setDescription("Esta no es tu interacción.")
                    .setColor("RED")
                ]})
            }
            
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