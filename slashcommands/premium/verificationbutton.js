const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const schema = require("../../models/verificacion-boton")

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["MANAGE_GUILD"],
    botPerms: ["MANAGE_GUILD"],
    category: "premium",
    isPremium: true,


    data: new SlashCommandBuilder()
    .setName("verificationbutton")
    .setDescription("¿No te gusta el captcha?, vale, aqui tienes por botón!")
    .addSubcommand(o => 
        o.setName("enable")
        .setDescription("Activa el sistema de verificación por reacción.")
        .addStringOption(o =>
            o.setName("tituloembed")
            .setDescription("¿Qué titulo llevará el embed?")
            .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("descripcionembed")
            .setDescription("¿Qué descripción llevará el embed?")
            .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("nombreboton")
            .setDescription("¿Qué nombre llevará el botón?")
            .setRequired(true)
        )
        .addRoleOption(o =>
            o.setName("rol")
            .setDescription("¿Qué rol debo dar cuando se verifiquen?")
            .setRequired(true)
        )
        .addChannelOption(o =>
            o.setName("canal")
            .setDescription("¿Qué canal será de verificación?")
            .setRequired(false)
        )
    )
    .addSubcommand(o =>
        o.setName("disable")
        .setDescription("Desactiva el sistema.")
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options
        const subcmd = args.getSubcommand()
        const existe = await schema.findOne({ ServerID: interaction.guild.id })
        const channel = args.getChannel("canal") || interaction.channel
        const rol = args.getRole("rol")
        const titulo = args.getString("tituloembed")
        const descripcion = args.getString("descripcionembed")
        const nombre = args.getString("nombreboton")

    if(subcmd === "enable"){
        if(existe){
            interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription(`El sistema ya se encuentra activo en <#${existe.ChannelID}>`)
                .setColor("RED")
            ], ephemeral: true})

        } else {

            if(channel){
                if(channel.type !== 'GUILD_TEXT' || !channel.viewable) {
                const noValid = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription('¡Ese no es un canal valido!')
                .setColor('RED')
                return await interaction.reply({ embeds: [noValid], ephemeral: true });
                }
                const sameID = new MessageEmbed()
                .setTitle('❌ Error')
                .setColor('RED')
                .setDescription("El canal establecido tiene el mismo ID de antes, establece otro!");
                if(existe && existe.ChannelID === channel.id) return await interaction.reply({embeds: [sameID], ephemeral: true });
            }

            if(rol){
                const err = new MessageEmbed()
                .setTitle(":x: Error")
                .setColor("RED")
                if(rol.tags) return interaction.reply({embeds: [err.setDescription("No puede ser el rol de un bot!")], ephemeral: true })
            }

            const sc = new schema({
                ServerID: interaction.guild.id,
                ChannelID: channel.id,
                RolID: rol.id
            })
            await sc.save();

            const embed = new MessageEmbed()
            .setTitle(titulo)
            .setDescription(descripcion)
            .setColor("#00FFFF")

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setLabel(`${nombre}`)
                .setStyle("SECONDARY")
                .setCustomId("verificationsystem")
            )
            
            const respuesta = new MessageEmbed()
            .setTitle("Quedo clara! 💝")
            .setDescription("Acabo en enviar la verificación al canal seleccionado, para poder establecer otro canal usa \`/verificationbutton disable\`")
            .setColor("GREEN")

            interaction.reply({embeds: [respuesta], ephemeral: true}).then(() => {
                channel.send({embeds: [embed], components: [row]}).then(() => {
                    interaction.followUp({embeds: [
                        new MessageEmbed()
                        .setTitle("Enviado")
                        .setColor("#00FFFF")
                    ], ephemeral: true})
                }).catch(() => {
                    interaction.followUp({embeds: [
                        new MessageEmbed()
                        .setTitle("No enviado")
                        .setColor("RED")
                    ], ephemeral: true})
                })
            })
        }
    }

    if(subcmd === "disable"){
        await schema.deleteOne({ServerID: interaction.guild.id})
  
        const embed = new MessageEmbed()
        .setTitle("Okay! ♦")
        .setDescription("He desactivado el sistema!")
        .setColor("GREEN")
  
        interaction.reply({embeds: [embed]})
      }

    }
}

module.exports = command;