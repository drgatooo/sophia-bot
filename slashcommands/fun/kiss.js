const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const nekoClient = require('nekos.life');
const { sfw } = new nekoClient();

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Diversión",


    data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Besa a alguien...")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a besar").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const user = interaction.options.getUser("usuario")
        if(user === interaction.user.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x:").setDescription("No te puedes auto besar.").setColor("RED")], ephemeral: true})
        if(user.bot) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x:").setDescription("No puedes besar a un bot.").setColor("RED")], ephemeral: true})
   
        const { url } = await sfw.kiss() 
            const embed = new MessageEmbed()
            .setTitle("Beso :heart:")
            .setDescription(`${interaction.user.username} le ha dado un beso a ${user.username}`)
            .setImage(`${url}`)
            .setFooter({text: "Disfrutalo"})
            .setColor("LUMINOUS_VIVID_PINK")

            interaction.reply({embeds: [embed]})
   
    }
}

module.exports = command;