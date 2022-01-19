const { Client, Message, MessageEmbed } = require('discord.js')

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: '8ball',
    aliases: [],
    description: 'Realiza una pregunta y el bot te dara una respuesta!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,
    uso: `<pregunta>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        const respuesta = ["Si.", "No.", "Tal vez.", "Puede ser.", "No en absoluto.", "Puede que no sea lo mejor.", "Puede que si sea lo mejor.", "Mejor pregunta otra cosa.", "¿Alguien quiere pan?", "Mmmmm... regular.", "Eso no se pregunta...", "No lo se, dimelo tu."]

        let razon = args.slice(0).join(" ");
        if(!razon) return message.reply({content: "Escribe la pregunta que deseas realizar."});
        
        let embed = new MessageEmbed()
        .setTitle("8Ball :8ball:")
        .setDescription
        (
            "➡ ***Tu pregunta es:***" + "\n" +
            `${razon}` + "\n" +
            "👀 *Mi respuesta a la pregunta es:* \n" + 
            `||`+respuesta[Math.floor(Math.random() * respuesta.length)]+`||`,
        )
        .setColor("#00FFFF");
        message.channel.send({embeds: [embed] })

    }
}

module.exports = command