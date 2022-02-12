const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js'); 
require('moment').locale('es');

module.exports = {
    isMaintenance: true,
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("revisa la información de un anime")
    .addStringOption(o => o.setName('anime').setDescription('nombre del anime').setRequired(true)),
    async run(_, interaction){
        const name = interaction.options.getString('anime').split(/ +/).join('%20');
        const response = await require('node-fetch')('https://kitsu.io/api/edge/anime?filter[text]='+name)
        const json = await response.json();
        
        //   .then(async json => {
            if(!json.data || json.data.length === 0) return await interaction.reply({ embeds: [
                new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(':x: No se encontró ningún anime con ese nombre')
            ], ephemeral: true });
            // translate(json.data[0].attributes.synopsis, {to: 'ES'}).then(res => {
              //     translate(json.data[0].attributes.status, {to: 'ES'}).then(res1 => {
              // const res = await translate(json.data[0].attributes.synopsis, {from: 'en',to: 'es'});
              // const res1 = await translate(json.data[0].attributes.status, {from: 'en',to: 'es'});
              const embedSuccess = new MessageEmbed()
              .setTitle(json.data[0].attributes.canonicalTitle)
              .setColor('GREEN')
              .setDescription(json.data[0].attributes.synopsis.replace("[]", "ㅤ"))
              .addFields(
                  {
                      name: "Mostrado en",
                      value: json.data[0].attributes.showType.toString(),
                      inline: true
                  },
                  {
                      name: "Estado",
                      value: json.data[0].attributes.status,
                      inline: true
                  },
                  {
                      name: "Año de estreno",
                      value: require('moment')(json.data[0].attributes.startDate).format('YYYY').toString(),
                      inline: true
                  },
                  {
                      name: "Episodios",
                      value: json.data[0].attributes.episodeCount ? json.data[0].attributes.episodeCount.toString() : 'N/A',
                      inline: true
                  },
                  {
                      name: "Duración",
                      value: json.data[0].attributes.episodeLength.toString() + " minutos por episodio.",
                      inline: true	
                  },
                  {
                      name: "Kanji",
                      value: json.data[0].attributes.titles.ja_jp,
                      inline: true
                  },
                  {
                      name: "Generos",
                      value: "en proceso"
                  }
              )
              .setThumbnail(json.data[0].attributes.posterImage.tiny)
              .setTimestamp();
        //   });
      //   });
      // });
      return await interaction.reply({embeds: [embedSuccess]});
    }
}