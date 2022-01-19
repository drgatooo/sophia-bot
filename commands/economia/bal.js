const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/economy-model.js");
const schemaBank = require("../../models/bank-model.js");

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'bal',
    aliases: ['balance'],
    description: 'Mira tu economia o la de un usuario en el servidor.',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Economy',
    premium: false,
    uso: `<@usuario (opcional)>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        const mention = message.mentions.members.first() || message.member;
        let resultsWallet = await schema.findOne({
            guildid: message.guild.id, 
            userid: mention.user.id
        });
        let resultsBank = await schemaBank.findOne({
            guildid: message.guild.id, 
            userid: mention.user.id
        });

        if(!resultsBank) resultsBank = {};
        if(!resultsWallet) resultsWallet = {};
        if(!resultsBank.money) resultsBank.money = "0";
        if(!resultsWallet.money) resultsWallet.money = "0";

        const embedSuccess = new MessageEmbed()
        .setTitle("Balance de "+mention.user.username)
        .setThumbnail(mention.user.displayAvatarURL({format: "png", dynamic: true}))
        .addField("Cartera", `\`${resultsWallet.money.toString()}$\``, false)
        .addField("Banco", `\`${resultsBank.money.toString()}$\``, false)
        .addField("Total", `\`${parseInt(resultsBank.money) + parseInt(resultsWallet.money)}$\``, false)
        .setColor("#00FFFF")
        .setTimestamp()
        .setFooter("balance Sophia bot, Economy.");
        message.reply({embeds: [embedSuccess]});

    }
}

module.exports = command


                