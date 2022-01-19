const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { inspect } = require("util");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {
    category: "private",
    devOnly: true,
    data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("OWNER")
    .addStringOption(o =>
        o.setName('code')
        .setDescription('sin descripción')
        .setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
        try {
            const args = interaction.options;
            const js = eval(args.getString('code'));
            interaction.reply('```js\n'+inspect(js, { depth: 0})+"```");
            } catch(err) {
                interaction.reply('```js\nerror: '+err+"```");
            }
    }
}

module.exports = command;