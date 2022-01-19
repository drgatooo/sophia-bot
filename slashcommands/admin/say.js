const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    userPerms: ["ADMINISTRATOR"],
    botPerms: ["ADMINISTRATOR"],
    category: "Administración", 
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Envia un mensaje a traves del bot.")
    .addStringOption(o => o.setName("texto").setDescription("Texto a mostrar en el mensaje").setRequired(true)),

    async run(client, interaction){
        
        const text = interaction.options.getString("texto")

        const enviado = new MessageEmbed()
        .setTitle("<a:TPato_Check:911378912775397436> Enviado.")
        .setDescription("Tu mensaje fue enviado!")
        .setColor("GREEN")

        interaction.reply({embeds: [enviado], ephemeral: true})
        interaction.channel.send(`${text}`)
    }
}