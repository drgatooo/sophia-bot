const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals');

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ['ADMINISTRATOR'],
    botPerms: ['ADMINISTRATOR'],
    category: "Administración",


    data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Envia un mensaje en embed")
    .addChannelOption(o => o.setName("canal").setDescription("Canal a enviar el embed").setRequired(false)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options;
        const channel = args.getChannel("canal") || interaction.channel

        if(channel){
            if(!channel.isText()) return interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(':x: Error')
                .setDescription('El canal debe ser de texto.')
                .setColor('RED')
            ], ephemeral: true});
        }

        const titleComponent = new TextInputComponent()
        .setCustomId('title_embed')
        .setLabel('Título del Embed')
        .setStyle('SHORT')
        .setMinLength(1)
        .setMaxLength(256)
        .setPlaceholder('Aquí va el título del embed.')
        .setRequired(false)

        const descriptionComponent = new TextInputComponent()
        .setCustomId('description_embed')
        .setLabel('Descripción del Embed')
        .setStyle('LONG')
        .setMinLength(1)
        .setMaxLength(4000)
        .setPlaceholder('Aquí va la descripción del embed.')
        .setRequired(false)

        const footerComponent = new TextInputComponent()
        .setCustomId('footer_embed')
        .setLabel('Footer del Embed')
        .setStyle('LONG')
        .setMinLength(1)
        .setMaxLength(2048)
        .setPlaceholder('Aquí va el footer del embed.')
        .setRequired(false)

        const imageComponent = new TextInputComponent()
        .setCustomId('image_embed')
        .setLabel('Imagen del Embed')
        .setStyle('SHORT')
        .setMinLength(1)
        .setMaxLength(4000)
        .setPlaceholder('Introduce una URL para la imagen.')
        .setRequired(false)

        const modal = new Modal()
        .setTitle('Embed')
        .setCustomId('embed_modal')
        .addComponents(titleComponent, descriptionComponent, footerComponent, imageComponent)

        showModal(modal, { client: client, interaction: interaction })

        client.on("modalSubmit", async (modal) => {
            if(modal.customId === 'embed_modal'){
                await modal.deferReply({ ephemeral: true })
                const title = modal.getTextInputValue('title_embed')
                const description = modal.getTextInputValue('description_embed')
                const footer = modal.getTextInputValue('footer_embed')
                const imagen = modal.getTextInputValue('image_embed')
        
                const embed = new MessageEmbed()
                .setColor("#00FFFF")
                .setDescription(`${description}`)
                if(title){
                    embed.setTitle(title)
                }
                if(footer){
                    embed.setFooter({text: footer, iconURL: modal.guild.iconURL({dynamic: true})})
                }
                if(imagen){
                    let linkRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g);
                    if((!imagen.match(linkRegex))) modal.followUp({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("Ingresa una url de imagen valida.").setColor("RED")], ephemeral: true})
                    embed.setImage(imagen)
                }
                
                const pregunta = new MessageEmbed()
                .setTitle("<a:HeartBlack:878324191559032894> Preguntita...")
                .setDescription(`¿Deseas que el embed lo envie mencionando a everyone?`)
                .setColor("#00FFFF")
        
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setLabel("Con everyone")
                    .setStyle("DANGER")
                    .setCustomId("everyone"),
        
                    new MessageButton()
                    .setLabel("Sin everyone")
                    .setStyle("PRIMARY")
                    .setCustomId("sineveryone")
                )
        
                const enviado = new MessageEmbed()
                .setTitle("<a:TPato_Check:911378912775397436> Enviado.")
                .setDescription("Tu mensaje fue enviado!")
                .setColor("GREEN")
        
                await modal.followUp({embeds: [pregunta], components: [row], ephemeral: true})
                const filtro = i => i.user.id === modal.user.id
                const collector = modal.channel.createMessageComponentCollector({filter: filtro, time: 15000})
        
                collector.on("collect", async i => {
                    i.deferUpdate();
        
                    if(i.customId === "everyone"){
                        channel.send({embeds: [embed]})
                        channel.send("@everyone").then(msg => {
                            setTimeout(() => {
                                msg.delete()
                            }, 2000)
                        })
                        modal.editReply({embeds: [enviado], components: [], ephemeral: true})
                    }
                    if(i.customId === "sineveryone"){ 
                        channel.send({embeds: [embed]})
                        modal.editReply({embeds: [enviado], components: [], ephemeral: true})
                    }
                })
        
                collector.on("end", i => {
                    modal.editReply({embeds: [
                        new MessageEmbed()
                        .setTitle("Error 💔")
                        .setDescription("Al parecer no seleccionaste una opción.")
                        .setColor("RED")            
                    ]})
                })
            }
        })
        
    }
}

module.exports = command;