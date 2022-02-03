const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Permissions,
} = require("discord.js");

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
  userPerms: ["MANAGE_CHANNELS"],
  botPerms: ["MANAGE_CHANNELS"],
  category: "premium",
  isPremium: true,
  data: new SlashCommandBuilder()
    .setName("block-channel")
    .setDescription("Activa o desactiva el bloqueo a un canal.")
    .addSubcommand((o) =>
      o
        .setName("activate")
        .setDescription("Bloquea un canal para que no puedan usarlo.")
        .addChannelOption((o) =>
          o
            .setName("canal")
            .setDescription("Canal a bloquear.")
            .setRequired(false)
        )
    )
    .addSubcommand((o) =>
      o
        .setName("desactivate")
        .setDescription("Desbloquea un canal para que puedan usarlo.")
        .addChannelOption((o) =>
          o
            .setName("canal")
            .setDescription("Canal a desbloquear.")
            .setRequired(false)
        )
    ),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  async run(client, interaction) {
    const subcmd = interaction.options.getSubcommand();

    if (subcmd === "activate") {
      const canal =
        interaction.options.getChannel("canal") || interaction.channel;
      const everyone = interaction.guild;
      if (canal.type !== "GUILD_TEXT") {
        const embed = new MessageEmbed()
          .setTitle("Error")
          .setDescription("El canal no es un canal de texto.")
          .setColor("#ff0000");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      // detecta si el canal ya está bloqueado
      const everyonePerms = canal.permissionsFor(everyone.id);
      const perms = new Permissions(everyonePerms);

      if (!perms.has(["SEND_MESSAGES"])) {
        const embed = new MessageEmbed()
          .setTitle("Error")
          .setDescription("El canal ya está bloqueado.")
          .setColor("#ff0000");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      canal.permissionOverwrites.set([
        { id: everyone.id, deny: ["SEND_MESSAGES"] },
      ]);
      const embed = new MessageEmbed()
        .setTitle("<a:Giveaways:878324188753068072> Listo!")
        .setDescription(
          `He bloqueado ${canal} a todos, menos a los administradores del servidor.`
        )
        .setColor("GREEN");
      return interaction.reply({ embeds: [embed] });
    }

    if (subcmd === "desactivate") {
      const canal =
        interaction.options.getChannel("canal") || interaction.channel;
      const everyone = interaction.guild;

      if (!canal.type === "GUILD_TEXT") {
        const embed = new MessageEmbed()
          .setTitle("Error")
          .setDescription("El canal no es un canal de texto.")
          .setColor("#ff0000");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const everyonePerms = canal.permissionsFor(everyone.id);
      const perms = new Permissions(everyonePerms);

      if (perms.has(["SEND_MESSAGES"])) {
        const embed = new MessageEmbed()
          .setTitle("Error")
          .setDescription("El canal ya está desbloqueado.")
          .setColor("#ff0000");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      canal.permissionOverwrites.set([
        { id: everyone.id, allow: ["SEND_MESSAGES"] },
      ]);

      const embed = new MessageEmbed()
        .setTitle("<a:Giveaways:878324188753068072> Listo!")
        .setDescription(`He desbloqueado ${canal} a todos.`)
        .setColor("GREEN");
      return interaction.reply({ embeds: [embed] });
    }
  },
};

module.exports = command;
