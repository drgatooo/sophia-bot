const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/economy-model.js");
const schemaBank = require("../../models/bank-model.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("with")
    .setDescription("Retira dinero de tu banco!")
    .addStringOption(o => o.setName("cantidad").setDescription("Cantidad a retirar!").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const resultsWallet = await schema.findOne({
            guildid: interaction.guild.id, 
            userid: interaction.user.id
        });
        const resultsBank = await schemaBank.findOne({
            guildid: interaction.guild.id, 
            userid: interaction.user.id
        });

        const err = new MessageEmbed()
        .setTitle(":x: Error").setColor("RED")

        if(interaction.options.getString("cantidad") !== "all" && isNaN(interaction.options.getString("cantidad")) && !Number.isInteger(interaction.options.getString("cantidad"))) {
            err.setDescription("Debes poner un numero valido!")
            return interaction.reply({embeds: [err], ephemeral: true})
        }
        if(interaction.options.getString("cantidad") == 'all') interaction.options.getString("cantidad") = resultsBank.money;
        if(interaction.options.getString("cantidad") !== "all" && parseInt(interaction.options.getString("cantidad")) < 1) {
            err.setDescription("Debes poner un numero mayor a 0!")
            return interaction.reply({embeds: [err], ephemeral: true})
        }
        if(!resultsBank || resultsBank.money === 0) {
            err.setDescription("No tienes dinero para retirar!")
            return interaction.reply({embeds: [err], ephemeral: true})
        }
        if(resultsBank.money < parseInt(interaction.options.getString("cantidad"))) {
            err.setDescription("No tienes suficiente dinero para retirar!")
            return interaction.reply({embeds: [err], ephemeral: true})
        }

        if(resultsBank) {
            if(resultsWallet) {
                let addEco = parseInt(interaction.options.getString("cantidad")) + parseInt(resultsWallet.money);
                let rmvBank = parseInt(resultsBank.money) - parseInt(interaction.options.getString("cantidad"));
                await schema.updateOne({
                    guildid: interaction.guild.id, 
                    userid: interaction.user.id
                }, {
                    money: addEco
                });
                await schemaBank.updateOne({
                    guildid: interaction.guild.id, 
                    userid: interaction.user.id
                }, {
                    money: rmvBank
                });
                const embed = new MessageEmbed()
                .setTitle("✅ Dinero retirado!")
                .setDescription(`**${interaction.user.username}** ha retirado \`${interaction.options.getString("cantidad")}$\` del banco`)
                .setColor("GREEN")
                interaction.reply({embeds: [embed]});
            }
        } else if(!resultsBank || resultsBank === 0){
            const embed2 = new MessageEmbed()
            .setTitle(":x: Oh no!")
            .setDescription("No tienes dinero suficiente")
            .setColor("RED")
            return interaction.reply({embeds: [embed2], ephemeral: true});
        }

    }
}

module.exports = command;