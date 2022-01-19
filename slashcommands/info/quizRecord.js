const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
let timeModel = require('../../models/quizTime');

module.exports = {
    botPerms: ["ADMINISTRATOR"],
    category: "Información", 
    data: new SlashCommandBuilder()
    .setName("quizrecords")
    .setDescription("Revisa tus estadisticas del juego quiz.")
    .addUserOption(o => o.setName("usuario").setDescription("Revisa las estadisticas de algún usuario en particular.").setRequired(false)),
    
    async run(client, interaction){

    const usuario = interaction.options.getUser("usuario");
    
    if(usuario){
        row = new MessageActionRow()
            .addComponents(
            
                new MessageButton()
                .setStyle('PRIMARY')
                .setLabel('Reiniciar Record')
                .setDisabled(true)
                .setCustomId('Si'),
                new MessageButton()
                .setStyle('SECONDARY')
                .setLabel('Salir')
                .setCustomId('No')
        )
    } else {
        row = new MessageActionRow()
        .addComponents(
                
                new MessageButton()
                .setStyle('PRIMARY')
                .setLabel('Reiniciar Record')
                .setCustomId('Si'),
                new MessageButton()
                .setStyle('SECONDARY')
                .setLabel('Salir')
                .setCustomId('No')
        )    
    }
        
        if(usuario){
            quizTimer = await timeModel.findOne({UserID: usuario.id})
        } else {
            quizTimer = await timeModel.findOne({UserID: interaction.user.id})
        }

        if (!quizTimer){
            
        let embedTiempo2 = new MessageEmbed()
        .setTitle('🎲 Estadisticas de QuizWords')
        .setColor('ORANGE')
        
        
        
        embedTiempo2.addField('⌛ Tiempo Record:','`Todavia no jugaste!`')
        embedTiempo2.addField('🔥 Racha:','`Todavia no jugaste`')
        embedTiempo2.addField('🔠 Palabra mas larga descubierta:','`ninguna`')
        embedTiempo2.addField('✅ Cantidad de palabras acertadas:','`0`')
        embedTiempo2.addField('❎ Cantidad de palabras no acertadas:','`0`')
        embedTiempo2.addField('🌐 Veces jugado:','`0`')
          
        return interaction.reply({embeds: [embedTiempo2]})
            
            
        }
        
        let embedTiempo = new MessageEmbed()
        .setColor('ORANGE')
        if(usuario){
            embedTiempo.setTitle(`🎲 Estadisticas QuizWords de ${usuario.tag}`)
        } else {
            embedTiempo.setTitle('🎲 Estadisticas de QuizWords')
        }
        
        
        
        embedTiempo.addField('⌛ Tiempo Record:',`${quizTimer.TimeMax ? `\`${quizTimer.TimeMax}\` segundos!` : '`No hay ningun record`'}`)
        embedTiempo.addField('🔥 Racha:', `${quizTimer.Racha ? `Tienes una racha de \`${quizTimer.Racha}\` palabras seguidas!` : '`0`'}`)
        embedTiempo.addField('🔠 Palabra mas larga descubierta:',`${quizTimer.LongWord ? `\`${quizTimer.LongWord}\`` : '`ninguna`'}`)
        embedTiempo.addField('✅ Cantidad de palabras acertadas:',`${quizTimer.Assertions ? `\`${quizTimer.Assertions}\`` : '`0`'}`)
        embedTiempo.addField('❎ Cantidad de palabras no acertadas:',`${quizTimer.NoAssertions ? `\`${quizTimer.NoAssertions}\`` : '`0`'}`)
        embedTiempo.addField('🌐 Veces jugado:',`\`${quizTimer.Assertions + quizTimer.NoAssertions }\``)
        
        
        
        
        
        if (quizTimer && quizTimer.TimeMax > 0){

        await interaction.reply({embeds: [embedTiempo], components: [row]})        
        let iFilter = (i) => i.user.id === interaction.user.id;
  
      const collector = interaction.channel.createMessageComponentCollector({
        filter: iFilter,
        time: 60000,
        errors:['time']
      })
      
      
      collector.on("collect", async (i) => {
          
          if (i.customId === "Si") {
              await timeModel.updateOne({UserID: interaction.user.id},{TimeMax: null})
              let Si = new MessageEmbed()
              .setTitle('✅ Hecho')
              .setColor('GREEN')
              .setDescription('Record reseteado!')
              await i.deferUpdate();
          i.editReply({ embeds: [Si], components: []});
          }
          if (i.customId === "No") {
              let No = new MessageEmbed()
              .setTitle('✅ Operacion cancelada!')
              .setColor('GREEN')
              .setDescription('Todo sigue tal cual ;)')
              await i.deferUpdate();
          i.editReply({ embeds: [No], components: []});
          }
          
      })
        } else {
            return interaction.reply({embeds: [embedTiempo]})
        }
    
    }
}