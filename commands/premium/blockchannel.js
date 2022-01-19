const { Client, Message, MessageEmbed } = require('discord.js')
const mongo = require('../../models/blacklist')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'blockchannel',
    aliases: ['bc'],
    description: 'Bloquea a un usuario en un canal de tu servidor',
    userPerms: ['MANAGE_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Premium',
    premium: true,
    uso: `blockchannel @usuario #canal`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {try{

    let mencion = message.mentions.members.first() || message.guild.members.resolve(args[0])
    let mencionc = message.mentions.channels.first()
        
    const e = new MessageEmbed()
    .setColor("RED")

    const yaexiste = new MessageEmbed()
    .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
    .addField("¡El usuario!",`${mencion.user}`) 
    .addField("¡Ya esta en la blacklist, en el canal:!",`${mencionc}`)
    .setColor("RED")

    const agregado = new MessageEmbed()
    .setThumbnail(mencion.user.displayAvatarURL({dynamic: true}))
    .addField("¡El usuario!",`${mencion.user}`) 
    .addField("¡Fue agregado a la blacklist, en el canal:!",`${mencionc}`)
    .setColor("GREEN")


    if(!mencion) {
        e.setDescription("¡Menciona a quien agregaras a la blacklist!")
        return message.reply({embeds: [e]})
    }  

    if(!mencionc) {
        e.setDescription("¡Menciona el canal donde el Usuario no podra escribir!")
        return message.reply({embeds: [e]})
    }

    let db = await mongo.findOne({userID: mencion.id})
    
    if(db) { return message.reply({ embeds: [yaexiste] }) }

    if(!db){
        let nuevo = new mongo({
            userID: mencion.id,
            id: mencionc.id
        })
        nuevo.save()
    return message.reply({embeds: [agregado]})
}

        }catch(err){console.log(err)}
    }
}

module.exports = command