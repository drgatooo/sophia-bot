const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');


module.exports = {
    userPerms: "BAN_MEMBERS",
    category: "Moderación",
    data: new SlashCommandBuilder()
    .setName("clearwarns")
    .setDescription("Elimina las advertencias de un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a mirar").setRequired(true)),

    async run(client, interaction){
        const schema = require("../../models/warn-model.js");
        const args = interaction.options;
        const e = new MessageEmbed()
        .setTitle(":x: Error")
        .setColor("DARK_RED")

        const mention = args.getUser("usuario")
        const results = await schema.findOne({
            guildId: interaction.guild.id,
            userId: mention.id
      });

        if(!schema.findOne({guildId: interaction.guild.id, userId: mention.id})) return interaction.reply({embeds: [e.setDescription("Este usuario no tiene sanciones en este servidor!")], ephemeral: true });
        if(!results) return interaction.reply({embeds: [e.setDescription("Este usuario no tiene sanciones en este servidor!")], ephemeral: true });
      
        
    const msg = new MessageEmbed()
    .setDescription(`Estas seguro que quieres eliminar todas las sanciones de **${mention.tag}**?`)
    .setColor("RED")
    
    let row = new MessageActionRow()
        .addComponents(
        
        new MessageButton()
        .setLabel("continuar")
        .setCustomId("accept")
        .setStyle("SUCCESS"),
        
        new MessageButton()
        .setLabel("cancelar")
        .setCustomId("cancel")
        .setStyle("DANGER")
    );
    
      

        const embedFin = new MessageEmbed()
        .setDescription(`**Todas las Sanciones de ese usuario han sido eliminadas**\n**INFO:**\n**NOMBRE DEL USUARIO:** \`${mention.username}\`\n**DISCRIMINADOR DEL USUARIO:** \`${mention.discriminator}\`\n**TAG DEL USUARIO:** \`${mention.tag}\``)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(`${interaction.user.username}`, interaction.user.displayAvatarURL());
      
        await interaction.reply({embeds: [msg], components: [row] });
        const filtro = b => b.user.id === interaction.user.id;
        
        const collector = interaction.channel.createMessageComponentCollector({filter: filtro, time: 60000}); 
        collector.on('collect', async(b) => {
          if(b.user.id !== interaction.user.id) return b.reply({embeds: [e.setDescription("Solo el que puso el comando puede interactuar con el mismo!")], ephemeral: true});
          if(b.customId == 'accept'){
              b.deferUpdate();
              await schema.findOneAndDelete({guildId: interaction.guild.id, userId: mention.id});
              await interaction.editReply({embeds: [embedFin]});
          }
          if(b.customId == 'cancel'){
              b.deferUpdate();
              b.interaction.delete();
          }
        });

    }
}