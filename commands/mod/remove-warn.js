const { Client, Message, MessageEmbed } = require('discord.js');
const schema = require("../../models/warn-model.js");

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'remove-warn',
    aliases: ['removewarn', 'unwarn'],
    description: 'Elimina un warning de un usuario',
    userPerms: ['KICK_MEMBERS'],
    args: true,
    uso: '<usuario> <numero del warning>',
    category: 'Moderation',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
    let noPosible = new MessageEmbed()
    .setTitle('❌ Error')
    .setColor('RED')

	  const mention = message.mentions.members.first();
      if(!mention) return message.reply({embeds: [noPosible.setDescription('ℹ Ingresa un usuario valido')]});
      const Results = await schema.findOne({guildId: message.guild.id, userId: mention.user.id});
      if(Results && Results.warnings.length <= 0) await schema.deleteOne({guildId: message.guild.id, userId: mention.user.id});
  	  schema.findOne({ guildId: message.guild.id, userId: mention.user.id}, async (err, results) => {
      if(err) throw err;
      if(results) {
          	if (args[1] < 0) return message.reply({embeds: [noPosible.setDescription('ℹ Ingresa un numero mayor a `0` !')]});
        	if(isNaN(args[1])) return message.reply({embeds: [noPosible.setDescription('ℹ Ingresa un numero!')]});
        	let number = parseInt(args[1]) - 1;
        	if(results.warnings.length < number) return message.reply({embeds: [noPosible.setDescription(`ℹ El usuario solo cuenta con \`${results.warnings.length}\` Advertencias!`)]});
          
          let { reason } = await results.warnings[number]
          let { author } = await results.warnings[number]
          
          	let Posible = new MessageEmbed()
        .setTitle('✅ Advertencia removida')
        .addField('👤 Usuario:',`${mention}`,true)
        .addField('👮‍♂️ Staff a cargo:',`<@${message.author.id}>`,true)
        .addField('💂‍♂️ Ejecutor del warn:',`<@${author}>`,true)
        .addField('📕 Motivo del warn:',`\`\`\`${reason}\`\`\``)
        .setColor('GREEN')
        	message.reply({embeds: [Posible]});
        	results.warnings.splice(number, 1);
        	results.save();
          return
    } else {
        return message.reply({embeds: [noPosible.setDescription('ℹ El usuario no cuenta con advertencias.')]});
    }
  });
    }
}

module.exports = command