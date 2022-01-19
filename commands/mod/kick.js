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
  name: "kick",
  aliases: ["kickuser", "kuser"],
  description: "kicks an user",
  userPerms: ["KICK_MEMBERS"],
  botPerms: ["KICK_MEMBERS"],
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
        .setDescription("Inserta una ID valida.");

      let m = await message.channel.send({ embeds: [noUser] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (user.id === message.author.id) {
      let noKickYourself = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("No te puedes kickear a ti mismo!")
        .setColor("RED");
      let m = await message.channel.send({ embeds: [noKickYourself] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (user.id === client.user.id) {
      let noKickBot = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("No puedes kickearme con mis comandos!")
        .setColor("RED");
      let m = await message.channel.send({ embeds: [noKickBot] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (!user.kickable) {
      let noKickeable = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription(
          "El usuario no puede ser expulsado (tal vez sea porque mi rol está por debajo del objetivo)"
        )
        .setColor("RED");
      let m = await message.channel.send({ embeds: [noKickeable] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (
      user.roles.highest.position >= message.member.roles.highest.position &&
      !message.member.guild.ownerId
    ) {
      let noKick = new MessageEmbed()
        .setTitle("❌ Error")
        .setColor("RED")
        .setDescription(
          "No puedes echar a un miembro que tiene un rol mayor o igual al tuyo. (Solo el propietario del servidor puede)"
        );

      let m = await message.channel.send({ embeds: [noKick] });
      setTimeout(() => {
        m.delete();
      }, timedelete);
      return;
    }

    if (!reason) reason = "Sin Razón";

    var firstembed = new MessageEmbed()
      .setTitle("Kick")
      .setColor("YELLOW")
      .setDescription(
        `**⚠ Advertencia.**\nEl usuario: ${user} ha va a ser kickeado\nRazón: **${reason}**`
      )
      .setTimestamp();

    var success = new MessageEmbed()
      .setTitle("👋 Miembro kickeado")
      .setDescription("El miembro ha sido kickeado exitosamente del servidor!")
      .setColor("GREEN")
      .addField('👤 Miembro: ',`${user}`,true)
      .addField("👮‍♂️ Staff: ", `<@${message.author.id}>`,true)
      .setTimestamp();

    const exit = new MessageEmbed()
      .setTitle("⬅ Saliendo...")
      .setColor("WHITE")
      .setDescription("Este mensaje se auto eliminara.");

    const offTime = new MessageEmbed()
      .setTitle("⏳ Error")
      .setColor("ORANGE")
      .setDescription("Se ha agotado el tiempo, vuelve a usar el comando!");

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("YesDoIt")
        .setLabel("Yes")
        .setStyle("SUCCESS"),

      new MessageButton()
        .setCustomId("NoCancel")
        .setLabel("Cancel")
        .setStyle("DANGER")
    );

    let row2 = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("optionsMenu")
        .setPlaceholder("Selecciona una razón!")
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
            label: "No respecting the rules",
            value: "No respecting the rules",
            emoji: "3️⃣",
          },
          {
            label: "Insult staff",
            value: "Insult staff",
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
            label: "Private",
            value: "private",
            emoji: "8️⃣",
          },
        ])
    );

    if (reason === "Sin Razón") {
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
                        `**⚠ Advertencia**\nEl usuario: ${user} va a ser kickeado\nRazón: **${reason}**`
                      ),
                    ],
                    components: [row],
                  });
          }
          if (i.customId === "YesDoIt") {
            await i.deferUpdate();
            if (logsChannel && message.channel.id !== ch){
              ch.send({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)] })
            } else {
              i.editReply({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)], components: [] });
            }
            user.kick(reason)
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
          user.kick(reason)
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
