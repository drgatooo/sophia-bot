const { Client, Message, MessageEmbed } = require("discord.js");

/**
 * @type {import('../../types/typesctructure').Command}
 */

const command = {
  name: "say",
  aliases: [],
  description: "El bot repite lo que vos quieras",
  userPerms: ["ADMINISTRATOR"],
  botPerms: ["SEND_MESSAGES"],
  category: "Administration",
  premium: false,
  uso: `say (canal opcional) <texto>`,

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
      text = args.slice(1).join(" "); //mi pregunta es pa que arreglas esto si esto se eliminara, pasaremos todo a 
    }

    let notext = new MessageEmbed()
      .setTitle("❌ Error")
      .setColor("RED")
      .setDescription("Inserta un texto!");

    if (!channel) channel = message.channel;

    if (!text) return channel.send({ embeds: [notext] });
    
     channel.send(text);

  },
};

module.exports = command;