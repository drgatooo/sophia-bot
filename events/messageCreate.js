const { MessageEmbed, MessageButton, MessageActionRow, Collection } = require("discord.js");
const client = require("../index.js");
const fs = require("fs");
const toml = require("toml");
const schemaAntispamMsgs = require('../models/antispamMsgs.js');
const ignore = require("../models/ignorerol")
let sumcomm = 0

const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"))




const owner = config.owner;
const antilinksModel = require("../models/antilinks");
const premium = require("../models/premiumGuild");
const antispamdb = require("../models/antispam.js");

let linkRegex = new RegExp(
/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g
);

let discordInvite = new RegExp(
/discord\.gg\/.[a-zA-Z0-9()]{1,256}/g
)

client.on("messageCreate", async (message) => {
  
if (message.channel.type == 'DM') return
// limit messages
const rolignored = await ignore.findOne({ServerID: message.guild.id})
const antispamR = await antispamdb.findOne({ServerID: message.guild.id});
if(!rolignored) { return } else rol = rolignored.RoleID

if(antispamR){
  if(message.member.roles.cache.has(rol)){
    return;
  } else {
    const msgsResults = await schemaAntispamMsgs.findOne({user: message.author.id});
    if(!msgsResults) {
        const schemaCreate = new schemaAntispamMsgs({user: message.author.id,msgs: 0});await schemaCreate.save();
    } else {
        await schemaAntispamMsgs.updateOne({user:message.author.id}, {msgs: parseInt(msgsResults.msgs) + 1});
        if(msgsResults.msgs >= 5) {
        await message.delete();
        message.channel.send('**'+message.author.username+'** espera 5 segundos para poder volver enviar mas mensajes').then(msg => setTimeout(() => msg.delete(), 5000));
    }
    }
    
    setTimeout(async () => {
        await schemaAntispamMsgs.deleteOne({user: message.author.id});
    }, 5000);
    if(message.mentions.users.size > 3 && !message.author.bot) {
       await message.delete();
       message.channel.send('**'+message.author.username+'** no puedes mencionar mas de 3 usuarios a la vez.');
    }
  }
}
 
    let mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`)
        
    if(message.content.match(mentionRegex) && !message.author.bot) {
    
      let embedMention = new MessageEmbed()
      .setTitle('ℹ Sophia llegando!')
      .setDescription(`👋 Hola <@${message.author.id}> , Acá tienes información acerca de mí en este servidor!\n✏ Mi prefix es : **/** \n💡 Si tienes alguna duda sobre algún comando, puedes usar **/help**`)
      .setColor('WHITE')
      message.reply({embeds: [embedMention]});
        
    }
    
  const premiumGuild = await premium.findOne({ ServerID: message.guild.id });
  const anti = await antilinksModel.findOne({ ServerID: message.guild.id });
  if (message.author.bot) return;
  
  
  if (anti) {
    if ((message.content.match(linkRegex) || message.content.match(discordInvite)) && !owner.includes(message.author.id) || (message.content.match(linkRegex) || message.content.match(discordInvite)) && message.author.id !== message.guild.ownerId) {
      if(message.member.roles.cache.has(rol)){
        return;
      } else {
      message.delete();
      try{
        message.author.send({ content: `👋 Hola ${message.author.username}! Desafortunadamente **${message.guild.name}** tiene mi anti-links activado, se más cuidadoso la próxima!`})
      } catch {
        message.channel.send({ content: `👋 Hola ${message.author.username}! Desafortunadamente **${message.guild.name}** tiene mi anti-links activado, se más cuidadoso la próxima!`}).then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 4000)
        })
      }
      
      }
    }
  }
  if (!message.guild) return;  
});
