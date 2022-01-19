const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const logsModel = require("../../models/setModLogs");
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));
/**
 * @type {import('../../types/typesctructure').Command}
 */

const command = {
  name: "ban",
  aliases: ["banuser", "buser"],
  description: "Banea a un usuario",
  userPerms: ["BAN_MEMBERS"],
  botPerms: ["BAN_MEMBERS"],
  category: "Moderation",
  premium: false,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {string[]} args
   */

  run: async (client, message, args) => {
    // Time
    let timedelete = config.deleteTime;
      
      let ch

    // Data-base
    let logsChannel = await logsModel.findOne({ ServerID: message.guild.id });
  
    try {

    	 ch = message.guild.channels.cache.get(logsChannel.ChannelID);

    } catch(error){console.log(error)}

    // Code

    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    var reason = args.slice(1).join(" ");

    if (!user) {
      let noUser = new MessageEmbed()
        .setTitle("❌ Error")
        .setColor("RED")
        .setDescription("Escribe una ID valida.");

      let m = await message.channel.send({ embeds: [noUser] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (user.id === message.author.id) {
      let nobanYourself = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("No te podes banear a vos mismo.")
        .setColor("RED");
      let m = await message.channel.send({ embeds: [nobanYourself] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (user.id === client.user.id) {
      let nobanBot = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("No podes banearme con mis comandos.")
        .setColor("RED");
      let m = await message.channel.send({ embeds: [nobanBot] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (!user.bannable) {
      let nobaneable = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(
          "El usuario no puede ser baneado (Capaz es porque mi rol esta por debajo de el)"
        )
        .setColor("RED");
      let m = await message.channel.send({ embeds: [nobaneable] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (
      user.roles.highest.position >= message.member.roles.highest.position &&
      !message.member.guild.ownerId
    ) {
      let noban = new MessageEmbed()
        .setTitle("❌ Error")
        .setColor("RED")
        .setDescription(
          "No podes banear a un miembro que tiene un rol igual o mas alto al tuyo (Solo el owner puede)"
        );

      let m = await message.channel.send({ embeds: [noban] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (!reason) reason = "Sin razón";

    var firstembed = new MessageEmbed()
      .setTitle("🔴 Ban")
      .setColor("YELLOW")
      .setDescription(
        `**⚠ Advertencia**\nEl usuario: ${user} va a ser baneado\nRazón: **${reason}**`
      )
      .setTimestamp();

    var success = new MessageEmbed()
      .setTitle("👋 Miembro baneado")
      .setDescription("El usuario fue baneado con exito del servidor!")
      .setColor("GREEN")
      .addField('👤 Miembro: ',`${user}`,true)
      .addField("👮‍♂️ Staff: ", `<@${message.author.id}>`,true)
      .setTimestamp();

    const exit = new MessageEmbed()
      .setTitle("⬅ Saliendo")
      .setColor("WHITE")
      .setDescription("El mensaje va a ser eliminado.");

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("YesDoIt")
        .setLabel("Si")
        .setStyle("SUCCESS"),

      new MessageButton()
        .setCustomId("NoCancel")
        .setLabel("No")
        .setStyle("DANGER")
    );

    let row2 = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("optionsMenu")
        .setPlaceholder("Selecciona una razón rápida!")
        .addOptions([
          {
            label: "Spamming",
            value: "Spamming",
            emoji: "1️⃣",
          },
          {
            label: "Trolling",
            value: "Trolling",
            emoji: "2️⃣",
          },
          {
            label: "No respetar las reglas",
            value: "No respetar las reglas",
            emoji: "3️⃣",
          },
          {
            label: "Insultos a staff",
            value: "Insultos a staff",
            emoji: "4️⃣",
          },
          {
            label: "MD Spam",
            value: "MD Spam",
            emoji: "5️⃣",
          },
          {
            label: "NSFW post",
            value: "NSFW post",
            emoji: "6️⃣",
          },
          {
            label: "Raider",
            value: "Raider",
            emoji: "7️⃣",
          },
          {
            label: "Privado",
            value: "privado",
            emoji: "8️⃣",
          },
        ])
    );

    if (reason === "Sin razón") {
      let m = await message.channel.send({
        embeds: [firstembed],
        components: [row2],
      });

      let iFilter = (i) => i.user.id === message.author.id;

      const collector = m.createMessageComponentCollector({
        filter: iFilter,
        time: 10000,
        errors: ["time"],
      });

      collector.on("collect", async (i) => {
          if (i.isSelectMenu()){
            const value = i.values[0];
            reason = value;
                await i.deferUpdate();
                m.edit({
                    embeds: [
                      firstembed.setDescription(
                        `**⚠ Advertencia**\nEl usuario: ${user} va a ser baneado\nRazón: **${reason}**`
                      ),
                    ],
                    components: [row],
                  });
          }
          if (i.customId === "YesDoIt") {
            await i.deferUpdate();
            i.editReply({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)], components: [] });
            user.ban({reason:reason})
          }
  
          if (i.customId === "NoCancel") {
            await i.deferUpdate();
            i.editReply({ embeds: [exit], components: [] });
            setTimeout(() => m.delete(), 5000);
          }

    
      });
    } else {
      let m = await message.channel.send({
        embeds: [firstembed],
        components: [row],
      });

      let iFilter = (i) => i.user.id === message.author.id;

      const collector = m.createMessageComponentCollector({
        filter: iFilter,
        time: 10000,
        errors: ["time"],
      });

      collector.on("collect", async (i) => {
        if (i.customId === "YesDoIt") {
          await i.deferUpdate();
          user.ban({reason:reason})
            if (!ch){
                  ch.send({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)] })
              }
          if (logsChannel && message.channel.id !== ch){
            ch.send({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)] })
          } else {
            i.editReply({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)], components: [] });
          }
        }

        if (i.customId === "NoCancel") {
          await i.deferUpdate();
          i.editReply({ embeds: [exit], components: [] });
          setTimeout(() => m.delete(), 5000);
        }
      });
    }
  },
};

module.exports = command;