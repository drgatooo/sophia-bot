const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['MANAGE_CHANNELS'],
    category: 'Administración',
    data: new SlashCommandBuilder()
    .setName("deletechannel")
    .setDescription("Nukea o reinicia un canal de tu servidor con 0 mensajes.")
    .addChannelOption(o => o.setName("canal").setDescription("Menciona el canal a nukear.").setRequired(true)),

    async run(client, interaction){

        let canal = interaction.options.getChannel("canal");
        let posicion = canal.position;
        
        
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
        );
        
        let confirmacion = new MessageEmbed()
        .setTitle('⚠ Atencion')
        .setDescription(`➡ Estas a punto de borrar ${canal}\nTodo el progreso que haya conseguido el canal, **⚠ se perdera ⚠**\nContinuas?`)
        .setColor('ORANGE');
        
        const m = await interaction.reply({embeds: [confirmacion], components: [row]});
        
        let iFilter = (i) => i.user.id === interaction.user.id; 
        const collector = interaction.channel.createMessageComponentCollector({ filter: iFilter, time: 30000})
        collector.on("collect", async (i) => { 
            if (i.customId == 'SI'){
                if(!canal.deletable) return m.editReply({ embeds: [
                    new MessageEmbed()
                    .setTitle(':x: Error')
                    .setDescription('No puedo borrar o modificar ese canal actualmente, verifica que siga teniendo permisos!')
                    .setColor('RED')
                ], components: []});
                let canalClonado = await canal.clone();
            
            
            
            canalClonado.setPosition(posicion);
                
                        canal.delete();
            
            
                
                let Embed = new MessageEmbed()
            .setTitle(":recycle: Canal eliminado correctamente!")
            .setImage("https://i.pinimg.com/originals/01/82/5e/01825e981b49caaa693395ca637376db.gif")
            .setColor("#00FFFF");
            
                
                if (canalClonado.type == 'GUILD_TEXT'){
                    await canalClonado.send({embeds: [Embed]});
                }
                
    
        
                if (canalClonado.type == 'GUILD_VOICE'){
                    interaction.editReply({embeds: [Embed]});
                }
            
            
            }
            
            if (i.customId == 'NO'){
                const exit = new MessageEmbed()
        .setTitle('⬅ Saliendo')
        .setColor('WHITE')
        .setDescription('Este mensaje será eliminado.');
                m.editReply({ embeds: [exit], components: []});
            setTimeout(() => m.delete(), 5000);
            }
            
        });
            
            collector.on("end", (_collector, reason) => {
                if (reason === "time"){
                    m.editReply({embeds: [offTime], components: []});
                    setTimeout(() => m.delete(), 5000);
                }
            });
    }
}