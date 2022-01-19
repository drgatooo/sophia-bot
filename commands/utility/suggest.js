const { Client, Message, MessageEmbed } = require('discord.js');
const schema = require('../../models/suggestions-model.js');
const moment = require('moment');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'suggest',
    aliases: ['sugerir'],
    description: 'Di una sugerencia',
    args: true,
    uso: '<sugerencia>',
    category: 'Utility',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {
        const err = new MessageEmbed()
        .setTitle(":x: Error")
        .setColor("RED");
        const enviada = new MessageEmbed()
        .setTitle("✔ Todo ha salido bien :)")
        .setDescription("Tu sugerencia ha sido enviada con exito.")
        .setColor("GREEN")
        
	const channel = await schema.findOne({guildid: message.guild.id});
  if(!channel || !client.channels.cache.get(channel.channelid)) {
      err.setDescription("No hay ningun de sugerencias para este servidor, o ha sido eliminado. (para solucionarlo escribe: `"+prefix+"set-suggest`)")
      return message.reply({embeds: [err]});
}
  const suggest = args.join(' ');
  const embedSuggest = new MessageEmbed()
  .setColor("#00FFFF")
  .setTitle("Nueva sugerencia")
  .addField("Autor", `\`${message.author.tag}\``, true)
  .addField("Fecha", `\`${moment(Date.now()).format('DD/MM/YYYY HH:mm A')}\``, true)
  .addField("Sugerencia", `\`${suggest}\``);

  message.guild.channels.cache.get(channel.channelid).send({ embeds: [embedSuggest]}).then(msg => {
    msg.react('✅');
    msg.react('❌');
  });
  message.reply({embeds: [enviada]});
    }
}

module.exports = command