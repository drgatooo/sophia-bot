const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Client,
  CommandInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario.")
    .addUserOption(o =>
        o.setName("usuario")
        .setDescription('Usuario a expulsar')
        .setRequired(true)
        )
    .addStringOption(o =>
        o.setName("razón")
        .setDescription('Razón de la expulsion')
        .setRequired(false)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
    const args = interaction.options;
    let user = interaction.guild.members.cache.get(args.getUser('usuario').id);
    var reason = args.getString('razón');

    if (user.id === interaction.user.id) {
      let noKickYourself = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("No te puedes kickear a ti mismo!")
        .setColor("RED");
      await interaction.reply({ embeds: [noKickYourself], ephemeral: true });
      return;
    }

    if (user.id === client.user.id) {
      let noKickBot = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("No puedes kickearme con mis comandos!")
        .setColor("RED");
      await interaction.reply({ embeds: [noKickBot], ephemeral: true });
      return;
    }

    if (!user.kickable) {
      let noKickeable = new MessageEmbed()
        .setTitle("❌ Error")
        .setDescription("El usuario no puede ser expulsado (tal vez sea porque mi rol está por debajo del objetivo)")
        .setColor("RED");
      await interaction.reply({ embeds: [noKickeable], ephemeral: true });
      return;
    }

    if (
      user.roles.highest.position >= interaction.member.roles.highest.position &&
      !interaction.member.guild.ownerId
    ) {
      let noKick = new MessageEmbed()
        .setTitle("❌ Error")
        .setColor("RED")
        .setDescription(
          "No puedes echar a un miembro que tiene un rol mayor o igual al tuyo. (Solo el propietario del servidor puede)"
        );

      await interaction.reply({ embeds: [noKick], ephemeral: true });
      return;
    }

    if (!reason) reason = 'sin especificar';

    // var firstembed = new MessageEmbed()
    //   .setTitle("Kick")
    //   .setColor("YELLOW")
    //   .setDescription(
    //     `**⚠ Advertencia.**\nEl usuario: ${user.user.tag} ha va a ser kickeado\nRazón: **${reason}**`
    //   )
    //   .setTimestamp();

    var success = new MessageEmbed()
      .setTitle("👋 Miembro kickeado")
      .setDescription("El miembro ha sido kickeado exitosamente del servidor!")
      .setColor("GREEN")
      .addField('👤 Miembro: ',`${user}`,true)
      .addField("👮‍♂️ Staff: ", `<@${interaction.user.id}>`,true)
      .setTimestamp();

    if(reason !== 'sin especificar'){
      success.addField("💥 Razón: ", reason, true)
    }

      user.kick({reason}).then(async () => {
        await interaction.reply({ embeds: [success] });
      }).catch(async err => {
          await interaction.reply({ embeds: [
              new MessageEmbed()
              .setTitle(":x: Error")
              .setDescription("No se pudo kickear al usuario por un error interno, ya fue avisado a mis creadores para solucionarlo.")
              .setColor("RED")
          ], ephemeral: true });
          console.log(err.stack);
      });

    // const exit = new MessageEmbed()
    //   .setTitle("⬅ Saliendo...")
    //   .setColor("WHITE")
    //   .setDescription("Este mensaje se auto eliminara.");

    // let row = new MessageActionRow().addComponents(
    //   new MessageButton()
    //     .setCustomId("YesDoIt")
    //     .setLabel("Yes")
    //     .setStyle("SUCCESS"),

    //   new MessageButton()
    //     .setCustomId("NoCancel")
    //     .setLabel("Cancel")
    //     .setStyle("DANGER")
    // );

    // let row2 = new MessageActionRow().addComponents(
    //   new MessageSelectMenu()
    //     .setCustomId("optionsMenu")
    //     .setPlaceholder("Selecciona una razón!")
    //     .addOptions([
    //       {
    //         label: "Spamming",
    //         value: "Spamming",
    //         emoji: "1️⃣",
    //       },
    //       {
    //         label: "Trolling",
    //         value: "Trolling",
    //         emoji: "2️⃣",
    //       },
    //       {
    //         label: "No respecting the rules",
    //         value: "No respecting the rules",
    //         emoji: "3️⃣",
    //       },
    //       {
    //         label: "Insult staff",
    //         value: "Insult staff",
    //         emoji: "4️⃣",
    //       },
    //       {
    //         label: "MD Spam",
    //         value: "MD Spam",
    //         emoji: "5️⃣",
    //       },
    //       {
    //         label: "NSFW post",
    //         value: "NSFW post",
    //         emoji: "6️⃣",
    //       },
    //       {
    //         label: "Raider",
    //         value: "Raider",
    //         emoji: "7️⃣",
    //       },
    //       {
    //         label: "Private",
    //         value: "private",
    //         emoji: "8️⃣",
    //       },
    //     ])
    // );

    // if (reason === "Sin Razón") {
    //   let m = await message.channel.send({
    //     embeds: [firstembed],
    //     components: [row2],
    //   });

    //   let iFilter = (i) => i.user.id === message.author.id;

    //   const collector = m.createMessageComponentCollector({
    //     filter: iFilter,
    //     time: 10000,
    //     errors: ["time"],
    //   });

    //   collector.on("collect", async (i) => {
    //       if (i.isSelectMenu()){
    //         const value = i.values[0];
    //         reason = value;
    //             await i.deferUpdate();
    //             m.edit({
    //                 embeds: [
    //                   firstembed.setDescription(
    //                     `**⚠ Advertencia**\nEl usuario: ${user} va a ser kickeado\nRazón: **${reason}**`
    //                   ),
    //                 ],
    //                 components: [row],
    //               });
    //       }
    //       if (i.customId === "YesDoIt") {
    //         await i.deferUpdate();
    //         if (logsChannel && message.channel.id !== ch){
    //           ch.send({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)] })
    //         } else {
    //           i.editReply({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)], components: [] });
    //         }
    //         user.kick(reason)
    //       }
  
    //       if (i.customId === "NoCancel") {
    //         await i.deferUpdate();
    //         i.editReply({ embeds: [exit], components: [] });
    //         setTimeout(() => m.delete(), 5000);
    //       }

    
    //   });
    // } else {
    //   let m = await message.channel.send({
    //     embeds: [firstembed],
    //     components: [row],
    //   });

    //   let iFilter = (i) => i.user.id === message.author.id;

    //   const collector = m.createMessageComponentCollector({
    //     filter: iFilter,
    //     time: 10000,
    //     errors: ["time"],
    //   });

    //   collector.on("collect", async (i) => {
    //     if (i.customId === "YesDoIt") {
    //       await i.deferUpdate();
    //       user.kick(reason)
    //       if (logsChannel && message.channel.id !== ch){
    //         ch.send({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)] })
    //       } else {
    //         i.editReply({ embeds: [success.addField("📕 Razón: ", `\`\`\`${reason}\`\`\``)], components: [] });
    //       }
    //     }

    //     if (i.customId === "NoCancel") {
    //       await i.deferUpdate();
    //       i.editReply({ embeds: [exit], components: [] });
    //       setTimeout(() => m.delete(), 5000);
    //     }
    //   });
    // }
    }
}

module.exports = command;