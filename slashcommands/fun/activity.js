const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js')
require('moment').locale('es');

module.exports = {
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("activity")
    .setDescription("inicia una actividad de discord-together.")
    .addStringOption(o =>
      o.setName('actividad')
      .setRequired(true)
      .setDescription('Elije una actividad')
      .addChoice('youtube', 'youtube')
      .addChoice('poker', 'poker')
      .addChoice('chess', 'chess')
      .addChoice('betrayal', 'betrayal')
      .addChoice('lettertile', 'lettertile')
    ),

    async run(client, interaction){
        function error(msg){
            return interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription(msg)
                .setColor('RED')
            ], ephemeral: true});
        }
        if(!interaction.member.voice.channel) return error('Debes ejecutar este comando en un canal de voz!');
        const embedActivity = new MessageEmbed();
         client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, interaction.options.getString('actividad'), interaction).then(async invite => {
                        if(invite.code == "https://discord.com/invite/50013") embedActivity.setDescription('No se pudo crear la invitación, verifica que tenga permisos de ver el canal y crear invitaciones en ese canal de voz!').setColor('RED').setTitle(":x: Error");
                            else embedActivity.setDescription(`**Presiona [aquí](${invite.code}) para iniciar la actividad**`).setColor('GREEN');
                        await interaction.reply({embeds: [embedActivity]});
          });
    }
}