const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js-light");
const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
const a = new CommandCooldown("dado", 60000)

/**
* @type {import('../../types/typeslash').Command}
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
        const userCooldowned = await a.getUser(interaction.member.id)
    if(userCooldowned){
        const timeLeft = msToMinutes(userCooldowned.msLeft);
        const error = new MessageEmbed()
            .setTitle(":x: Oh noooo!!!")
            .setDescription(`Ya usaste el comando!, debes esperar:`)
            .setColor("RED")
        if(timeLeft.hours >= 1){
            error.addField("Tiempo restante:", `${timeLeft.hours} horas`, true)
        }
        if(timeLeft.hours == 0){
            error.addField("Tiempo restante:", `${timeLeft.minutes} minutos, ${timeLeft.seconds} segundos.`, true)
        }
        interaction.reply({embeds: [error]})
    } else {

        const caras = 12 
        num = Math.floor(Math.random() * (caras))
        
        const embed = new MessageEmbed()
        .setTitle(`:game_die: :game_die: Has tirado los dados :game_die: :game_die:`)
        .setDescription("Esperemos el número!!")
        .setColor("WHITE")
        
        interaction.reply({embeds: [embed]}).then(() => {
                if(num === 7){
                    setTimeout(() => {
                        const add = require("../../helpers/add-money");
                        add(interaction.guild.id, interaction.user.id, 7000)
                        interaction.editReply({embeds: [embed.addField(`JACKPOT! has sacado:`, `**${num}**`, true).addField("WOW!!!!", `Has recibido \`7.000$\` en tu balance por sacar el numero 7, guardalo lo antes posible!`)]})
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
        await a.addUser(interaction.user.id)
    }
}

module.exports = command;