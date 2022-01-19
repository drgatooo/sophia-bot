const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const antilinksModel = require("../../models/antilinks");

/**
 * @type {import('../../types/typesctructure').Command}
 */

const command = {
  name: "antilinks",
  aliases: ["nolinks"],
  description: "Prende o Apaga el antilinks",
  userPerms: ["ADMINISTRATOR"],
  botPerms: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
  category: "Configuration",
  premium: false,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {string[]} args
   */

  run: async (client, message, args) => {
    
    
        
  },
};

module.exports = command;
