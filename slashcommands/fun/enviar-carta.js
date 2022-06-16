const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js-light");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Diversión",


    data: new SlashCommandBuilder()
    .setName("enviar-carta")
    .setDescription("Envia una carta de forma anonima o firmada a un usuario!")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario al que enviarás la carta").setRequired(true))
    .addStringOption(o => o.setName("contenido").setDescription("¿Que quieres que diga la carta?").setRequired(true))
    .addStringOption(o => 
        o.setName("anonimo")
        .setDescription("Si o no")
        .setRequired(true)
        .addChoices(
            {name: "si", value: "true"},
            {name: "no", value: "false"}
        )
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options
        const usuario = args.getUser("usuario")
        const contenido = args.getString("contenido")
        const anonimo = args.getString("anonimo")

        const carta = new MessageEmbed()
        .setColor("DARK_VIVID_PINK")
        .setFooter({text: "Carta nueva!"})
        .setDescription(contenido)

        if(contenido.length > 4096) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("Ingresa un texto con un maximo de 4096 caracteres.").setColor("RED")], ephemeral: true})
        if(usuario.bot) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("No puedo enviar esto a un bot!").setColor("RED")], ephemeral: true})
        if(usuario == interaction.user.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("No puedes enviarte una carta a ti mismo!").setColor("RED")], ephemeral: true})

        if(anonimo == "true"){
            carta.setTitle(`Carta de Anonimo`)
        } else {
            carta.setTitle(`Carta de ${interaction.user.tag}`)
        }

        usuario.send({embeds: [carta]}).then(() => {
            carta.addField("La carta", "ha sido enviada así.")
            interaction.reply({embeds: [carta], ephemeral: true})
            interaction.channel.send({embeds: [
                new MessageEmbed()
                .setTitle("Vaya, vaya 😍")
                .setDescription(`Al parecer ${usuario} ha recibido una carta...`)
                .setColor("LUMINOUS_VIVID_PINK")
            ]})
        }).catch(() => {
            interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription("El usuario tiene los md´s cerrados, no le pude enviar la carta!")
                .setColor("RED")
            ], ephemeral: true})
        })
    }
}

module.exports = command;