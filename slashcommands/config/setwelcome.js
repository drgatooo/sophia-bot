const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require('../../models/setWelcome');
/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ['MANAGE_GUILD'],
    botPerms: ['MANAGE_GUILD'],
    category: "Configuración",


    data: new SlashCommandBuilder()
    .setName("set-welcome") // te lo dejo a ti //sis
    .setDescription("Establece el canal de bienvenidas del servidor.")
    .addChannelOption(o =>
      o.setName("canal")
      .setDescription('Canal de bienvenidas')
      .setRequired(true)
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(_, interaction){
      const args = interaction.options;
      let chid = args.getChannel("canal");
      if (chid.type !== 'GUILD_TEXT' || !chid.viewable) {
          const noValid = new MessageEmbed()
          .setTitle('❌ Error')
          .setDescription('¡Ese no es un canal valido!')
          .setColor('RED')
          
          return await interaction.reply({ embeds: [noValid], ephemeral: true });
      }
      

      const sameID = new MessageEmbed()
      .setTitle('❌ Error')
      .setColor('RED')
      .setDescription("El canal establecido tiene el mismo ID de antes, establece otro!");

      const successUpdate = new MessageEmbed()
      .setTitle('✅ Exito')
      .setColor('GREEN')
      .setDescription(`El canal de bienvenidas fue actualizado a <#${chid.id}>`);

      const success = new MessageEmbed()
      .setTitle('✅ Exito')
      .setColor('GREEN')
      .setDescription(`El canal de bienvenidas fue establecido a <#${chid.id}>`);

      const channel = await schema.findOne({ ServerID: interaction.guild.id});

      if (!channel) {
        const ch = new schema({
          ServerID: interaction.guild.id,
          ChannelID: chid.id
      });
        await ch.save();
        return await interaction.reply({ embeds: [success] });
      } else if (channel && channel.ChannelID !== chid.id){
        await schema.updateOne({ ServerID: interaction.guild.id}, { $set: { ChannelID: chid.id }});
        return await interaction.reply({ embeds: [successUpdate] });
      }

      if (channel && channel.ChannelID === chid.id) return await interaction.reply({embeds: [sameID], ephemeral: true });

      }
    }

module.exports = command;