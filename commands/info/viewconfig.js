const { Client, Message, MessageEmbed } = require('discord.js')

// Callbacks
const welcomeModel = require('../../models/setWelcome')
const modlogsModel = require('../../models/setModLogs')
const antilinksModel = require('../../models/antilinks')
const antispamModel = require("../../models/antispam");
const premiumGuild = require("../../models/premiumGuild")
const muteModel = require('../../models/setmuterole');


/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'viewconfig',
    aliases: ['vc'],
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['SEND_MESSAGES'],
    description : 'Muestra la configuración del servidor',
    category: 'Information',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        

        // Models
        const welcomeChannel = await welcomeModel.findOne({ ServerID: message.guild.id })
        const modlogsChannel = await modlogsModel.findOne({ ServerID: message.guild.id })
        const Antilinks = await antilinksModel.findOne({ ServerID: message.guild.id })
        const AntiSpam = await antispamModel.findOne({ ServerID: message.guild.id })
        const premium = await premiumGuild.findOne({ ServerID: message.guild.id })
        const muteDB = await muteModel.findOne({ ServerID: message.guild.id })

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
        .addField('🔔 Bienvenidas / Despedidas Logs',`${welcomeChannel ? `${checked} **Activado**` : `${unchecked} **Desactivado**`}`,true)
        .addField('📁 Moderación Logs',`${modlogsChannel ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('👮‍♂️ Auto-Moderacion',`*Tu configuración de moderación*`)
        .addField('🔍 Anti-Links',`${Antilinks ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('📴 Anti-Spam',`${AntiSpam ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .addField('🎭 Roles','*Configuracion de roles:*')
        .addField('🤐 Mute rol',`${muteDB ? `${checked} **Activado**`: `${unchecked} **Desactivado**`}`,true)
        .setFooter(`${premium ? `🚀 El servidor es premium!`: `❌ El servidor no es premium`}`)


        message.reply({embeds: [configview]})

    }
}

module.exports = command