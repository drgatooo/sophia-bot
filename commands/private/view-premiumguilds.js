const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const premiumGuild = require("../../models/premiumGuild");

/**
 * @type {import('../../types/typesctructure').Command}
 */

const command = {
  name: "viewpremium",
  aliases: ["checkpremium", "ispremium", "isp"],
  description: "check if the specified guids is premium",
  userPerms: ["SEND_MESSAGES"],
  botPerms: ["SEND_MESSAGES"],
  category: "Owner",
  premium: false,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {string[]} args
   */

  run: async (client, message, args) => {
    let server = args[0];

    // Data-base

    const premium = await premiumGuild.findOne({ ServerID: server });

    // emojis

    checked = "<:Check:886685653746720788>";
    unchecked = "<:notcheck:886685696100818994>";

    // Exit embed

    const exit = new MessageEmbed()
    .setTitle('⬅ Exiting')
    .setColor('WHITE')
    .setDescription('This message will be eliminated.')


    if (!server) {
      let sayServer = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("Insert an ID")
        .setColor("RED");
      return message.reply({ embeds: [sayServer] });
    }

    if (!client.guilds.cache.has(server)) {
      let noServer = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("server not found")
        .setColor("RED");
      return message.reply({ embeds: [noServer] });
    }

    if (!premium) {
      var response = new MessageEmbed()
        .setTitle("🚀 Premium Guilds")
        .setColor('LUMINOUS_VIVID_PINK')
        .setDescription(`the server now is : \n${unchecked} **Not premium**`)

    var row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("YesActivate")
        .setLabel("Give premium")
        .setStyle("SUCCESS"),

      new MessageButton()
        .setCustomId("No")
        .setLabel("Cancel")
        .setStyle("DANGER")
    );

    var final = new MessageEmbed()
      .setTitle("✅ Success")
      .setColor("GREEN")
      .setDescription(`The server now is : \n${checked} **Premium**`);

    } else {

        var response = new MessageEmbed()
        .setTitle("🚀 Premium Guilds")
        .setColor('LUMINOUS_VIVID_PINK')
        .setDescription(`the server now is : \n${checked} **Premium**`)


        var row = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("YesDisactivate")
              .setLabel("Remove premium")
              .setStyle("SUCCESS"),
    
            new MessageButton()
              .setCustomId("No")
              .setLabel("Cancel")
              .setStyle("DANGER")
          );
    
          var final = new MessageEmbed()
            .setTitle("✅ Success")
            .setColor("GREEN")
            .setDescription(`The server is : \n${unchecked} **Not premium**`);

    }

    const m = await message.reply({
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
          let pg = new premiumGuild({
              ServerID: server
          })
          await pg.save()
          setTimeout(() => m.delete(), 5000)
        }
  
        if (i.customId === "YesDisactivate") {
            await i.deferUpdate();
            i.editReply({ embeds: [final], components: []})
            await premiumGuild.findOneAndDelete({ServerID: server})
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
                  setTimeout(() => m.delete(), 5000)
              }
          })
      
  


  },
};

module.exports = command;
