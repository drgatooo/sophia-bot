const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js-light");

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
    .addStringOption(o => o.setName("descripcion").setDescription("Descripción del embed.").setRequired(true))
    .addStringOption(o => o.setName("titulo").setDescription("Titulo del embed.").setRequired(false))
    .addStringOption(o => o.setName("footer").setDescription("Footer del embed.").setRequired(false))
    .addStringOption(o => o.setName("imagen").setDescription("Imagen que llevará el embed.").setRequired(false))
    .addChannelOption(o => o.setName("canal").setDescription("Canal a enviar el embed.").setRequired(false)),

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
            const canal = args.getChannel("canal") || interaction.channel
            const title = args.getString("titulo")
            const description = args.getString("descripcion")
            const footer = args.getString("footer")
            const imagen = args.getString("imagen")
        
            const embed = new MessageEmbed()
                .setColor("#00FFFF")
                .setDescription(`${description}`)
            if(title){
                embed.setTitle(title)
            }
            if(footer){
                embed.setFooter({text: footer, iconURL: interaction.guild.iconURL({dynamic: true})})
            }
            if(imagen){
                let linkRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g);
                if((!imagen.match(linkRegex))) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("Ingresa una url de imagen valida.").setColor("RED")], ephemeral: true})
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
        
                await interaction.reply({embeds: [pregunta], components: [row], ephemeral: true})
                const filtro = i => i.user.id === interaction.user.id
                const collector = interaction.channel.createMessageComponentCollector({filter: filtro, time: 15000})
        
                collector.on("collect", async i => {
                    i.deferUpdate();
        
                    if(i.customId === "everyone"){
                        canal.send({embeds: [embed]})
                        canal.send("@everyone").then(msg => {
                            setTimeout(() => {
                                msg.delete()
                            }, 2000)
                        })
                        interaction.editReply({embeds: [enviado], components: [], ephemeral: true})
                    }
                    if(i.customId === "sineveryone"){ 
                        canal.send({embeds: [embed]})
                        interaction.editReply({embeds: [enviado], components: [], ephemeral: true})
                    }
                })
        
                collector.on("end", i => {
                    interaction.editReply({embeds: [], components: []})
                })
    }
}

module.exports = command;