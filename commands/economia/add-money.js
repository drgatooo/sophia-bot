const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/economy-model.js");
const schemaBank = require("../../models/bank-model.js");
const bigInt = require('big-integer');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'add-money',
    aliases: ['addmoney'],
    description: 'Agrega dinero a un usuario.',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: `<@usuario> <bank (opcional)> <cantidad>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
    
    const err = new MessageEmbed()
    .setTitle(":x: Error")
    .setColor("RED")

    const exi = new MessageEmbed()
    .setTitle("🏦 Transaccion exitosa")
    .setColor("GREEN")

    const mention = message.mentions.members.first();

    if(!mention) {
        err.setDescription("ℹ Debes mencionar a alguien!")
        return message.reply({embeds: [err]});
    }

    if(isNaN(args[1]) && args[1] !== "bank") {
        err.setDescription("ℹ Debes poner un numero valido!")
        return message.reply({embeds: [err]});
    }
    if(args[1] !== "bank" && parseInt(args[1]) < 1) {
        err.setDescription("ℹ Debes poner un numero mayor a 0!")
        return message.reply({embeds: [err]});
    }

    if(args[1] === "bank"){
        const resultsBank = await schemaBank.findOne({
            guildid: message.guild.id, 
            userid: mention.user.id
    });

        if(resultsBank) {
            const addBank = bigInt(parseInt(resultsBank.money)).plus(parseInt(args[2]));
            console.log(bigInt(parseInt(args[2])));
            await schemaBank.updateOne({
                guildid: message.guild.id, 
                userid: mention.user.id
            }, {
                money: addBank
            });
            exi.setDescription(`:atm: Se le cargaron \`${args[2]}$\` en el banco a <@${mention.user.id}>`)
            message.reply({embeds: [exi]});
        } else {
            const newBank = new schemaBank({
                guildid: message.guild.id,
                userid: mention.user.id,
                money: bigInt(parseInt(args[2]))
            });
            await newBank.save();
            exi.setDescription(`💵 Le has dado \`${args[2]}$\` en efectivo a <@${mention.user.id}>`)
            message.reply({embeds: [exi]});
        }
        return;
    }

    const resultsWallet = await schema.findOne({guildid: message.guild.id, userid: mention.user.id});
    
    if(resultsWallet) {
        const addWallet = parseInt(resultsWallet.money) + parseInt(args[1]);
        await resultsWallet.updateOne({
            guildid: message.guild.id, 
            userid: mention.user.id, 
            money: addWallet
        });
        exi.setDescription(`💵 Le has dado \`${args[1]}$\` en efectivo a <@${mention.user.id}>`)
        message.reply({embeds: [exi]});
    } else {
        const newWallet = new schema({
            guildid: message.guild.id,
            userid: mention.user.id,
            money: parseInt(args[1])
        });
        await newWallet.save();
        exi.setDescription(`💵 Le has dado \`${args[1]}$\` en efectivo a <@${mention.user.id}>`)
        message.reply({embeds: [exi]});
    }

    }
}

module.exports = command


                