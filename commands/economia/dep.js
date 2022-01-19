const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/economy-model.js");
const schemaBank = require("../../models/bank-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'dep',
    aliases: ['depositar', 'deposit'],
    description: 'Deposita dinero en tu banco!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: `<cantidad | all>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
    
    const err = new MessageEmbed()
    .setTitle(":x: Error").setColor("RED")

    const resultsWallet = await schema.findOne({
        guildid: message.guild.id, 
        userid: message.author.id
    });
    const resultsBank = await schemaBank.findOne({
        guildid: message.guild.id, 
        userid: message.author.id
    });
    
    if(args[0] !== "all" && isNaN(args[0])) {
        err.setDescription("Debes poner un numero!")
        return message.reply({embeds: [err]});
    }
    if(!resultsWallet || resultsWallet.money === 0) { 
        err.setDescription("No tienes dinero para depositar!")
        return message.reply({embeds: [err]});
    }
    if(resultsWallet.money < parseInt(args[0])) { 
        err.setDescription("No tienes ese dinero!")
        return message.reply({embeds: [err]});
    }

    if(args[0] == "all") args[0] = resultsWallet.money;

    if(args[0] !== "all" && parseInt(args[0]) < 1) { 
        err.setDescription("Debes poner un numero mayor a 0!")
        return message.reply({embeds: [err]});
    }

    if(resultsBank) {
        const addBank = parseInt(resultsBank.money) + parseInt(args[0]);
        const rmvWallet = parseInt(resultsWallet.money) - parseInt(args[0]);

        await schemaBank.updateOne({
            guildid: message.guild.id, 
            userid: message.author.id
        }, {
            money: addBank
        });
        await schema.updateOne({
            guildid: message.guild.id, 
            userid: message.author.id
        }, {
            money: rmvWallet
        });

    } else {
        const rmvEco = parseInt(resultsWallet.money) - parseInt(args[0]);
        await schema.updateOne({
            guildid: message.guild.id, 
            userid: message.author.id
        }, {
            money: rmvEco
        });

        let newBank = new schemaBank({
            guildid: message.guild.id,
            userid: message.author.id,
            money: args[0]
          });

          await newBank.save();

    }

    const embedSuccess = new MessageEmbed()
    .setDescription(`**${message.author.username}** has depositado \`${args[0]}$\``)
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(`${message.author.username}`, `${message.author.avatarURL()}`);
    message.reply({embeds: [embedSuccess]});

    }
}

module.exports = command


                