const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    category: "Utilidad",
    botPerms: "ADMINISTRATOR",
    data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invita el bot a tu servidor."),

    run(client, interaction){

            const gracias = new MessageEmbed()
            .setTitle("Gracias por invitarme!")
            .setDescription(`Gracias ${interaction.user} agradezco la \n oportunidad de estar en tu servidor :heart:\n\Nos vemos en el!`)
            .setTimestamp(new Date())
            .setImage(client.user.displayAvatarURL({dynamic: true, size: 256}))
            .setColor("#00FFFF")

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel("Invitación")
                .setStyle("LINK")
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`)
            )
    
            interaction.reply({embeds: [gracias], components: [row] })

    }
}