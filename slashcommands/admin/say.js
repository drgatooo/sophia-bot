const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");

module.exports = {
    userPerms: ["ADMINISTRATOR"],
    botPerms: ["ADMINISTRATOR"],
    category: "Administración", 
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Envia un mensaje a traves del bot.")
    .addStringOption(o => o.setName("texto").setDescription("Texto que enviará el bot.").setRequired(true)),

    async run(client, interaction){

                const text = interaction.options.getString("texto");

                const enviado = new MessageEmbed()
                .setTitle("<a:TPato_Check:911378912775397436> Enviado.")
                .setDescription("Tu mensaje fue enviado!")
                .setColor("GREEN")

                await interaction.channel.send(`${text}`)
                interaction.reply({embeds: [enviado], ephemeral: true})
                
    }
}