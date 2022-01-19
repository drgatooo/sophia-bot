const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'bang',
    aliases: [],
    description: 'Simula un duelo clasico de pistolas!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {
        
        let secondPlayer = message.mentions.members.first()
        
        if (secondPlayer == null){
            
        let arma = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('Pistola')
            .setStyle('SECONDARY')
            .setLabel('Dispara!')
            .setEmoji('💥')
        
        )
        
        let win = new MessageEmbed()
        .setTitle('💥 Bang!')
        .setDescription('Haz ganado!')
        .setColor('GREEN')
        
        let offTime = new MessageEmbed()
        .setTitle('🌵 Oh no...')
        .setDescription('Has perdido, tenes que ser mas rapido para la proxima!')
        .setColor('RED')
        
        let ya = new MessageEmbed()
        .setTitle('🔫 Dispara!')
        .setDescription('🔥 Es tu momento de disparar vaquero!')
        .setColor('WHITE')
        
        let firstEmbed = new MessageEmbed()
        .setTitle('🤠 Lejano oeste')
        .setDescription('⌛ Estate preparado para apretar el gatillo')
        .setColor('ORANGE')
        
        const m = await message.reply({embeds:[firstEmbed]})
        
        setTimeout(() => m.edit({embeds: [ya], components: [arma]}), 3000)

    let iFilter = (i) => i.user.id === message.author.id;

    const collector = m.createMessageComponentCollector({
      filter: iFilter,
      time: 5000,
      errors:['time']
    })

    collector.on("collect", async (i) => {
        if (i.customId == 'Pistola') {
           m.edit({embeds: [win], components: []})
            collector.stop('Ya termino')
        }
    })
        
    collector.on("end", (_collector, reason) => {
            if (reason === "time"){
                m.edit({embeds: [offTime], components: []})
                setTimeout(() => m.delete(), 5000)
            }
        })
        
        } else {
            
            if (secondPlayer.id  === message.author.id ) {
                let noPosible = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription('➡ No podes jugar contra vos mismo...')
                .setColor('RED')
                return message.reply({embeds: [noPosible]})
            } else if  (secondPlayer.id  === client.user.id ) {
                let noPosible = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription(`➡ Simplemente usa ${prefix}bang para jugar contra mi!`)
                .setColor('RED')
                return message.reply({embeds: [noPosible]})
            } else if (secondPlayer.user.bot ) {
                let noPosible = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription(`➡ No puedes jugar contra bots!`)
                .setColor('RED')
                return message.reply({embeds: [noPosible]})
            }
            
            
            let confirmacion = new MessageEmbed()
            .setTitle("🛑 Espera a que tu rival confirme")
            .setDescription(`¿${secondPlayer} confirmas?`)
            .setColor("WHITE")
            
            let confirm = new MessageActionRow()
            .addComponents(
            	new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Acepto")
                .setCustomId("Si"),
                
                new MessageButton()
                .setStyle("DANGER")
                .setLabel("No, no acepto")
                .setCustomId("No")
               
            )
            
            let Duelo = new MessageActionRow()
            .addComponents(
            	new MessageButton()
            	.setCustomId('Pistola')
            	.setStyle('SECONDARY')
            	.setLabel('Dispara!')
            	.setEmoji('💥')
            )
            
            let ya = new MessageEmbed()
        .setTitle('🔫 Dispara!')
        .setDescription('🔥 Es tu momento de disparar vaquero!')
        .setColor('WHITE')
        
        let firstEmbed = new MessageEmbed()
        .setTitle('🤠 Lejano oeste')
        .setDescription('⌛ Estate preparado para apretar el gatillo')
        .setColor('ORANGE')
        
        let rechaza = new MessageEmbed()
        .setTitle('🤠 Lejano oeste')
        .setDescription(`💥 Se ve que ${secondPlayer} no acepta el reto...`)
        .setColor('ORANGE')
            
            
             let m = await message.channel.send({embeds: [confirmacion], components:[confirm]})
            
            let iFilter = (i) => i.user.id === secondPlayer.id;
            
            const collector = m.createMessageComponentCollector({
      		filter: iFilter,
      		time: 5000,
      		errors:['time']
    })
            
            collector.on("collect", async (i) => {
        if (i.customId == 'Si') {
            collector.stop('Acepto el jugador')
           m.edit({embeds: [firstEmbed], components: []})
            
            
            setTimeout(() => m.edit({embeds: [ya], components: [Duelo]}), 3000)
            
            const inGame = (i) => i.user.id === message.author.id || i.user.id == secondPlayer.id;
            
            const inGameCollector = m.createMessageComponentCollector({
      		filter: inGame,
      		time: 5000,
      		errors:['time']
   			 })
            
            inGameCollector.on('collect', async (i) => {
                if (i.customId == 'Pistola') {
                    let ganador = new MessageEmbed()
                    .setTitle('🤠 Lejano oeste')
                    .setDescription(`💥 Bang!\n **Ha ganado: <@${i.member.id}> **!`)
                    .setColor('GREEN')
                    m.edit({embeds: [ganador], components: []})
                   inGameCollector.stop('Se gano')
                }
                
            })
            
          inGameCollector.on("end", (_collector, reason) => {
            if (reason === "time"){
                const Nadie = new MessageEmbed()
                .setTitle('🤠 Duelo a muerte')
                .setDescription('ℹ Se ve que nadie acciono el gatillo... todos pierden :)')
                .setColor('WHITE')
                m.edit({embeds: [Nadie], components: []})
                setTimeout(() => m.delete(), 5000)
            }
        })
            
            
   
            
        } else if (i.customId == 'No') {
            m.edit({embeds: [rechaza], components: []})
            collector.stop('no quiere jugar')
            
        }
    })
            
            collector.on("end", (_collector, reason) => {
            if (reason === "time"){
                m.edit({embeds: [rechaza], components: []})
                setTimeout(() => m.delete(), 5000)
            }
        })
            
            
        }
    }
}

module.exports = command