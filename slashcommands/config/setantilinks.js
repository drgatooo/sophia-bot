const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const antilinksModel = require("../../models/antilinks");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['MANAGE_GUILD'],
    botPerms: ['MANAGE_GUILD'],
    category: "Configuración",


    data: new SlashCommandBuilder()
    .setName("setantilinks")
    .setDescription("Enciende o apaga el antilinks."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    const anti = await antilinksModel.findOne({ ServerID: interaction.guild.id });

    linkEmoji = "<:blurple_link:886742617524682792>";
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
        .setTitle(`${linkEmoji} Anti-Links`)
        .setColor("BLURPLE")
        .setDescription(`El antilinks ahora está : \n${unchecked} **Desactivado**`);

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
        .setDescription(`El antilinks ahora está : \n ${checked} **Activado**`);

    } else {
      var response = new MessageEmbed()
        .setTitle(`${linkEmoji} Anti-Links`)
        .setColor("BLURPLE")
        .setDescription(`The Anti-links now is: \n${checked} **Enabled**`);

      var row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("YesDisactivate")
          .setLabel("Desactivalo!")
          .setStyle("SUCCESS"),

        new MessageButton()
          .setCustomId("No")
          .setLabel("Cancelalo")
          .setStyle("DANGER")
      );

      var final = new MessageEmbed()
        .setTitle("✅ Exito")
        .setColor("GREEN")
        .setDescription(`El antilinks ahora está : \n${unchecked} **Desactivado**`);
    }

    const m = await interaction.reply({ embeds: [response], components: [row] });

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
        let aM = new antilinksModel({
            ServerID: interaction.guild.id
        })
        await aM.save()
        setTimeout(() => interaction.deleteReply(), 5000)
      }

      if (i.customId === "YesDisactivate") {
          await i.deferUpdate();
          i.editReply({ embeds: [final], components: []})
          await antilinksModel.findOneAndDelete({ServerID: interaction.guild.id})
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