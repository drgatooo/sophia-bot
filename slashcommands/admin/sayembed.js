const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    userPerms: ["MANAGE_MESSAGES"],
    botPerms: ["ADMINISTRATOR"],
    category: "Administración", 
    data: new SlashCommandBuilder()
    .setName("sayembed")
    .setDescription("Envia un mensaje embed con titulo como nuevo anuncio.")
    .addStringOption(o => o.setName("mensaje").setDescription("Texto a mostrar en el embed").setRequired(true)),

    async run(client, interaction){

        const args = interaction.options
        const texto = args.getString("mensaje")

        const embed = new MessageEmbed()
        .setTitle(`Nuevo anuncio`)
        .setDescription(`${texto}`)
        .setColor("WHITE")
        .setTimestamp(new Date())

        const enviado = new MessageEmbed()
        .setTitle("<a:TPato_Check:911378912775397436> Enviado.")
        .setDescription("Tu anuncio fue enviado!")
        .setColor("GREEN")

        interaction.reply({embeds: [enviado], ephemeral: true})
        interaction.channel.send({embeds: [embed]})
    }
}