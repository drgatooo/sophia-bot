const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/economy-model.js");
const schemaBank = require("../../models/bank-model.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("dep")
    .setDescription("Deposita dinero en tu banco.")
    .addStringOption(o => o.setName("cantidad").setDescription("cantidad a depositar").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const err = new MessageEmbed()
    .setTitle(":x: Error").setColor("RED")
    const args = interaction.options

    const resultsWallet = await schema.findOne({
        guildid: interaction.guild.id, 
        userid: interaction.user.id
    });
    const resultsBank = await schemaBank.findOne({
        guildid: interaction.guild.id, 
        userid: interaction.user.id
    });
    
    if(args.getString("cantidad") !== "all" && isNaN(args.getString("cantidad")) && !Number.isInteger(args.getString("cantidad"))) {
        err.setDescription("Debes poner un numero!")
        return interaction.reply({embeds: [err], ephemeral: true });
    }
    if(!resultsWallet || resultsWallet.money === 0) { 
        err.setDescription("No tienes dinero para depositar!")
        return interaction.reply({embeds: [err], ephemeral: true });
    }
    if(resultsWallet.money < parseInt(args.getString("cantidad"))) { 
        err.setDescription("No tienes ese dinero!")
        return interaction.reply({embeds: [err], ephemeral: true});
    }

    if(args.getString("cantidad") == "all") args.getString("cantidad") = resultsWallet.money;

    if(args.getString("cantidad") !== "all" && parseInt(args.getString("cantidad")) < 1) { 
        err.setDescription("Debes poner un numero mayor a 0!")
        return interaction.reply({embeds: [err], ephemeral: true});
    }

    if(resultsBank) {
        const addBank = parseInt(resultsBank.money) + parseInt(args.getString("cantidad"));
        const rmvWallet = parseInt(resultsWallet.money) - parseInt(args.getString("cantidad"));

        await schemaBank.updateOne({
            guildid: interaction.guild.id, 
            userid: interaction.user.id
        }, {
            money: addBank
        });
        await schema.updateOne({
            guildid: interaction.guild.id, 
            userid: interaction.user.id
        }, {
            money: rmvWallet
        });

    } else {
        const rmvEco = parseInt(resultsWallet.money) - parseInt(args.getString("cantidad"));
        await schema.updateOne({
            guildid: interaction.guild.id, 
            userid: interaction.user.id
        }, {
            money: rmvEco
        });

        let newBank = new schemaBank({
            guildid: interaction.guild.id,
            userid: interaction.user.id,
            money: args.getString("cantidad")
          });

          await newBank.save();

    }

    const embedSuccess = new MessageEmbed()
    .setDescription(`**${interaction.user.username}** has depositado \`${args.getString("cantidad")}$\``)
    .setColor("GREEN")
    .setTimestamp()
    .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}`});
    interaction.reply({embeds: [embedSuccess]});

    }
}

module.exports = command;