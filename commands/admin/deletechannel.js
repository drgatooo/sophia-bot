const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'deletechannel',
    aliases: ['dchannel','nuke'],
    description: 'clona las caracteristicas del canal y elimina el otro.',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['MANAGE_CHANNELS'],
    category: 'Administration',
    premium: false,
    uso: "<#canal>",

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
        let canal = message.mentions.channels.first() || message.channel
        
        let posicion = canal.position
        
        
        let row = new MessageActionRow()
        .addComponents(
        new MessageButton()
            .setLabel('Si, estoy seguro')
            .setStyle('SECONDARY')
            .setCustomId('SI'),
            new MessageButton()
            .setLabel('No, me arrepiento')
            .setStyle('DANGER')
            .setCustomId('NO')
        )
        
        let confirmacion = new MessageEmbed()
        .setTitle('⚠ Atencion')
        .setDescription(`➡ Estas a punto de borrar ${canal}\nTodo el progreso que haya conseguido el canal, **⚠ se perdera ⚠**\nContinuas?`)
        .setColor('ORANGE')
        
        const m = await message.channel.send({embeds: [confirmacion], components: [row]})
        
        let iFilter = (i) => i.user.id === message.author.id;
        
        const offTime = new MessageEmbed()
    .setTitle('⏳ Error')
    .setColor('ORANGE')
    .setDescription('Error de tiempo, usa el comando nuevamente!')
        
        
    const collector = m.createMessageComponentCollector({
      filter: iFilter,
      time: 60000,
      errors:['time']
    })
    
    collector.on("collect", async (i) => {
        
        if (i.customId == 'SI'){
            if(!canal.deletable) return m.edit({ embeds: [
                new MessageEmbed()
                .setTitle(':x: Error')
                .setDescription('No puedo borrar o modificar ese canal actualmente, verifica que siga teniendo permisos!')
                .setColor('RED')
            ], components: []});
             let canalClonado = await canal.clone()
        
        
        
           canalClonado.setPosition(posicion)
            
                    canal.delete()
        
      	  
            
            let Embed = new MessageEmbed()
         .setTitle(":recycle: Canal eliminado correctamente!")
         .setImage("https://i.pinimg.com/originals/01/82/5e/01825e981b49caaa693395ca637376db.gif")
         .setColor("#00FFFF");
           
            
            if (canalClonado.type == 'GUILD_TEXT'){
                await canalClonado.send({embeds: [Embed]})
            }
            
   
    
            if (canalClonado.type == 'voice'){
                message.edit({embeds: [Embed]})
            }
        
        
        }
        
        if (i.customId == 'NO'){
            const exit = new MessageEmbed()
    .setTitle('⬅ Saliendo')
    .setColor('WHITE')
    .setDescription('Este mensaje será eliminado.')
            m.edit({ embeds: [exit], components: []})
        setTimeout(() => m.delete(), 5000)
        }
        
    })

        
         collector.on("end", (_collector, reason) => {
             if (reason === "time"){
                 m.edit({embeds: [offTime], components: []})
                setTimeout(() => m.delete(), 5000)
             }
         })
        
       
        
        
        
        
        
        

    }
}

module.exports = command

