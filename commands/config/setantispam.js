const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const antispamModel = require("../../models/antispam");

/**
 * @type {import('../../types/typesctructure').Command}
 */

const command = {
  name: "antispam",
  aliases: ["nospam"],
  description: "Apaga o prende el Anti-Spam",
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
    const anti = await antispamModel.findOne({ ServerID: message.guild.id });

    spamEmoji = "🚫";
    checked = "<:Check:886685653746720788>";
    unchecked = "<:notcheck:886685696100818994>";

    const exit = new MessageEmbed()
    .setTitle('⬅ Saliendo')
    .setColor('WHITE')
    .setDescription('Este mensaje será eliminado.')

    const offTime = new MessageEmbed()
    .setTitle('⏳ Error')
    .setColor('ORANGE')
    .setDescription('Error de tiempo, usa el comando nuevamente!')

    if (!anti) {
      var response = new MessageEmbed()
        .setTitle(`${spamEmoji} Anti-Spam`)
        .setColor("BLURPLE")
        .setDescription(`El Anti-Spam ahora está: \n${unchecked} **Desactivado**`);

      var row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("YesActivate")
          .setLabel("Activalo")
          .setStyle("SUCCESS"),

        new MessageButton()
          .setCustomId("No")
          .setLabel("Cancelalo")
          .setStyle("DANGER")
      );

      var final = new MessageEmbed()
        .setTitle("✅ Exito")
        .setColor("GREEN")
        .setDescription(`El Anti-Spam ahora está: \n ${checked} **Activado**`);

    } else {
      var response = new MessageEmbed()
        .setTitle(`${spamEmoji} Anti-Spam`)
        .setColor("BLURPLE")
        .setDescription(`El Anti-Spam ahora está: \n ${checked} **Activado**`);

      var row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("YesDisactivate")
          .setLabel("Desactivalo")
          .setStyle("SUCCESS"),

        new MessageButton()
          .setCustomId("No")
          .setLabel("Cancelalo")
          .setStyle("DANGER")
      );

      var final = new MessageEmbed()
        .setTitle("✅ Exito")
        .setColor("GREEN")
        .setDescription(`El Anti-Spam ahora está: \n${unchecked} **Desactivado**`);
    }

    const m = await message.channel.send({
      embeds: [response],
      components: [row],
    });

    let iFilter = (i) => i.user.id === message.author.id;

    const collector = m.createMessageComponentCollector({
      filter: iFilter,
      time: 60000,
      errors:['time']
    })

    collector.on("collect", async (i) => {
      if (i.customId === "YesActivate") {
        await i.deferUpdate();
        i.editReply({ embeds: [final], components: []});
        let aM = new antispamModel({
            ServerID: message.guild.id
        })
        await aM.save()
        setTimeout(() => m.delete(), 5000)
      }

      if (i.customId === "YesDisactivate") {
          await i.deferUpdate();
          i.editReply({ embeds: [final], components: []})
          await antispamModel.findOneAndDelete({ServerID: message.guild.id})
          setTimeout(() => m.delete(), 5000)
      }

      if (i.customId === "No"){
        await i.deferUpdate();
        i.editReply({ embeds: [exit], components: []})
        setTimeout(() => m.delete(), 5000)
      }
    })

    collector.on("end", (_collector, reason) => {
            if (reason === "time"){
                m.edit({embeds: [offTime], components: []})
                setTimeout(() => m.delete(), 5000)
            }
        })
    
        
  },
};

module.exports = command;
