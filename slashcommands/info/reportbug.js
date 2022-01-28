const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const toml = require("toml");
const fs = require("fs");
const config = toml.parse(
  fs.readFileSync("./config/config.toml", "utf-8")
);

const image = 'https://i.imgur.com/anPh4kJ.jpg';


const { report_channel } = config;

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
  userPerms: ["SEND_MESSAGES"],
  botPerms: ["SEND_MESSAGES"],
  category: 'Información',

  data: new SlashCommandBuilder()
    .setName("reportbug")
    .setDescription("reporta un bug!")
    .addStringOption((option) =>
      option
        .setName("comando")
        .setRequired(true)
        .setDescription("EL nombre del comando.")
    )
    .addStringOption((option) =>
      option.setName("bug").setRequired(true).setDescription("El bug en cuestión")
    )
    .addStringOption((option) =>
      option.setName("imagen").setDescription("¿Tienes algun link de imagen? ¡Compartenosla!")
    ),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  async run(client, interaction) {
    const nameBug = interaction.options.getString("comando");
    const bug = interaction.options.getString("bug");
    const bugFile =
      interaction.options.getString("imagen") || image;

    let reportChannel = client.channels.cache.get(report_channel);

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("yes")
        .setEmoji("<:on:910938393628770314>")
        .setLabel("Si")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("no")
        .setEmoji("<:off:910938393616199790>")
        .setLabel("No")
        .setStyle("DANGER")
    );

    const embed = new MessageEmbed()
      .setTitle("<a:attention:910938394861916160> Panel de confirmación")
      .setDescription("Estás a punto de reportar un bug, lo cual conlleva que si es algo inapropiado, puedas ser sancionado. ¿Deseas proceder?")
      .addField(
        "Tu reporte:",
        `\`\`\`Nombre del comando: ${nameBug}\n---------------\nError: ${bug}\`\`\``
      )
      .setImage(bugFile.startsWith("https://") ? bugFile : image)
      .setColor("#ff0000");

    const embed2 = new MessageEmbed()
      .setTitle("<:on:910938393628770314> Bug reportado correctamente!")
      .setDescription(
        "Gracias por reportar el comando, lo miraremos lo más rápido posible."
      )
      .setColor("#00ff00");

    const embed3 = new MessageEmbed()
      .setTitle("<:off:910938393616199790> Bug report cancelado!")
      .setDescription("Haz cancelado el reporte.")
      .setColor("#ff0000");

    const offTime = new MessageEmbed()
      .setTitle(":timer: Tiempo fuera!")
      .setDescription("Se te venció el tiempo.")
      .setColor("#ff0000");

    // Embed to channel

    const embedChannel = new MessageEmbed()
      .setTitle("📢 Nuevo reporte!")
      .addField(
        "👤 Usuario:",
        `${interaction.user.tag}\nID (${interaction.user.id})`,
        true
      )
      .addField(
        "🌐 Server",
        `${interaction.guild.name}\nID (${interaction.guild.id})`,
        true
      )
      .addField(
        "El reporte:",
        `\`\`\`Nombre del comando: ${nameBug}\n---------------\nError: ${bug}\`\`\``
      )
      .setImage(bugFile.startsWith("https://") ? bugFile : image)
      .setColor("#ff0000");

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });

    const filtro = (i) => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filtro,
      time: 30000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "yes") {
        await interaction.editReply({
          embeds: [embed2],
          components: [],
          ephemeral: true,
        });
        collector.stop("yes");
        await reportChannel.send({ embeds: [embedChannel] });
      } else if (i.customId === "no") {
        await interaction.editReply({
          embeds: [embed3],
          components: [],
          ephemeral: true,
        });
        collector.stop("no");
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        await interaction.editReply({
          embeds: [offTime],
          components: [],
          ephemeral: true,
        });
      }
    });
  },
};

module.exports = command;