const { Client, Message } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'love',
    aliases: ['ship'],
    description: 'Verifica que tan compatible eres con un usuario',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,
    uso: `love (@usuario)`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        const porcentaje = Math.floor(Math.random()*101)

        let descripcion;
        let emoji;

        if(porcentaje <= 23){
        descripcion = `** ${porcentaje}% |  ** Nisiquiera debieron conocerse, los 2 no son compatibles y son muy diferentes`
        }

        if(porcentaje > 23 && porcentaje <= 47){
        descripcion = `** ${porcentaje}% | ** Podrian ser amigos, pero no veo un futuro mayor entre ellos, tienen algunos gustos similares`
        }

        if(porcentaje > 47 && porcentaje <= 80){
        descripcion = `** ${porcentaje}% | ** Podrian ser una pareja, los gustos son casi iguales y saben mucho uno del otro`
        }

        if(porcentaje > 80){
        descripcion = `** ${porcentaje}% | ** Serian una exelente pareja, pueden llegar a casarse algun dia, los gustos son iguales y se llevan muy bien`
        }


        const avatar1 = message.author.displayAvatarURL()
        const mencion = message.mentions.users.first()
        if(!mencion) return message.channel.send(`**${message.author.username}**, Debes mencionar a alguien.`)
        if(mencion === message.author) return message.channel.send("Menciona a otra persona, mucho amor propio.")
        const avatar2 = mencion.displayAvatarURL()

        

        message.channel.send({content: `${descripcion}`, files: [avatar1, avatar2] })

    }
}

module.exports = command