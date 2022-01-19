const { Client, Message, MessageEmbed } = require('discord.js');
const schema = require("../../models/warn-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'warn',
    aliases: ['warnear'],
    userPerms: ['KICK_MEMBERS'],
    description: 'advierte a un usuario',
    category: 'Moderation',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
    let noPosible = new MessageEmbed()
    .setTitle('❌ Error')
    .setDescription('ℹ No puedes warnearte a vos mismo')
    .setColor('RED')
        
        
        
    let user = message.mentions.members.first();
    if(!user) return message.reply({embeds: [noPosible.setDescription('ℹ Menciona a un usuario por favor')]});
    if(user.user.id === message.author.id) message.reply({embeds: [noPosible]});
    if(user.user.id === client.user.id) return message.reply({embeds: [noPosible.setDescription('ℹ No puedo warnearme a mi misma')]});
    if(user.user.bot) return message.reply({embeds: [noPosible.setDescription('ℹ No puedo warnear a un bot')]});
    if (message.member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return message.reply({embeds: [noPosible.setDescription('ℹ No puedes warnear a alguien con mayor o igual rol que tu.')]});
    
        const guildId = message.guild.id;
        const userId = user.user.id;
        let reason = args.slice(1).join(" ");
        if(reason.length > 51) return message.reply({embeds: [noPosible.setDescription('ℹ Solo puedes poner 51 caracteres!')]});
        if(!reason) reason = "Sin especificar";
    
        const warning = {
            author: message.member.id,
            timestamp: new Date().getTime(),
            reason
        };
            try {
       await schema.findOneAndUpdate({
           guildId,
           userId
       }, {
           guildId,
           userId,
           $push: {
               warnings: warning
           }
       }, {
           upsert: true
       });
            } catch (err) {
                message.reply("Hubo un error inesperado, espera a que lo solucionemos! (ya fue enviado a mis creadores)");
                console.log(err.stack);
            }
        const embedSuccess = new MessageEmbed()
        .setTitle('⚠ Warns')
        .addField('👤 Usuario warneado:',`${user}`,true)
        .addField('👮‍♂️ Staff a cargo:', `<@${message.author.id}>`,true)
        .addField('📕 Razon:',`\`\`\`${reason}\`\`\``)
        .setColor("ORANGE");
        const embedUser = new MessageEmbed()
        .setTitle("🔔 Te han warneado!")
        .addField('🏛 Servidor:',`${message.guild.name}`,true)
        .addField('👮‍♂️ Staff a cargo:', `<@${message.author.id}>`,true)
        .addField('📕 Razon:',`\`\`\`${reason}\`\`\``)
        .setFooter("Comportate bien!")
        .setColor("RED")
        .setTimestamp();
        message.reply({embeds: [embedSuccess]});
        user.send({embeds: [embedUser]}).catch(err=>{});
    }
}

module.exports = command