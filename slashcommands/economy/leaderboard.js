const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require('../../models/economy-model.js');
const bankschema = require('../../models/bank-model')

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Consulta la tabla de clasificación en economía."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const collection = new Discord.Collection()
        
        await Promise.all(
          message.guild.members.cache
            .filter((m) => !m.user.bot)
            .map(async (member) => {
              let datos = await schema.findOne({
                guildid: interaction.guild.id,
                userid: interaction.user.id,
              });
              let datosbanco = await bankschema.findOne({
                guildid: interaction.guild.id,
                userid: interaction.user.id,
              });

              const id = member.id;
              let bal;
              if (!datos && !datosbanco) {
                bal = 0;
              } else {
                bal = datos.money + datosbanco.money;
              }
              return bal !== 0
                ? collection.set(id, {
                    id,
                    bal,
                  })
                : null;
            })
        );

        const leaderboard = collection.sort((a, b) => b.bal - a.bal).first(10);
        const leaderboardMap = leaderboard.map((v, i) => `\`#${i+1} - ${client.users.cache.get(v.id).username} / ${v.bal}$\``).slice(0, 10).join("\n")

        const embed = new Discord.MessageEmbed()
        .setTitle(`Leaderboard on ${interaction.guild.name}`)
        .setDescription(leaderboardMap)
        .setColor("0x388CEC")
        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

        interaction.reply({ embeds: [embed] })

    }
}

module.exports = command;