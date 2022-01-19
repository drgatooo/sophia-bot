const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const gifs = require('../../helpers/gifs.js');

module.exports = {
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("highfive")
    .setDescription("Choca los 5 con alguien")
    .addUserOption(o =>
        o.setName("usuario")
        .setDescription('usuario con quien vas a hacer el highfive')
        .setRequired(true)),

    async run(client, interaction){
        const args = interaction.options;
        const mention = args.getUser("usuario");
        const error = new MessageEmbed()
        .setTitle(":x: Error")
        .setColor("DARK_RED");
        
        if(mention.id === interaction.user.id || mention.bot) return interaction.reply({embeds: [error.setDescription('Menciona a alguien que no seas tú, ni sea un bot')], ephemeral: true});

        interaction.reply({ embeds: [
            new MessageEmbed()
            .setTitle(interaction.user.username+' y '+mention.username+" hicieron un highfive")
            .setImage(gifs.highfive[Math.floor(Math.random() * gifs.highfive.length)])
            .setColor('RANDOM')
            .setTimestamp()
        ]});
    }
}