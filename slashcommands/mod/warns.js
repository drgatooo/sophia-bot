const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require('../../models/warn-model.js');

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("Mira las advertencias de un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Menciona al usuario a mutear").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    const noPosible = new MessageEmbed()
    .setTitle('❌ Error')
    .setColor('RED')
        
	const mention = interaction.options.getUser("usuario") || interaction.user;
    const guildId = interaction.guild.id;
    const userId = mention.id;
                
         const warns = new MessageEmbed()
        .setTitle(`⚠ Advertencias de ${mention.username}`)
        .setThumbnail(mention.displayAvatarURL({dynamic: true}))
        .setColor('YELLOW')

         
    if(userId === client.user.id) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedo tener warns!')], ephemeral: true});
    if(mention.bot) return interaction.reply({embeds: [noPosible.setDescription('ℹ Los bots no pueden tener warns!')], ephemeral: true});
        const results = await schema.findOne({
            guildId,
            userId
        });
        if(!results) return interaction.reply({embeds: [noPosible.setDescription('ℹ Este usuario no tiene warns!')], ephemeral: true});
        if(!results.warnings[0]) return interaction.reply({embeds: [noPosible.setDescription('ℹ Este usuario no tiene warns!')], ephemeral: true});
            interaction.reply({embeds: [warns
                .setDescription(
                    results.warnings.map((w, i) => 
                    `\n**#${i+1}**\n📕 Razon:\n${w.reason}\n💂‍♂️ Ejecutor del warn:\n<@${w.author}>\n⌚ Hace: <t:${Math.round(w.timestamp / 1000)}:R>\n---------------`
                ).join(""))
        ]});

    }
}

module.exports = command;