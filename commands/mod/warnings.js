const { Client, Message, MessageEmbed } = require('discord.js');
const schema = require('../../models/warn-model.js');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'warnings',
    aliases: ['warns'],
    description: 'Revisa los warnings de un usuario',
    category: 'Moderation',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
    const noPosible = new MessageEmbed()
    .setTitle('❌ Error')
    .setColor('RED')
        
       
        
	const mention = message.mentions.members.first() || message.member;
    const guildId = message.guild.id;
    const userId = mention.id;
                
         let warns = new MessageEmbed()
        .setTitle(`⚠ Advertencias de ${mention.user.username}`)
        .setThumbnail(mention.user.displayAvatarURL({dynamic: true}))

        .setColor('YELLOW')

         
    if(userId === client.user.id) return message.reply({embeds: [noPosible.setDescription('ℹ No puedo tener warns!')]});
    if (mention.bot) return message.reply({embeds: [noPosible.setDescription('ℹ Los bots no pueden tener warns!')]});
        const results = await schema.findOne({
            guildId,
            userId
        });
        if(!results) return message.reply({embeds: [noPosible.setDescription('ℹ Este usuario no tiene warns!')]});
        if(!results.warnings[0]) return message.reply({embeds: [noPosible.setDescription('ℹ Este usuario no tiene warns!')]});
            message.reply({embeds: [warns
                .setDescription(
                    results.warnings.map((w, i) => 
                    `\n**#${i+1}**\n📕 Razon:\n${w.reason}\n💂‍♂️ Ejecutor del warn:\n<@${w.author}>\n⌚ Hace: <t:${Math.round(w.timestamp / 1000)}:R>\n---------------`
                ).join(""))
        ]});
    }
}

module.exports = command