const { Client, Message, MessageEmbed } = require('discord.js')

const premiumGuild = require('../../models/premiumGuild')



/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'addpremiumguild',
    aliases: ['addpg','premiumadd'],
    description: 'adds a server id to the database',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Owner',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        let server = args[0]

        // Data-base

        const premium = await premiumGuild.findOne({ ServerID: server});

        if (!server) {
            let sayServer = new MessageEmbed()
            .setTitle('❌ Error')
            .setDescription("Insert an ID")
            .setColor('RED')
            return message.reply({embeds: [sayServer]})
        }

        if (!client.guilds.cache.has(server)) {
            let noServer = new MessageEmbed()
            .setTitle('❌ Error')
            .setDescription("server not found")
            .setColor('RED')
            return message.reply({embeds: [noServer]})
        }

        if (!premium) {
            let pg = new premiumGuild({
                ServerID: message.guild.id
            })
            await pg.save()

            let pgembed = new MessageEmbed()
            .setTitle('✅ Success')
            .setDescription('Server was added successfully')
            .setColor('GREEN')

            return message.reply({embeds: [pgembed]})

        } else {

            let pgyet = new MessageEmbed()
            .setTitle('⚠ Warning')
            .setDescription('the server was already added')
            .setColor('ORANGE')

            return message.reply({embeds: [pgyet]})
        }

        



    }
}

module.exports = command