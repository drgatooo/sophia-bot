const { Client, Message, MessageEmbed } = require("discord.js");


/**
 * @type {import('../../types/typesctructure').Command}
 */

const command = {
  name: "sayembed",
  aliases: [],
  description: "El bot repite lo que vos quieras",
  userPerms: ["ADMINISTRATOR"],
  botPerms: ["SEND_MESSAGES"],
  category: "Administration",
  premium: false,
  uso: `sayembed (canal opcional) <texto>`,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {string[]} args
   */

  run: async (client, message, args) => {
    message.delete();
    let channel = message.mentions.channels.first();
    let text;

    if (channel) {
      text = args.slice(1).join(" ");
    } else {
      text = args.slice(0).join(" ");
    }

    let notext = new MessageEmbed()
      .setTitle("❌ Error")
      .setColor("RED")
      .setDescription("Inserta un texto!");

    if (!channel) channel = message.channel;

    if (!text) return channel.send({ embeds: [notext] });

    let sayEmbed = new MessageEmbed()
      .setTitle(`🔔 Nuevo anuncio de ${message.author.tag}`)
      .setDescription(text)
      .setColor("WHITE")

    channel.send({ embeds: [sayEmbed] });

  },
};

module.exports = command;
