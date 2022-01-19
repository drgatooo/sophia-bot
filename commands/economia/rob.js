const { Client, Message, MessageEmbed } = require('discord.js')
const add = require('../../helpers/add-money.js');
const remove = require('../../helpers/remove-money.js');
const schema = require('../../models/economy-model.js');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'rob',
    aliases: ['robar'],
    description: 'Roba a un usuario si tiene dinero en mano.',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Economy',
    premium: false,
    uso: `<@usuario>`, 

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        const err = new MessageEmbed().setTitle(":x: Error").setColor("RED")

        const mention = message.mentions.members.first();
        if(!mention) {
            err.setDescription("ℹ Debes mencionar a un usuario valido!")
            return message.reply({embeds: [err]})
        }
        if(mention.user.bot) {
            err.setDescription("ℹ No puedes robar a un bot.")
            return message.reply({embeds: [err]})
        }

        const results = await schema.findOne({
            guildid: message.guild.id, 
            userid: mention.user.id
        });

        if(!results || results.money < 1) {
            err.setDescription("ℹ Este usuario no tiene dinero en su cartera.")
            return message.reply({embeds: [err]})
        }

        const randomMoney = Math.floor(Math.random() * results.money) +1;
        add(message.guild.id, message.author.id, randomMoney);
        remove(message.guild.id, mention.user.id, randomMoney);
        
        const embedSuccess = new MessageEmbed()
            .setDescription(`**${message.author.username}** ha robado \`${randomMoney}$\` ha **${mention.user.username}**`)
            .setColor('RED')
            .setFooter(`${mention.user.username} asegurate de siempre guardarlo en el banco...`)
            .setTimestamp();
        message.reply({embeds: [embedSuccess]});

    }
}

module.exports = command


                