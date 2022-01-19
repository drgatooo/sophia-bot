const { Client, Message, MessageEmbed } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'avatar',
    aliases: [],
    description: 'Obtén tu avatar o el de un usuario mencionado!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,
    uso: `avatar o avatar (@usuario)`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        let User = message.mentions.users.first();
            if(!User)
                {
                let Embed = new MessageEmbed()
                .setTitle('Tu avatar ' + message.author.username)
                .setColor("#00FFFF")
                .setImage(message.author.displayAvatarURL({size:4096, dynamic:true}));
                return message.channel.send({embeds: [Embed]});   
            }
            else
            {
                let Embed = new MessageEmbed()
                .setTitle('Avatar de ' + User.username)
                .setColor("#00FFFF")
                .setImage(User.avatarURL({size:4096, dynamic:true}));
                return message.channel.send({embeds: [Embed]});            
            }

    }
}

module.exports = command