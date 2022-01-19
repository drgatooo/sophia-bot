const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const premiumGuild = require("../../models/premiumGuild");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    devOnly: true,
    category: "private",


    data: new SlashCommandBuilder()
    .setName("view-premium")
    .setDescription("OWNER")
    .addStringOption(o => o.setName("id-server").setDescription("Sin descripción").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    let server = await client.guilds.fetch(interaction.options.getString("id-server"));
  
    // Data-base

    const premium = await premiumGuild.findOne({ ServerID: server.id });

    // emojis

    checked = "<:Check:886685653746720788>";
    unchecked = "<:notcheck:886685696100818994>";

    // Exit embed

    const exit = new MessageEmbed()
    .setTitle('⬅ Saliendo')
    .setColor('WHITE')
    .setDescription('Este mensaje se auto eliminará.')

    if(!client.guilds.cache.has(interaction.options.getString("id-server"))) {
        let noServer = new MessageEmbed()
        .setTitle('❌ Error')
        .setDescription(`No pertenezco a \`${server.name}\`.`)
        .setColor('RED')
        return interaction.reply({embeds: [noServer]})
    }

    if (!premium) {
      var response = new MessageEmbed()
        .setTitle("🚀 Servidor Premium")
        .setColor('LUMINOUS_VIVID_PINK')
        .setDescription(`El servidor : \n\`${server.name}\`, \n${unchecked} **No es premium.**`)

    var row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("YesActivate")
        .setLabel("Dar premium.")
        .setStyle("SUCCESS"),

      new MessageButton()
        .setCustomId("No")
        .setLabel("Cancelar.")
        .setStyle("DANGER")
    );

    var final = new MessageEmbed()
      .setTitle("✅ Hecho")
      .setColor("GREEN")
      .setDescription(`El servidor : \n\`${server.name}\`, \n${checked} **Es premium.**`);

    } else {

        var response = new MessageEmbed()
        .setTitle("🚀 Servidor Premium")
        .setColor('LUMINOUS_VIVID_PINK')
        .setDescription(`El servidor : \n\`${server.name}\`, \n${checked} **Es premium.**`)


        var row = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("YesDisactivate")
              .setLabel("Quitar Premium.")
              .setStyle("SUCCESS"),
    
            new MessageButton()
              .setCustomId("No")
              .setLabel("Cancelar.")
              .setStyle("DANGER")
          );
    
          var final = new MessageEmbed()
            .setTitle("✅ Hecho")
            .setColor("GREEN")
            .setDescription(`El servidor : \n\`${server.name}\`, \n${unchecked} **No es premium.**`);

    }

    await interaction.reply({
        embeds: [response],
        components: [row],
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
          interaction.editReply({ embeds: [final], components: []});
          
          let pg = new premiumGuild({
              ServerID: interaction.options.getString("id-server")
          })
          await pg.save()
          setTimeout(() => 
            interaction.deleteReply(), 
          5000)
        }
  
        if (i.customId === "YesDisactivate") {
            await i.deferUpdate();
            interaction.editReply({ embeds: [final], components: []})
            
            await premiumGuild.deleteOne({
              ServerID: interaction.options.getString("id-server")
            })
            setTimeout(() => 
              interaction.deleteReply(), 
            5000)
        }
  
        if (i.customId === "No"){
          await i.deferUpdate();
          interaction.editReply({ embeds: [exit], components: []})

          setTimeout(() => 
            interaction.deleteReply(), 
          5000)
        }
      })
  
      collector.on("end", (_collector, reason) => {
              if (reason === "time"){
                  setTimeout(() => interaction.deleteReply(), 5000)
              }
          })

    }
}

module.exports = command;