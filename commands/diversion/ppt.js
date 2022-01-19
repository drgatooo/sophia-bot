const ppt = require('../../helpers/PPT.js')
const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'ppt',
    aliases: ['rps'],
    description: 'Juega Piedra - Papel - Tijera con tus amigos!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Diversion',
    premium: false,
    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        const game = new ppt()
                    let button1
            let button2
            let yajugoplayer1 = false
            let yajugoplayer2 = false
        
        let secondPlayer = message.mentions.members.first()
        
        if (!secondPlayer) return
        
        let row = new MessageActionRow()
        .addComponents(        	
            new MessageButton()
            .setCustomId("rock")
            .setEmoji('⚫')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("paper")
            .setEmoji('🧻')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("scissors")
            .setEmoji('✂')
            .setStyle('SECONDARY')
        )
        
        let ingame = new MessageEmbed()
        .setTitle('🎲 Piedra - Papel - Tijera')
        .setDescription('Elijan bien!')
        .setColor('WHITE')
        
        let toReply = await message.reply({embeds: [ingame], components: [row]})
        const inGame = (i) => i.user.id === message.author.id || i.user.id == secondPlayer.id;
        const collector = toReply.createMessageComponentCollector({
            filter: inGame,
            time: 30000,
            componentType: "BUTTON"
        })
        
        collector.on('collect', async (i) => {

            if (i.member.id == secondPlayer.id && yajugoplayer2 == false) {
                button1 = i.customId
                yajugoplayer2 = true
            } else if (i.member.id == message.author.id && yajugoplayer1 == false) {
                button1 = i.customId
                yajugoplayer1 = true
            }
            if (i.member.id == secondPlayer.id && yajugoplayer2 == true) {
                await i.reply({content: "Ya elegiste!", ephemeral: true})
            } else if (i.member.id == secondPlayer.id && yajugoplayer2 == false) {
                button2 = i.customId
            } else if (i.member.id == message.author.id && yajugoplayer1 == true) {
                await i.reply({content: "Ya elegiste!", ephemeral: true})
            } else if (i.member.id == message.author.id && yajugoplayer1 == false) {
                button2 = i.customId
            }
           
            
            console.log(button1+'\n')
            console.log(button2)
        })
        
    }
}

module.exports = command