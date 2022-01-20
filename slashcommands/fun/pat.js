const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { pat } = require('../../helpers/gifs.js');

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {
    category: "Diversión",


    data: new SlashCommandBuilder()
    .setName("pat")
    .setDescription("Acaricia a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario al que acariciaras.").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
        let mention = interaction.options.getUser('usuario'); //-- define mention
        if(mention.id === interaction.user.id || mention.bot) return await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(':x: Error')
                .setDescription('menciona a un usuario valido, que no seas tu y no sea un bot!')
                .setColor('RED')
            ],
            ephemeral: true
        });
        await interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(`${interaction.user.username} a acariciado a ${mention.username}`)
            .setImage(pat[Math.floor(Math.random() * pat.length)])
            .setColor('RANDOM')
            .setFooter(`${interaction.user.username}`, `${interaction.user.avatarURL({dynamic: true})}`)
            .setTimestamp()
        ]
         });
    }
}

module.exports = command;