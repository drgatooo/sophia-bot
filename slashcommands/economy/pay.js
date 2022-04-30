const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require('../../models/economy-model.js');
const add = require('../../helpers/add-money.js');
const remove = require('../../helpers/remove-money.js');

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Dale dinero o paga una deuda a un usuario!")
    .addUserOption(o => o.setName("usuario").setDescription("Revisa el inventario de otro usuario, se curioso! jeje").setRequired(true))
    .addIntegerOption(o => o.setName("cantidad").setDescription("Cantidad a pagar.").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const err = new MessageEmbed()
        .setTitle(":x: Error").setColor("RED")
        const exi = new MessageEmbed()
        .setTitle("✅ Todo ha salido bien!").setColor("GREEN")

        const mention = interaction.options.getUser("usuario");
        if(mention.bot) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("Los bots no son parte de la economía.").setColor("RED")], ephemeral: true})
        if(mention === interaction.user.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("no te puedes auto pagar, es absurdo :).").setColor("RED")], ephemeral: true})
        
        const amount = interaction.options.getInteger("cantidad");
        
        if(amount < 1 || !Number.isInteger(amount)) {
            err.setDescription('Debes espcicificar una cantidad mayor a 1.')
            return interaction.reply({ embeds: [err], ephemeral: true });
        }
        const dbUser = await schema.findOne({ 
            guildid: interaction.guild.id, 
            userid: interaction.user.id 
        });
        
        if(!dbUser || !dbUser.money || dbUser.money < amount) {
            err.setDescription('No tienes dinero ese dinero.')
            return interaction.reply({ embeds: [err], ephemeral: true });
        }

        add(interaction.guild.id, mention.id, amount); 
        remove(interaction.guild.id, interaction.user.id, amount);
        exi.setDescription(`Has pagado \`${amount}$\` a **${mention.username}**`)
        interaction.reply({embeds: [exi]});

    }
}

module.exports = command;