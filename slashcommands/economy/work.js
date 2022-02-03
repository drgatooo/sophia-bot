const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const add = require("../../helpers/add-money.js");
const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
const a = new CommandCooldown("work", 240000)

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Trabaja para conseguir dinero."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(_, interaction){

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

        const randomMoney = Math.floor(Math.random() * (151 - 80) + 80);

        add(interaction.guild.id, interaction.user.id, randomMoney);

        const works = [
            "Carpintero", "Mecánico", "Lavandero",
            "Lechero", "Frutero", "Artesano",
            "Pescador", "Escultor"
            ];  
        const randomWork = works[Math.floor(Math.random() * works.length)];
        const embedSuccess = new MessageEmbed()
        .setDescription(`**${interaction.user.username}** ha trabajado de **${randomWork}** y ha ganado \`${Intl.NumberFormat().format(randomMoney)}$\``)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter("Suerte!");
        await interaction.reply({embeds: [embedSuccess]});
    }
        await a.addUser(interaction.member.id)
    }
}

module.exports = command;