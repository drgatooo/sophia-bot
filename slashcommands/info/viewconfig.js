const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const welcomeModel = require('../../models/setWelcome');
const antilinksModel = require('../../models/antilinks');
const antispamModel = require("../../models/antispam");
const premiumGuild = require("../../models/premiumGuild");
const muteModel = require('../../models/setmuterole');
const ignoreModel = require('../../models/ignorerol');

module.exports = {
    category: "Información",
    userPerms: "ADMINISTRATOR",
    data: new SlashCommandBuilder()
    .setName("viewconfig")
    .setDescription("Revisa la configuración de tu servidor de los diversos sistemas de Sophia."),

    async run(client, interaction){

        // Models
        const welcomeChannel = await welcomeModel.findOne({ ServerID: interaction.guild.id })
        const Antilinks = await antilinksModel.findOne({ ServerID: interaction.guild.id })
        const rolignore = await ignoreModel.findOne({ ServerID: interaction.guild.id })
        const AntiSpam = await antispamModel.findOne({ ServerID: interaction.guild.id })
        const premium = await premiumGuild.findOne({ ServerID: interaction.guild.id })
        const muteDB = await muteModel.findOne({ ServerID: interaction.guild.id })

        // Emotes

        checked = '<:Check:886685653746720788>'
        unchecked = '<:notcheck:886685696100818994>'
        gears = '<:gear1:886683883209363468>'

        // Embeds

        const configview = new MessageEmbed()
        .setTitle(`${gears} Configuration`)
        .setColor('LIGHT_GREY')
        .setDescription('Tu configuración actual:')
        .addField(`📚 Canales`,'*Configuración de canales:*')
        .addField('🔔 Bienvenidas / Despedidas ',`${welcomeChannel ? `${checked} **Activado**` : `${unchecked} **Desactivado**`}`,true)
        .addField('👮‍♂️ Auto-Moderacion',`*Tu configuración de moderación*`)
        .addField('🔍 Anti-Links',`${Antilinks ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('📴 Anti-Spam',`${AntiSpam ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('🎭 Roles','*Configuracion de roles:*')
        .addField('🤐 Mute rol',`${muteDB ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('😎 Ignore rol',`${rolignore ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .setFooter({text: `${premium ? `🚀 El servidor es premium!`: `❌ El servidor no es premium`}`, iconURL: interaction.guild.iconURL({dynamic: true})})


        interaction.reply({embeds: [configview]})

    }
}