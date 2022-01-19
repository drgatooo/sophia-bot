const { Client, Message, MessageEmbed } = require('discord.js')
const setPrefix = require('../../models/setprefix');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'setprefix',
    aliases: ['sp'],
    description: 'Establece un prefix en tu servidor.',
    userPerms: ['ADMINISTRATOR'],
    category: 'Configuration',
    args: true,
    premium: false,
    uso: `setprefix <nuevo prefix>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {try{

                const Error = new MessageEmbed()
                .setTitle('❌ Error')
                .setColor('RED')

                const establecido = new MessageEmbed()
                .setTitle('✅ Hecho!')
                .setDescription('Se ha establecido el prefix exitosamente en mi base de datos.')
                .setColor('GREEN')

                const actualizado = new MessageEmbed()
                .setTitle("✅ Hecho!")
                .setDescription("El prefix ha sido actualizado en mi base de datos.")
                .setColor("GREEN")
                
                let prefix = args[0]

                if(prefix.length > 3) {
                    Error.setDescription('No puedes establecer un prefix con mas de 3 caracteres.')
                    return message.reply({embeds: [Error]});
                }
        		if(require('../../helpers/hasEmoji.js')(prefix)) return message.reply('No puedes poner un emoji como prefix!');
                if(message.mentions.roles.first()) {
                    Error.setDescription(`No puedes establecer una mención como prefix, puede dar problemas.`)
                    return message.reply({embeds: [Error]});
                }

                const prefixset = await setPrefix.findOne({ ServerID: message.guild.id});

                if(!prefixset){
                    let setpre = new setPrefix({
                        ServerID: message.guild.id,
                        PrefixID: `${prefix}`
                    })
                    await setpre.save()
                    return message.reply({ embeds: [establecido]})
                }

                if(prefixset){
                    await setPrefix.updateOne({
                        ServerID: message.guild.id
                    },
					{
                        ServerID: message.guild.id,
                        PrefixID: `${prefix}`
                    })
                    return message.reply({ embeds: [actualizado] })
                }
        }catch(err){console.log(err)}
    }
}

module.exports = command