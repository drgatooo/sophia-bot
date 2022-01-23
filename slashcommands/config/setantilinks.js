const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const antilinksModel = require("../../models/antilinks");

/**
 * @type {import('../../types/typeslasg').Command}
 */

const command = {
  userPerms: ["MANAGE_GUILD"],
  botPerms: ["MANAGE_GUILD"],
  category: "Configuración",

  data: new SlashCommandBuilder()
    .setName("setantilinks")
    .setDescription("Enciende o apaga el antilinks.")
    .addSubcommand((o) =>
      o.setName("activalo").setDescription("Activa el sistema anti links")
    )
    .addSubcommand((o) =>
      o.setName("desactivalo").setDescription("Desactiva el anti links")
    ),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  async run(client, interaction) {
    const subcmd = interaction.options.getSubcommand();

    if (subcmd === "activalo") {
      const anti = await antilinksModel.findOne({
        ServerID: interaction.guild.id,
      });

      spamEmoji = "🚫";
      checked = "<:Check:886685653746720788>";
      unchecked = "<:notcheck:886685696100818994>";

      if (!anti) {
        var final = new MessageEmbed()
          .setTitle("✅ Exito")
          .setColor("GREEN")
          .setDescription(
            `El Anti-Links ahora está: \n ${checked} **Activado**`
          );

        let aM = new antilinksModel({
          ServerID: interaction.guildId,
        });

        await aM.save();

        interaction.reply({ embeds: [final] }).then(() => {
          setTimeout(() => {
            interaction.deleteReply();
          }, 5000);
        });
      } else {
        var ya = new MessageEmbed()
          .setTitle("✅ Exito")
          .setColor("GREEN")
          .setDescription(
            `El Anti-Links **ya** está: \n ${checked} **Activado**`
          );

        interaction.reply({ embeds: [ya], ephemeral: true });
      }
    }

    if (subcmd === "desactivalo") {
      const anti = await antilinksModel.findOne({
        ServerID: interaction.guild.id,
      });

      spamEmoji = "🚫";
      checked = "<:Check:886685653746720788>";
      unchecked = "<:notcheck:886685696100818994>";

      if (!anti) {
        var final = new MessageEmbed()
          .setTitle(":x: Error")
          .setColor("RED")
          .setDescription(
            `El Anti-Links **no** se encuentra: \n ${unchecked} **Activado**`
          );

        interaction.reply({ embeds: [final], ephemeral: true });
      } else {
        var ya = new MessageEmbed()
          .setTitle("✅ Exito")
          .setColor("GREEN")
          .setDescription(
            `El Anti-Links ahora está: \n ${unchecked} **Desactivado**`
          );

        await antilinksModel.findOneAndDelete({
          ServerID: interaction.guild.id,
        });

        interaction.reply({ embeds: [ya] }).then(() => {
          setTimeout(() => {
            interaction.deleteReply();
          }, 5000);
        });
      }
    }
  },
};

module.exports = command;
