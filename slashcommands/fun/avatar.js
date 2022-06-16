const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js-light");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Diversión",


    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Mira tu avatar o el de un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a mirar").setRequired(false)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const User = interaction.options.getUser("usuario") || interaction.user

        const pregunta = new MessageEmbed()
        .setTitle("Una preguntita... <a:cora:925477856711180379>")
        .setDescription("¿ Quieres que te lo muestre aqui, o te lo mando a tu MD ?")
        .setColor("#00FFFF")
        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setLabel("MD")
            .setStyle("SUCCESS")
            .setCustomId("md"),

            new MessageButton()
            .setLabel("Aquí")
            .setStyle("SUCCESS")
            .setCustomId("aqui")
        )

        await interaction.reply({embeds: [pregunta], components: [row], ephemeral: true})
        const filtro = i => i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({filter: filtro, time: 15000})

        collector.on("collect", async i => {
            i.deferUpdate()

            if(i.customId === "md"){
                interaction.user.send({embeds: [
                new MessageEmbed() 
                .setTitle('Avatar de ' + User.username)
                .setColor("#00FFFF")
                .setFooter({text: `Avatar solicitado por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                .setImage(User.displayAvatarURL({size:4096, dynamic:true, format: 'png'}))
                    ]
                }).then(() => { 
                    interaction.followUp({embeds: [
                        new MessageEmbed()
                        .setTitle("✅ Listo")
                        .setDescription("Enviado")
                        .setColor("GREEN")
                    ],
                    ephemeral: true
                })
            }).catch(() => { 
                    interaction.followUp({embeds: [
                        new MessageEmbed()
                        .setTitle(":x: Error")
                        .setDescription("Abre MD")
                        .setColor("RED")
                    ],
                    ephemeral: true
                })
            })
            }
            if(i.customId === "aqui"){
                interaction.channel.send({embeds: [
                    new MessageEmbed() 
                    .setTitle('Avatar de ' + User.username)
                    .setColor("#00FFFF")
                    .setFooter({text: `Avatar solicitado por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
                    .setImage(User.displayAvatarURL({size:4096, dynamic:true, format: 'png'}))
                        ]
                    })
                interaction.editReply({embeds: [
                    new MessageEmbed()
                    .setTitle("Listo ✅")
                    .setDescription("Avatar enviado al canal.")
                    .setColor("GREEN")
                        ],
                        components: []
                    })   
            }
        })

    }
}

module.exports = command;