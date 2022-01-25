const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const add = require('../../helpers/add-money.js');
const remove = require('../../helpers/remove-money.js');
const schema = require('../../models/economy-model.js');
const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
const a = new CommandCooldown("rob", 28800000)

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Roba dinero a un usuario!!!")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a robar!").setRequired(true)),

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

        const err = new MessageEmbed().setTitle(":x: Error").setColor("RED")

        const mention = interaction.options.getUser("usuario");
        if(mention === interaction.user.id) {
            err.setDescription("ℹ Debes mencionar a un usuario valido!")
            return interaction.reply({embeds: [err], ephemeral: true})
        }
        if(mention.bot) {
            err.setDescription("ℹ No puedes robar a un bot.")
            return interaction.reply({embeds: [err], ephemeral: true})
        }

        const results = await schema.findOne({
            guildid: interaction.guild.id, 
            userid: mention.id
        });

        if(!results || results.money < 1) {
            err.setDescription("ℹ Este usuario no tiene dinero en su cartera.")
            return interaction.reply({embeds: [err], ephemeral: true})
        }

        const randomMoney = Math.floor(Math.random() * results.money) +1;
        add(interaction.guild.id, interaction.user.id, randomMoney);
        remove(interaction.guild.id, mention.id, randomMoney);
        
        const embedSuccess = new MessageEmbed()
            .setDescription(`**${interaction.user.username}** ha robado \`${randomMoney}$\` ha **${mention.username}**`)
            .setColor('RED')
            .setFooter({text: `${mention.username} asegurate de siempre guardarlo en el banco...`})
            .setTimestamp();
        interaction.reply({embeds: [embedSuccess]});

    }
        await a.addUser(interaction.member.id)
    }
}

module.exports = command;