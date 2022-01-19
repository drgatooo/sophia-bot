const { Client, Message, MessageEmbed } = require('discord.js')

const premiumGuild = require('../../models/premiumGuild')



/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'removepremiumguild',
    aliases: ['rempg','premiumrem'],
    description: 'removes a server id to the database',
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

            let pgno = new MessageEmbed()
            .setTitle('⚠ Warning')
            .setDescription('the server is not registered as premium')
            .setColor('ORANGE')

            return message.reply({embeds: [pgno]})

        } else {

            await premiumGuild.findOneAndDelete({ServerID: server})

            let pgyet = new MessageEmbed()
            .setTitle('✅ Success')
            .setDescription('the server was deleted')
            .setColor('GREEN')

            return message.reply({embeds: [pgyet]})
        }

        



    }
}

module.exports = command