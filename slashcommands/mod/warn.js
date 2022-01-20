const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/warn-model");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Da una advertencia a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a warnear").setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Motivo de la warn.").setRequired(false)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    const noPosible = new MessageEmbed()
    .setTitle('❌ Error')
    .setColor('RED')
        
        
        
    const user = interaction.options.getMember("usuario");
    if(user.id === interaction.user.id) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedes warnearte a vos mismo')], ephemeral: true});
    if(user.id === client.user.id) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedo warnearme a mi misma')], ephemeral: true});
    if(user.bot) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedo warnear a un bot')], ephemeral: true});
    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedes warnear a alguien con mayor o igual rol que tu.')], ephemeral: true});
    
        const guildId = interaction.guild.id;
        const userId = user.id;
        let reason = interaction.options.getString("razon")
        if(!reason) reason = "Sin especificar";
        if(reason.length > 50) return interaction.reply({embeds: [noPosible.setDescription('ℹ Solo puedes poner hasta 50 caracteres!')], ephemeral: true});
    
        const warning = {
            author: interaction.user.id,
            timestamp: new Date().getTime(),
            reason
        };
            try {
       await schema.findOneAndUpdate({
           guildId,
           userId
       }, {
           guildId,
           userId,
           $push: {
               warnings: warning
           }
       }, {
           upsert: true
       });
            } catch (err) {
                interaction.reply("Hubo un error inesperado, espera a que lo solucionemos! (ya fue enviado a mis creadores)");
                console.log(err.stack);
            }
        const embedSuccess = new MessageEmbed()
        .setTitle('⚠ Warns')
        .addField('👤 Usuario warneado:',`${user}`,true)
        .addField('👮‍♂️ Staff a cargo:', `<@${interaction.user.id}>`,true)
        .addField('📕 Razon:',`\`\`\`${reason}\`\`\``)
        .setColor("ORANGE");
        const embedUser = new MessageEmbed()
        .setTitle("🔔 Te han warneado!")
        .addField('🏛 Servidor:',`${interaction.guild.name}`,true)
        .addField('👮‍♂️ Staff a cargo:', `<@${interaction.user.id}>`,true)
        .addField('📕 Razon:',`\`\`\`${reason}\`\`\``)
        .setFooter("Comportate bien!")
        .setColor("RED")
        .setTimestamp();
        interaction.reply({embeds: [embedSuccess]});
        user.send({embeds: [embedUser]}).catch(err=>{});

    }
}

module.exports = command;