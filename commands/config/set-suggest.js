const { MessageButton, MessageActionRow, Client, Message, MessageEmbed } = require('discord.js');
const schema = require('../../models/suggestions-model.js');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'set-suggest',
    aliases: ['establecer-canal-sugerencias', 'setsuggest'],
    description: 'Establece el canal de sugerencias',
    userPerms: ['MANAGE_CHANNELS'],
    category: 'Configuration',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
	const channel = message.mentions.channels.first();
  const results = await schema.findOne({guildid: message.guild.id});
  if(!channel || channel.type !== "GUILD_TEXT") return message.reply('Debes MENCIONAR un canal valido');
  if(!channel.viewable) return message.reply('debo tener permisos para ver y hablar en ese canal');
  if(results) {
    const accept = new MessageButton()
    .setLabel("continuar")
    .setCustomId("accept")
    .setStyle("SUCCESS");
    const cancel = new MessageButton()
    .setLabel("cancelar")
    .setCustomId("cancel")
    .setStyle("DANGER");
    let row = new MessageActionRow()
    .addComponents(accept, cancel);

    let sendmsg = await message.reply({content: 'Estas seguro de cambiar el canal de sugerencias?',components: [row]});
    const filter = b => b.user.id === message.author.id;
    const collector = sendmsg.channel.createMessageComponentCollector(filter, {time: 60000});
    collector.on('collect', async(b) => {
        if(b.user.id !== message.author.id) return b.reply({content: "Solo el que puso el comando puede modificar el rol de mute de este servidor!", ephemeral: true});
        if(b.message.id !== sendmsg.id) return;
        if(b.customId === "accept") {
            b.deferUpdate();
            await schema.updateOne({
                guildid: message.guild.id
            }, {
                guildid: message.guild.id,
                channelid: channel.id
            });
            b.message.delete();
            message.reply("Canal reestablecido correctamente.");
        };

        if(b.customId === "cancel") {
            b.deferUpdate();
            b.message.delete();
            return;
        };
    });
    return;
  };

  const newSuggestionChannel = new schema({
    guildid: message.guild.id,
    channelid: channel.id
  });

  await newSuggestionChannel.save().catch(err => console.log(err));
  return message.reply("canal establecido correctamente.");
    }
}

module.exports = command