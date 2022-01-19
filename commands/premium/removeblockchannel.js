const { Client, Message, MessageEmbed } = require('discord.js')
const mongo = require('../../models/blacklist')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'removeblockchannel',
    aliases: ['rbc'],
    description: 'Quita el bloqueo a un usuario en un canal de tu servidor',
    userPerms: ['MANAGE_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Premium',
    premium: true,
    uso: `removeblockchannel @usuario #canal`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {try{

    let mencion = message.mentions.members.first() || message.guild.members.resolve(args[0])
        
    const e = new MessageEmbed()
    .setColor("RED")

    const yaexiste = new MessageEmbed()
    .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
    .addField("¡El usuario!", `${mencion.user} fue removido su bloqueo`) 
    .setColor("GREEN")

    if(!mencion) {
        e.setDescription("¡Menciona a quien quitarás de la blacklist!")
        return message.reply({embeds: [e]})
    }  

    let db = await mongo.findOne({userID: mencion.id})
    
    if(db) {
        mongo.remove({userID: mencion.id, id: db.id})
         return message.reply({ embeds: [yaexiste] }) 
    }

        }catch(err){console.log(err)}
    }
}

module.exports = command