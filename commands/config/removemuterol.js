const { Client, Message, MessageEmbed } = require('discord.js')
const setMute = require('../../models/setmuterole');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'removemuterol',
    aliases: ['rmr'],
    description: 'Elimina el rol de mute en tu servidor.',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['MANAGE_CHANNELS', `SEND_MESSAGES`],
    category: 'Configuration',
    premium: false,
    uso: `removemuterol @rol-establecido`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {try{

                const deleted = new MessageEmbed()
                .setTitle("✅ Hecho!")
                .setDescription("El rol ha sido eliminado.")
                .setColor("GREEN")
                
                let role = message.mentions.roles.first().id || client.guild.roles.cache.get(args[0])
                const muterol = await setMute.findOne({ ServerID: message.guild.id});
        
                if(role !== muterol.RoleID){ 
                const Error = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription("El rol que intentas remover no es el que esta asignado.")
                .setColor('RED')
                
                return message.reply({ embeds: [Error] }) 
                }

                if(muterol){
                    await setMute.remove({
                          ServerID: message.guild.id,
                          RoleID: role
                    })
                    return message.reply({ embeds: [deleted] })
                }
        } catch(err) {console.log(err)}
    }
}

module.exports = command