const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const antispamModel = require("../../models/antispam");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['MANAGE_GUILD'],
    botPerms: ['MANAGE_GUIL'],
    category: "Configuración",


    data: new SlashCommandBuilder()
    .setName("setantispam")
    .setDescription("Activa o desactiva el antispam"),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    const anti = await antispamModel.findOne({ ServerID: interaction.guild.id });
    const { spamEmoji, checked, unchecked } = {
      spamEmoji: '🚫',
      checked: '<:Check:886685653746720788>',
      unchecked: '<:notcheck:886685696100818994>'
    };

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

    await interaction.reply({
      embeds: [response],
      // components: [row], a
    });

    let iFilter = (i) => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter: iFilter,
      time: 60000,
      errors:['time']
    })

    collector.on("collect", async (i) => {
      if (i.customId === "YesActivate") {
        await i.deferUpdate();
        i.editReply({ embeds: [final], components: []});
        let aM = new antispamModel({
            ServerID: interaction.guild.id
        })
        await aM.save()
        setTimeout(() => interaction.deleteReply(), 5000)
      }

      if (i.customId === "YesDisactivate") {
          await i.deferUpdate();
          i.editReply({ embeds: [final], components: []})
          await antispamModel.findOneAndDelete({ServerID: interaction.guild.id})
          setTimeout(() => interaction.deleteReply(), 5000)
      }

      if (i.customId === "No"){
        await i.deferUpdate();
        i.editReply({ embeds: [exit], components: []})
        setTimeout(() => interaction.deleteReply(), 5000)
      }
    })

    collector.on("end", (_collector, reason) => {
            if (reason === "time"){
                interaction.editReply({embeds: [offTime], components: []})
                setTimeout(() => interaction.deleteReply(), 5000)
            }
        })

    }

}

module.exports = command;