const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const schema = require("../../models/components-welcome");
/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
  userPerms: ["MANAGE_GUILD"],
  botPerms: ["MANAGE_GUILD"],
  category: "Configuración",

  data: new SlashCommandBuilder()
    .setName("componentswelcome")
    .setDescription(
      "Establece el embed personalizado para el sistema de bienvenidas."
    )
    .addSubcommand((o) => o.setName("set").setDescription("Ingresa los datos."))
    .addSubcommand((o) =>
      o
        .setName("help")
        .setDescription(
          "Guiate un poco para configurar de forma efectiva el sistema."
        )
    ),

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  async run(client, interaction) {
    const args = interaction.options;

    const subcmd = args.getSubcommand();

    const components = await schema.findOne({ ServerID: interaction.guild.id });

    if (subcmd === "set") {
      const modal = new Modal()
        .setTitle("Components Welcome")
        .setCustomId("components_welcome")
        .addComponents(
          new TextInputComponent()
            .setCustomId("welcome_title")
            .setLabel("Título")
            .setMinLength(1)
            .setMaxLength(256)
            .setStyle("SHORT")
            .setPlaceholder("Aquí va el título.")
            .setRequired(false),

          new TextInputComponent()
            .setCustomId("welcome_description")
            .setLabel("Descripción")
            .setMinLength(1)
            .setMaxLength(4000)
            .setStyle("LONG")
            .setPlaceholder("Aquí va la descripción.")
            .setRequired(false),

          new TextInputComponent()
            .setCustomId("welcome_footer")
            .setLabel("Footer")
            .setMinLength(1)
            .setMaxLength(2048)
            .setStyle("LONG")
            .setPlaceholder("Aquí va el footer.")
            .setRequired(false),

          new TextInputComponent()
            .setCustomId("welcome_image")
            .setLabel("Imagen")
            .setMinLength(1)
            .setMaxLength(4000)
            .setStyle("LONG")
            .setPlaceholder("Aquí va la URL de la imagen.")
            .setRequired(false)
        );

      showModal(modal, { client: client, interaction: interaction });

      client.on("modalSubmit", async (modal) => {
        if (modal.customId === "components_welcome") {
          const title = modal.getTextInputValue("welcome_title");
          const description = modal.getTextInputValue("welcome_description");
          const footer = modal.getTextInputValue("welcome_footer");
          const imagen = modal.getTextInputValue("welcome_image");
          
          const error = new MessageEmbed()
          .setTitle('❌ Error')
          .setColor('RED')
          
          if(imagen){
            if(!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(imagen)){
              error.setDescription('La URL de la imagen no es válida.')
              return modal.reply({ embeds: [error] })
            }
          }

          if (!imagen) {
            imagen = interaction.guild.iconURL({
              dynamic: false,
              format: "png",
            });
          }
          
          if (!title) {
            title = "";
          }
          if (!footer) {
            footer = "";
          }

          if (!components) {
            let compo = new schema({
              ServerID: interaction.guild.id,
              Description: description,
              Title: title,
              Footer: footer,
              Imagen: imagen,
            });
            compo.save();

            let embed = new MessageEmbed()
              .setTitle("Muy bien! :heart:")
              .setDescription(
                "He analizado los datos y he guardado la información en mi base de datos."
              )
              .setColor("AQUA")
              .setFooter({ text: "Dame unos segundos, editaré este mensaje" });

            const final = new MessageEmbed()
              .setTitle(title)
              .setDescription(description)
              .setFooter({ text: footer })
              .setImage(
                `https://api.popcat.xyz/welcomecard?background=${imagen}&text1=${
                  interaction.user.username
                }&text2=Bienvenido+a+${
                  interaction.guild.name
                }&text3=Pasalo+bien!&avatar=${interaction.user.displayAvatarURL(
                  {
                    format: "png",
                    dinamyc: false,
                  }
                )}`
                  .trim()
                  .split(/ +/)
                  .join("+")
              );

            modal.reply({ embeds: [embed] });
            setTimeout(async () => {
              await modal.editReply({ embeds: [final] });
            }, 5000);
          } else {
            await schema.updateOne({
              ServerID: interaction.guild.id,
              Description: description,
              Title: title,
              Footer: footer,
              Imagen: imagen,
            });

            let embed2 = new MessageEmbed()
              .setTitle("Muy bien! :heart:")
              .setDescription(
                "He analizado los datos y he actualizado la información en mi base de datos."
              )
              .setColor("AQUA")
              .setFooter({ text: "Dame unos segundos, editaré este mensaje" });

            const final = new MessageEmbed()
              .setColor("FUCHSIA")
              .setTitle(title)
              .setDescription(description)
              .setFooter({ text: footer })
              .setImage(
                `https://api.popcat.xyz/welcomecard?background=${imagen}&text1=${
                  interaction.user.username
                }&text2=Bienvenido+a+${
                  interaction.guild.name
                }&text3=Pasalo+bien!&avatar=${interaction.user.displayAvatarURL(
                  {
                    format: "png",
                    dinamyc: false,
                  }
                )}`
                  .trim()
                  .split(/ +/)
                  .join("+")
              );

            modal.reply({ embeds: [embed2] });
            setTimeout(async () => {
              await modal.editReply({ embeds: [final] });
            }, 5000);
          }
        }
      });
    }

    if (subcmd === "help") {
      const titulo =
        `Al momento de establecer el titulo tienes las siguientes opciones para usar libremente:` +
        "\n" +
        "`{member.username}` - Mostrará el username del usuario, ejemplo, **" +
        interaction.user.username +
        "**" +
        "\n" +
        "`{member.tag}` - Mostrará el tag del usuario, ejemplo, **" +
        interaction.user.tag +
        "**" +
        "\n" +
        "`{server}` - Mostrará el nombre del servidor, ejemplo, **" +
        interaction.guild.name +
        "**";

      const descripcion =
        `Al momento de establecer la descripción tienes las siguientes opciones para usar libremente:` +
        "\n" +
        "`{member.username}` - Mostrará el username del usuario, ejemplo, **" +
        interaction.user.username +
        "**" +
        "\n" +
        "`{member}` - Mostrará una mención del usuario, ejemplo, <@" +
        interaction.user.id +
        ">" +
        "\n" +
        "`{member.tag}` - Mostrará el tag del usuario, ejemplo, **" +
        interaction.user.tag +
        "**" +
        "\n" +
        "`{server}` - Mostrará el nombre del servidor, ejemplo, **" +
        interaction.guild.name +
        "**" +
        "\n" +
        "`{membersTotal}` - Mostrará los miembros totales del servidor, ejemplo, **" +
        interaction.guild.memberCount +
        "**";

      const footer =
        `Al momento de establecer el footer tienes las siguientes opciones para usar libremente:` +
        "\n" +
        "`{member.username}` - Mostrará el username del usuario, ejemplo, **" +
        interaction.user.username +
        "**" +
        "\n" +
        "`{server}` - Mostrará el nombre del servidor, ejemplo, **" +
        interaction.guild.name +
        "**" +
        "\n" +
        "`{membersTotal}` - Mostrará los miembros totales del servidor, ejemplo, **" +
        interaction.guild.memberCount +
        "**";

      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Apartado de ayuda para Sistema de bienvenidas.")
        .setDescription(
          "A continuación te daremos una mini guía por el sistema de bienvenidas..."
        )
        .addField("TITULO:", titulo)
        .addField("DESCRIPCIÓN:", descripcion)
        .addField("FOOTER:", footer);

      interaction.reply({ embeds: [embed], ephemeral: true });
      interaction.user.send({ embeds: [embed] }).catch((err) => {
        return;
      });
    }
  },
};

module.exports = command;
