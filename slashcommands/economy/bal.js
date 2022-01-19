const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/economy-model.js");
const schemaBank = require("../../models/bank-model.js");
const bigInt = require("big-integer");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Muestra tu balance en la economía del servidor.")
    .addUserOption(o =>
        o.setName('usuario')
        .setDescription('Usuario para ver su balance.')
        .setRequired(false)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(_, interaction){
        const mention = interaction.options.getUser('usuario') ? interaction.guild.members.cache.get(interaction.options.getUser('usuario').id) : interaction.member;
        if(mention === mention.user.bot) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("Los bots no son parte de la economía.").setColor("RED")], ephemeral: true})
        if(mention === interaction.user.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("si quieres mirar tu propio balance no menciones a nadie.").setColor("RED")], ephemeral: true})

        let resultsWallet = await schema.findOne({
            guildid: interaction.guild.id, 
            userid: mention.user.id
        });
        let resultsBank = await schemaBank.findOne({
            guildid: interaction.guild.id, 
            userid: mention.user.id
        });

        if(!resultsBank) resultsBank = {};
        if(!resultsWallet) resultsWallet = {};
        if(!resultsBank.money) resultsBank.money = "0";
        if(!resultsWallet.money) resultsWallet.money = "0";

        const embedSuccess = new MessageEmbed()
        .setTitle("Balance de "+mention.user.username)
        .setThumbnail(mention.user.displayAvatarURL({format: "png", dynamic: true}))
        .addField("Cartera", `\`${Intl.NumberFormat().format(bigInt(resultsWallet.money))}$\``, false)
        .addField("Banco", `\`${Intl.NumberFormat().format(bigInt(resultsBank.money))}$\``, false)
        .addField("Total", `\`${Intl.NumberFormat().format(bigInt(parseInt(resultsBank.money)) + bigInt(parseInt(resultsWallet.money)))}$\``, false)
        .setColor("#00FFFF")
        .setTimestamp()
        .setFooter("balance Sophia bot, Economy.");
        await interaction.reply({embeds: [embedSuccess]});
    }
}

module.exports = command;