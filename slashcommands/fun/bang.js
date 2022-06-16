const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
  } = require("discord.js-light");
/**
* @type {import('../../types/typeslash').Command}
*/

const command = {
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("bang")
    .setDescription('Simula un duelo clasico de pistolas!')
    .addUserOption(o =>
        o.setName('usuario')
        .setDescription('Persona con la que haras el duelo.')
        .setRequired(false)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    async run(client, interaction){
        const args = interaction.options;
        let secondPlayer = args.getUser('usuario');
        
        if (!secondPlayer){
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
        
        await interaction.reply({embeds: [firstEmbed]})
        
        setTimeout(async () => await interaction.editReply({embeds: [ya], components: [arma]}), 3000);
        let iFilter = i => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
          filter: iFilter,
          time: 5000,
          errors:['time']
        });

        collector.on("collect", async (i) => {
            if (i.customId == 'Pistola') {
                await interaction.editReply({embeds: [win], components: []});
                collector.stop('Ya termino');
            }
        });
        
        collector.on("end", async (_collector, reason) => {
            if (reason === "time"){
                await interaction.editReply({embeds: [offTime], components: []})
                setTimeout(async () => await interaction.deleteReply(), 5000);
            }
        });
        
        } else {
            
            if (secondPlayer.id === interaction.user.id ) {
                let noPosible = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription('➡ No podes jugar contra vos mismo...')
                .setColor('RED')
                return await interaction.reply({embeds: [noPosible], ephemeral: true });
            } else if  (secondPlayer.id === client.user.id ) {
                let noPosible = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription(`➡ Simplemente usa /bang para jugar contra mi!`)
                .setColor('RED')
                return await interaction.reply({embeds: [noPosible]})
            } else if (secondPlayer.bot ) {
                let noPosible = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription(`➡ No puedes jugar contra bots!`)
                .setColor('RED')
                return await interaction.reply({embeds: [noPosible]})
            }
            
            
            let confirmacion = new MessageEmbed()
            .setTitle("🛑 Espera a que tu rival confirme")
            .setDescription(`¿${secondPlayer} aceptas el duelo?`)
            .setColor("WHITE");
            
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
            
            
            await interaction.reply({embeds: [confirmacion], components:[confirm]});
            
            let iFilter = (i) => i.user.id === secondPlayer.id;
            
            const collector = interaction.channel.createMessageComponentCollector({
            filter: iFilter,
            time: 5000,
            errors:['time']
    })
            
            collector.on("collect", async (i) => {
              if (i.customId == 'Si') {
              collector.stop('Acepto el jugador')
              await interaction.editReply({embeds: [firstEmbed], components: []})
            
            
            setTimeout(async () => await interaction.editReply({embeds: [ya], components: [Duelo]}), 3000)
            
            const inGame = (i) => i.user.id === interaction.user.id || i.user.id === secondPlayer.id;
            
            const inGameCollector = interaction.channel.createMessageComponentCollector({
              filter: inGame,
              time: 5000,
              errors:['time']
            });
            
            inGameCollector.on('collect', async (i) => {
                if (i.customId == 'Pistola') {
                    let ganador = new MessageEmbed()
                    .setTitle('🤠 Lejano oeste')
                    .setDescription(`💥 Bang!\n **Ha ganado: <@${i.user.id}> **!`)
                    .setColor('GREEN')
                    interaction.editReply({embeds: [ganador], components: []});
                   inGameCollector.stop('Se gano');
                }
                
            })
            
          inGameCollector.on("end", (_collector, reason) => {
            if (reason === "time"){
                const Nadie = new MessageEmbed()
                .setTitle('🤠 Duelo a muerte')
                .setDescription('ℹ Se ve que nadie acciono el gatillo... todos pierden :)')
                .setColor('WHITE');

                interaction.editReply({ embeds: [Nadie], components: [] });
                setTimeout(async () => await interaction.deleteReply(), 5000);
            }
        })
            
            
   
            
        } else if (i.customId == 'No') {
            await interaction.editReply({embeds: [rechaza], components: []});
            collector.stop('no quiere jugar');
            
        }
    })
            
            collector.on("end", async (_collector, reason) => {
            if (reason === "time"){
                await interaction.editReply({embeds: [rechaza], components: []})
                setTimeout(async () => await interaction.deleteReply(), 5000);
            }
        });
            
            
        }
    }
}

module.exports = command;