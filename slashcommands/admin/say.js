const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    userPerms: ["ADMINISTRATOR"],
    botPerms: ["ADMINISTRATOR"],
    category: "Administración", 
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Envia un mensaje a traves del bot."),

    async run(client, interaction){

        const textoComponent = new TextInputComponent()
        .setCustomId('say_texto')
        .setLabel('Texto')
        .setMinLength(1)
        .setMaxLength(4000)
        .setStyle('LONG')
        .setRequired(true)
        .setPlaceholder('Escribe aquí el texto que quieres que Sophia diga.')

        const modal = new Modal()
        .setTitle('Say')
        .setCustomId('say')
        .addComponents(textoComponent)

        showModal(modal, { client: client, interaction: interaction });

        client.on('modalSubmit', async(modal) => {
            if(modal.customId === 'say'){

                await modal.deferReply({ ephemeral: true })
                const text = modal.getTextInputValue('say_texto')

                const enviado = new MessageEmbed()
                .setTitle("<a:TPato_Check:911378912775397436> Enviado.")
                .setDescription("Tu mensaje fue enviado!")
                .setColor("GREEN")

                await modal.channel.send(`${text}`)
                modal.followUp({embeds: [enviado], ephemeral: true})
                
            }
        })
        
    }
}