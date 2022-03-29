const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    category: "Información",


    data: new SlashCommandBuilder()
    .setName("termsofservice")
    .setDescription("Lee, analiza, y acepta nuestros términos y condiciónes."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const tos = 
        "Sophia, es un bot multifuncional que esta preparado y adaptado para almacenar diversas informaciones las cuales pueden ser usadas para ejercer un mejor funcionamiento dentro de tu servidor de la plataforma Discord." + "\n\n" +
        "Sophia fue creada con la misión de ayudarte a moderar tu servidor a través de diversas funciones programadas por los creadores de la misma." + "\n\n" +
        "Sophia company, está situada en Chile bajo su representante Paulo Rivas. Aclaramos que no es una marca registrada, pero a la vez cumplimos con los requisitos de una, cada acto hecho bajo el nombre de Sophia no nos representa y es suma responsabilidad de quien lo emite." + "\n\n" +
        "Actualmente Sophia esta siendo manejada por 4 personas las cuales día a día procuran mantener el orden y el lineamiento intacto de los términos y servicios de Discord." + "\n\n" +
        "Dentro de nuestras bases de datos almacenamos información tales como:" + "\n" +
        "**-    ID de usuario**" + "\n" +
        "**-    ID canal**" + "\n" +
        "**-    ID mensaje**" + "\n" +
        "**-    Contenido de mensajes**" + "\n\n" +
        "Estas mencionadas anteriormente las reunimos para poder realizar de manera eficaz nuestro apartado de moderación y diversión, por el lado de moderación esta información se utiliza para los sistemas de mensajes eliminados, mensajes editados, en cambio, por el lado de diversión esta información es manipulada para obtener tus estadísticas en comando tales como:" + "\n" +
        "**-    quiz**" + "\n" +
        "**-    quizrecords**" + "\n\n" +
        "A la vez aclaramos que usamos un package llamado **Distube** el cuál nos hace posible tener el sistema de música, queremos dejar en claro y demostrado que este servicio no será utilizado con fines de lucro sobre tal, nos menguamos terminar nuestros servicios por la utilización del mismo, volvemos a recalcar que **NO** estamos interesados en entregar un servicio paga a través de este paquete de recursos, buscamos la comodidad y disposición de la gente para así poder funcionar con un buen ritmo al pie de la música junto a quienes gozan de nuestros servicios."

        const embed = new MessageEmbed()
        .setTitle("Términos de privacidad y condiciones.")
        .setDescription("Elije una de las opciónes.")
        .setFooter({text: "Sophia company 2021-2022 © Todos los derechos reservados."})
        .setColor("#00FFFF")
        .setThumbnail(client.user.displayAvatarURL({dynamic: true, size: 512}))

        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setLabel("web")
            .setStyle("DANGER")
            .setCustomId("web"),

            new MessageButton()
            .setLabel("embed")
            .setStyle("DANGER")
            .setCustomId("text")
        )

        await interaction.reply({embeds: [embed], components: [row]})
        const filtro = i => i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({filter: filtro, time: 180000})

        collector.on("collect", async i => {
            await i.deferUpdate();

            if(i.customId === "web"){
                interaction.editReply({ embeds: [embed.setDescription("[TERMS OF SERVICE](https://sophia-bot.com/termsofservices)")] })
            }

            if(i.customId === "text"){
                interaction.editReply({embeds: [embed.setDescription("Okay 🧡,\nprocedo a borrar el mensaje en 30 segundos.")], components: []}).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 30000)
                })
                interaction.followUp({embeds: [embed.setDescription(tos)], ephemeral: true})
            }
        })
    }
}

module.exports = command;