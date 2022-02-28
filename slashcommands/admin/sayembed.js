const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    userPerms: ["MANAGE_MESSAGES"],
    botPerms: ["ADMINISTRATOR"],
    category: "Administración", 
    data: new SlashCommandBuilder()
    .setName("sayembed")
    .setDescription("Envia un mensaje embed con titulo como nuevo anuncio."),

    async run(client, interaction){

        const textoComponent = new TextInputComponent()
        .setCustomId('sayembed_texto')
        .setLabel('Anuncio')
        .setMinLength(1)
        .setMaxLength(4000)
        .setStyle('LONG')
        .setRequired(true)
        .setPlaceholder('Escribe aquí el texto que quieres que Sophia anuncie.')

        const modal = new Modal()
        .setTitle('Say-Embed')
        .setCustomId('sayembed')
        .addComponents(textoComponent)

        showModal(modal, { client: client, interaction: interaction });

        client.on('modalSubmit', async(modal) => {
            if(modal.customId === 'sayembed'){

                await modal.deferReply({ ephemeral: true })
                const texto = modal.getTextInputValue('sayembed_texto')

                const embed = new MessageEmbed()
                .setTitle(`Nuevo anuncio`)
                .setDescription(`${texto}`)
                .setColor("WHITE")
                .setTimestamp(new Date())

                const enviado = new MessageEmbed()
                .setTitle("<a:TPato_Check:911378912775397436> Enviado.")
                .setDescription("Tu anuncio fue enviado!")
                .setColor("GREEN")

                await modal.channel.send({ embeds: [embed] })
                modal.followUp({ embeds: [enviado], ephemeral: true })
                
            }
        })

    }
}