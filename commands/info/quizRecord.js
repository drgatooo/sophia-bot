const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

let timeModel = require('../../models/quizTime')


/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'quizrecords',
    aliases: ['qrecords'],
    description: 'Fijate cual es tu record en el juego de adivinar palabras!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Information',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
         let row = new MessageActionRow()
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
        
        
        let quizTimer = await timeModel.findOne({UserID: message.author.id})
        
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
          
            return message.reply({embeds: [embedTiempo2]})
            
            
        }
        
        let embedTiempo = new MessageEmbed()
        .setTitle('🎲 Estadisticas de QuizWords')
        .setColor('ORANGE')
        
        
        
        embedTiempo.addField('⌛ Tiempo Record:',`${quizTimer.TimeMax ? `\`${quizTimer.TimeMax}\` segundos!` : '`No hay ningun record`'}`)
        embedTiempo.addField('🔥 Racha:', `${quizTimer.Racha ? `Tenes una racha de \`${quizTimer.Racha}\` palabras seguidas!` : '`0`'}`)
        embedTiempo.addField('🔠 Palabra mas larga descubierta:',`${quizTimer.LongWord ? `\`${quizTimer.LongWord}\`` : '`ninguna`'}`)
        embedTiempo.addField('✅ Cantidad de palabras acertadas:',`${quizTimer.Assertions ? `\`${quizTimer.Assertions}\`` : '`0`'}`)
        embedTiempo.addField('❎ Cantidad de palabras no acertadas:',`${quizTimer.NoAssertions ? `\`${quizTimer.NoAssertions}\`` : '`0`'}`)
        embedTiempo.addField('🌐 Veces jugado:',`\`${quizTimer.Assertions + quizTimer.NoAssertions }\``)
        
        
        
        
        
        if (quizTimer && quizTimer.TimeMax > 0){

                let m = await message.reply({embeds: [embedTiempo], components: [row]})
                let iFilter = (i) => i.user.id === message.author.id;
  
      const collector = m.createMessageComponentCollector({
        filter: iFilter,
        time: 60000,
        errors:['time']
      })
      
      
      collector.on("collect", async (i) => {
          
          if (i.customId === "Si") {
              await timeModel.updateOne({UserID: message.author.id},{TimeMax: null})
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
            return message.reply({embeds: [embedTiempo]})
        }
        
        
        
    }
}

module.exports = command