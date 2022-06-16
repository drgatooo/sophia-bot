const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const welcomeModel = require('../../models/setWelcome');
const leaveModel = require("../../models/setLeave")
const componentslLeave = require("../../models/components-leave")
const componentsModel = require("../../models/components-welcome")
const inviteModel = require("../../models/setinvitechannel")
const antilinksModel = require('../../models/antilinks');
const antispamModel = require("../../models/antispam");
const premiumGuild = require("../../models/premiumGuild");
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
        const leaveChannel = await leaveModel.findOne({ServerID: interaction.guild.id })
        const leaveComponents = await componentslLeave.findOne({ServerID: interaction.guild.id })
        const invitesChannel = await inviteModel.findOne({ServerID: interaction.guild.id})
        const components = await componentsModel.findOne({ServerID: interaction.guild.id})
        const Antilinks = await antilinksModel.findOne({ ServerID: interaction.guild.id })
        const rolignore = await ignoreModel.findOne({ ServerID: interaction.guild.id })
        const AntiSpam = await antispamModel.findOne({ ServerID: interaction.guild.id })
        const premium = await premiumGuild.findOne({ ServerID: interaction.guild.id })
        
        // Emotes

        checked = '<a:Stable:910938393968517180>'
        unchecked = '<a:Down:910938393993699350>'
        gears = '<:Employee:910880101758029874>'

        // Embeds

        const configview = new MessageEmbed()
        .setTitle(`${gears} Configuración`)
        .setColor('LIGHT_GREY')
        .setDescription('Tu configuración actual:')
        .addField(`📚 Canales`,'*Configuración de canales:*')
        .addField('🔔 Bienvenidas',`${welcomeChannel ? `${checked} **Activado**\n<#${welcomeChannel.ChannelID}>` : `${unchecked} **Desactivado**`}`,true)
        .addField('😟 Despedidas',`${leaveChannel ? `${checked} **Activado**\n<#${leaveChannel.ChannelID}>` : `${unchecked} **Desactivado**`}`,true)
        .addField('🔔 Bienvenidas Personalizada ',`${components ? `${checked} **Activado**` : `${unchecked} **Desactivado**`}`,true)
        .addField('😟 Despedidas Personalizada ',`${leaveComponents ? `${checked} **Activado**` : `${unchecked} **Desactivado**`}`,true)
        .addField('✨ Invitaciones ',`${invitesChannel ? `${checked} **Activado**` : `${unchecked} **Desactivado**`}`,true)
        .addField('👮‍♂️ Auto-Moderación',`*Tu configuración de moderación*`)
        .addField('🔍 Anti-Links',`${Antilinks ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('📴 Anti-Spam',`${AntiSpam ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('🎭 Roles','*Configuración de roles:*')
        .addField('😎 Ignore rol',`${rolignore ? `${checked} **Activado**\n<@&${rolignore.RoleID}>`: `${unchecked} **Desactivado**`}`,true)
        .setFooter({text: `${premium ? `🚀 El servidor es premium!`: `❌ El servidor no es premium`}`, iconURL: interaction.guild.iconURL({dynamic: true})})

        interaction.reply({embeds: [configview]})

    }
}