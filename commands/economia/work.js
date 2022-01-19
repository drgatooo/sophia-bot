const { Client, Message, MessageEmbed } = require('discord.js')
const add = require("../../helpers/add-money.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'work',
    aliases: ['job', 'trabajar', 'trabajo'],
    description: 'Trabaja para ganar dinero y comprar productos',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    cooldown: 600,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

    const randomMoney = Math.floor(Math.random() * (151 - 80) + 80);

    add(interaction.guild.id, interaction.user.id, randomMoney);

    const works = ["Carpintero", "Mecánico", "Lavandero", "Lechero", "Frutero", "Artesano", "Pescador", "Escultor"];
    const randomWork = works[Math.floor(Math.random() * works.length)];
    const embedSuccess = new MessageEmbed()
    .setDescription(`**${message.author.username}** ha trabajado de **${randomWork}** y ha ganado \`${randomMoney}$\``)
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter("Suerte!");
    message.reply({embeds: [embedSuccess]});

    }
}

module.exports = command


                