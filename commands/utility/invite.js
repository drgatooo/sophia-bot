const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'invite',
    aliases: ['invitar'],
    description: 'Invita el bot a tu servidor',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Utility',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        let gracias = new MessageEmbed()
        .setTitle("Gracias por invitarme!")
        .setDescription(`Gracias ${message.author} agradezco la oportunidad de estar en tu servidor :heart:\n\Nos vemos en el!`)
        .setTimestamp(new Date())
        .setColor("#00FFFF")
        
        let row = new MessageActionRow().addComponents(
            new MessageButton()
            .setLabel("Invitación")
            .setStyle("LINK")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=864930156857786388&permissions=8&scope=applications.commands%20bot")
        )

        message.reply({embeds: [gracias], components: [row] })

    }
}

module.exports = command