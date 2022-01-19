const { Client, Message, MessageEmbed } = require('discord.js')
const setMute = require('../../models/setmuterole');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'setmuterol',
    aliases: ['smr'],
    description: 'Establece un rol de mute en tu servidor.',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['MANAGE_ROLES'],
    category: 'Configuration',
    premium: false,
    uso: `setmuterol @rol`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

                const establecido = new MessageEmbed()
                .setTitle('✅ Hecho!')
                .setDescription('Se ha agregado el rol exitosamente.')
                .setColor('GREEN')

                const actualizado = new MessageEmbed()
                .setTitle("✅ Hecho!")
                .setDescription("El rol ha sido actualizado correctamente!.")
                .setColor("GREEN")
                
                const Error = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription("Inserta una ID o Menciona una rol.")
                .setColor('RED')
                if(!args[0]) return message.reply({embeds: [Error]})
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])                
                const muterol = await setMute.findOne({ ServerID: message.guild.id});
        
        		if (role.tags) {
                const NoTag = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription("El rol es de un bot.")
                .setColor('RED')
                    return message.reply({embeds: [NoTag]})
                }
        
                if(!role){ 
                return message.reply({ embeds: [Error] }) 
                }
        		role = role.id;

                if (!muterol) {
                    let rolmute = new setMute({
                        ServerID: message.guild.id,
                        RoleID: role
                    })
                    await rolmute.save()
                    return message.reply({embeds: [establecido]})
                }

                if(muterol){
                    let rolmute = new setMute({
                        ServerID: message.guild.id,
                        RoleID: role
                    })
                    await rolmute.save()
                    return message.reply({ embeds: [actualizado] })
                }
    }
}

module.exports = command