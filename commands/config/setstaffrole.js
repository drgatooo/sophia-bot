// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS
// ESTE NO LO HAGAS


const { Client, Message, MessageEmbed } = require('discord.js')
const staffroleModel = require("../../models/setstaffrole")
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'setstaffrol',
    aliases: ['ssr'],
    description: 'Establece el rol staff de tu servidor.',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Configuration',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

                let role = message.mentions.roles.first()
        		
                // Data-base
        
                const rolstaff = await staffroleModel.findOne({ ServerID: message.guild.id});
        
        		if (role.tags) {
                    const NoTag = new MessageEmbed()
                	.setTitle('❌ Error')
                	.setDescription("El rol es de un bot.")
                	.setColor('RED')
                    return message.reply({embeds: [NoTag]})
                }
        
                if (!role) {
                    let errorServer = new MessageEmbed()
                    .setTitle('❌ Error')
                    .setDescription("Menciona un Rol")
                    .setColor('RED')
                    return message.reply({embeds: [errorServer]})
                }
        
                if (!rolstaff) {
                    let staff = new staffroleModel({
                        ServerID: message.guild.id,
                        RoleID: role.id
                    })
                    await staff.save()
        
                    let Staffok = new MessageEmbed()
                    .setTitle('✅ Hecho!')
                    .setDescription('Se ha agregado el rol exitosamente.')
                    .setColor('GREEN')
        
                    return message.reply({embeds: [Staffok]})
        
                }
                if(role) {
        
                    let staffyaesta = new MessageEmbed()
                    .setTitle('⚠ Advertencia!')
                    .setDescription('Este servidor ya cuenta con un rol staff establecido!')
                    .setColor('ORANGE')
        
                    return message.reply({embeds: [staffyaesta]})
                }
    }
}

module.exports = command