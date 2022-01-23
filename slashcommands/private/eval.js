const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { inspect } = require("util");
const ms = require("ms");

/**
* @type {import('../../types/typeslash').Command}
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
        const { options } = interaction;
        const code = options.getString("code");
        const evaluating = new MessageEmbed()
          .setTitle("`⌛` | Evaluating...")
          .setColor("#00ff00");
    
        await interaction.reply({ embeds: [evaluating] });
        try {
          const result = await eval(code);
          const final = inspect(result, { depth: 0 });
          const embed = new MessageEmbed()
            .setTitle("`✅` | Evaluation finished!")
            .addField("`🧩` | Type", `\`\`\`ini\n[${typeof result}]\`\`\``, true)
            .addField(
              "`⌛` | Time",
              `\`\`\`yaml\n${ms(Date.now() - interaction.createdTimestamp, {
                long: true,
              })}\`\`\``,
              true
            )
            .addField("`📥` | Input", `\`\`\`js\n${code}\`\`\``)
            .addField(
              "`📤` | Output",
              `\`\`\`js\n${
                final.length >= 1024 ? `${final.slice(0, 1010)}...` : `${final}`
              }\n\`\`\``
            )
            .setColor("#00ff00");
          await interaction.editReply({ embeds: [embed] });
        } catch (err) {
          const embed = new MessageEmbed()
            .setTitle("`❌` | Evaluation failed!")
            .addField("type", `\`\`\`ini\n[${typeof err}]\`\`\``, true)
            .addField(
              "time",
              `\`\`\`yaml\n${ms(Date.now() - interaction.createdTimestamp, {
                long: true,
              })}\`\`\``,
              true
            )
            .addField("Code", `\`\`\`js\n${err}\n\`\`\``)
            .setColor("RED");
          await interaction.editReply({ embeds: [embed] });
        }
    }
}

module.exports = command;