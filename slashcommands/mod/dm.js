const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals')

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["MANAGE_MESSAGES"],
    botPerms: ["MANAGE_MESSAGES"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Envía un mensaje a un usuario a través de Sophia")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a e|nviar mensaje").setRequired(true)),
    //.addStringOption(o => o.setName("mensaje").setDescription("QUe dirá el mensaje").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options;

        const usuario = args.getUser("usuario")

        if(usuario.bot) interaction.reply({embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('No puedo enviar un mensaje a un bot!').setColor('RED')], ephemeral: true});

        if(usuario.id === interaction.user.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('No puedes enviarte mensaje a ti mismo/a!').setColor('RED')], ephemeral: true});
        
        if(usuario.id === client.user.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('No puedo enviarme un mensaje a mi misma.').setColor('RED')], ephemeral: true});

        const textoComponent = new TextInputComponent()
        .setCustomId('dm_texto')
        .setLabel('Mensaje')
        .setMinLength(1)
        .setMaxLength(1024)
        .setStyle('LONG')
        .setRequired(true)
        .setPlaceholder('Escribe aquí el Mensaje que quieres enviar al Usuario.')

        const modal = new Modal()
        .setTitle('DM')
        .setCustomId('dm')
        .addComponents(textoComponent)

        showModal(modal, { client: client, interaction: interaction });

        client.on('modalSubmit', async(modal) => {
            if(modal.customId === 'dm'){

                await modal.deferReply({ ephemeral: true })
                const mensaje = modal.getTextInputValue('dm_texto')

                const embed = new MessageEmbed()
                .setTitle("💝 Mensaje Privado!")
                .setDescription(`He enviado un mensaje a ${usuario} diciendo lo siguiente.`)
                .addField("Mensaje:", mensaje, true)
                .setColor("GREEN")

                usuario.send({ content: mensaje }).then(() => {
                    modal.followUp({ embeds: [embed], ephemeral: true });
                }).catch(() => {
                    modal.followUp({
                      embeds: [
                        new MessageEmbed()
                          .setTitle("💔 Mensaje No Enviado.")
                          .setDescription("Vaya, al parecer el usuario tiene los mensajes bloqueados.")
                          .setColor("RED"),
                      ],
                      ephemeral: true,
                    });
                });
                
            }
        })

    }
}

module.exports = command;