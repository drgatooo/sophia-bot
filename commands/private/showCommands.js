const { Client, Message, MessageEmbed } = require('discord.js')

const commands = require('../../events/messageCreate')

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'showcommands',
    aliases: ['commandspreview'],
    description: 'testing',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Owner',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
        
        let embed = new MessageEmbed()
        .setTitle(`Commands`)
        .setDescription(`${client.commands.map(x => x.name).join('\n')}`)
        
        
        message.channel.send({embeds: [embed]})

    }
}

module.exports = command