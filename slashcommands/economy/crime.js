const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const add = require("../../helpers/add-money.js");
const remove = require("../../helpers/remove-money.js");
const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
const a = new CommandCooldown("crime", 600000)

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("crime")
    .setDescription("Comete un crimen para poder ganar dinero, ten cuidado, puede salir bien o puede salir mal!"),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    const userCooldowned = await a.getUser(interaction.member.id)
    if(userCooldowned){
        const timeLeft = msToMinutes(userCooldowned.msLeft);
        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(":x: Oh noooo!!!")
            .setDescription(`Ya usaste el comando!, debes esperar:`)
            .addField("Tiempo restante:", `${timeLeft.minutes} minutos y ${timeLeft.seconds} segundos`, true)
            .setColor("RED")
        ]})
    } else {

    const danger = ["win", "lose"];
    const crimes = ["asesinato", "robo", "atraco", "hacker", "homicidio calificado", "venta de pornografia infantil", "violación"];
    const random = danger[Math.floor(Math.random() * danger.length)];
    const randomCrime = crimes[Math.floor(Math.random() * crimes.length)];
    const randomMoney = Math.floor(Math.random() * 151);
    if(random == "win") {
        add(interaction.guild.id, interaction.user.id, randomMoney);

        const embedWin = new MessageEmbed()
            .setDescription(`**${interaction.user.username}** ha cometido el crimen: **${randomCrime}** y ganó \`${randomMoney}$\``)
            .setColor("GREEN")
            .setFooter({text: "La proxima puede salir mal!", iconURL: interaction.user.displayAvatarURL({ dynamic: true})})
            .setTimestamp();
        return interaction.reply({embeds: [embedWin]});
    } else
    if(random == "lose") {
            remove(interaction.guild.id, interaction.user.id, randomMoney);

            const embedLose = new MessageEmbed()
                .setDescription(`**${interaction.user.username}** ha cometido el crimen: **${randomCrime}** y lo atrapo la policia, perdió \`${randomMoney}$\``)
                .setColor("RED")
                .setFooter({text: "La proxima puede salir bien!", iconURL: interaction.user.displayAvatarURL({ dynamic: true})})
                .setTimestamp();
            return interaction.reply({embeds: [embedLose]});
        }
        await a.addUser(interaction.member.id)
     }
    }
}

module.exports = command;