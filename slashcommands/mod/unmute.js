const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js-light");
// okk
/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Quita el aislamiento a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("El usuario al cual aislaras.").setRequired(true)),
    
    /**
     * 
     * @param {Client} client 
     * @param {Commandraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options
        const usuario = args.getMember("usuario")
        const embed = new MessageEmbed()
        .setTitle(":x: Error")
        .setColor("RED")

        if(usuario.id === interaction.user.id) return interaction.reply({ 
            embeds: [ 
                embed.setDescription("No te puedes auto quitar el aislamiento.")
            ],
            ephemeral: true 
        })
        if(usuario.user.bot) return interaction.reply({
            embeds: [ 
                embed.setDescription("No puedes desaislar a un bot.") 
            ],
            ephemeral: true 
        })
        if(!usuario.isCommunicationDisabled()) return interaction.reply({
            embeds: [
                embed.setDescription(`El usuario **${usuario.user.username}** no se encuentra en un hard mute`)
            ],
            ephemeral: true
        })
        if(interaction.member.roles.highest.comparePositionTo(usuario.roles.highest) <= 0) return interaction.reply({ 
            embeds: [ 
                embed.setDescription("El miembro tiene un rol superior al tuyo.") 
            ], 
            ephemeral: true 
        })
        if(interaction.guild.me.roles.highest.comparePositionTo(usuario.roles.highest) <= 0) return interaction.reply({ 
            embeds: [ 
                embed.setDescription("El miembro tiene un rol superior al mio.") 
            ], 
            ephemeral: true 
        })
        if(interaction.guild.ownerId === usuario.id) return interaction.reply({ 
            embeds: [ 
                embed.setDescription("No puedo desaislar al dueño del servidor.") 
            ], 
            ephemeral: true 
        })
        
        usuario.timeout(null)
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle("<a:cora:925477856711180379> Exito")
                .setDescription(`El usuario ${usuario} ha sido des hard muteado (aislado) del resto de personas, el ya puede ver los mensajes.`)
                .addField("Usuario:", `${usuario}`, true)
                .setColor("#00FFFF")
            ]
        })

        usuario.send({
            embeds: [
                new MessageEmbed()
                .setTitle("<a:cora:925477856711180379> Hola")
                .setDescription(`El usuario ${usuario} ha sido des hard muteado (aislado) del resto de personas, el ya puede ver los mensajes.`)
                .addField("Usuario:", `${usuario}`, true)
                .setColor("#00FFFF")
            ]
        })  .then(async () => {
                await interaction.followUp({embeds: [
                    new MessageEmbed()
                    .setTitle("<a:Stable:910938393968517180> Enviado al privado del usuario.")
                    .setColor("GREEN")
                ], ephemeral: true})
            .catch(async () => {
                await interaction.followUp({embeds: [
                    new MessageEmbed()
                    .setTitle("<a:Down:910938393993699350> No se ha podido enviar al privado. (MD'S bloqueados.)")
                    .setColor("RED")
                ], ephemeral: true})
            })
        })
        
    }
}

module.exports = command;