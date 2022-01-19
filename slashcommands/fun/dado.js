const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {
    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Diversión",


    data: new SlashCommandBuilder()
    .setName("dado")
    .setDescription("Tira el dado y ve tu suerte!"),
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
        const caras = 12 
        num = Math.floor(Math.random() * (caras))
        console.log(num)
        
        const embed = new MessageEmbed()
        .setTitle(`:game_die: :game_die: Has tirado los dados :game_die: :game_die:`)
        .setDescription("Esperemos el número!!")
        .setColor("WHITE")
        
        interaction.reply({embeds: [embed]}).then(() => {
                if(num === 7){
                    setTimeout(() => {
                        interaction.editReply({embeds: [embed.addField(`JACKPOT! has sacado:`, `**${num}**`, true)]})
                    }, 3000)
                } else if(num > 7){
                    setTimeout(() => {
                        interaction.editReply({embeds: [embed.addField(`Felicidades! has sacado:`, `**${num}**`, true)]})
                    }, 3000)
                } else if(num === caras){
                    setTimeout(() => {
                        interaction.editReply({embeds: [embed.addField(`Vaya, has sacado el mismo numero de posibilidad`, `**${caras}**`, true)]})
                    }, 3000)
                } else if(num === 0){
                    setTimeout(() => {
                        interaction.editReply({embeds: [embed.addField(`Vaya, has sacado`, `**${num}**, F en el chat`, true)]})
                    }, 3000)
                } else if(num <= 6){
                    setTimeout(() => {
                        interaction.editReply({embeds: [embed.addField(`Vaya, has sacado`, `**${num}**`, true)]})
                    }, 3000)
                }
        })
        
    }
}

module.exports = command;