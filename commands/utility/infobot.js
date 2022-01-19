const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, version } = require('discord.js');
//hijueputa bienvenio 
const client = require("../../index.js")
const info = require("../../package.json")
require('moment').locale('es');

/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'infobot',
    aliases: ['botinfo'],
    description: 'Información del bot, datos generales.',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Utility',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setLabel("Invitación")
            .setStyle("LINK")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=864930156857786388&permissions=8&scope=applications.commands%20bot"),

            new MessageButton()
            .setLabel("Support Server")
            .setStyle("LINK")
            .setURL("https://discord.gg/QaY43QSDwK")
        )
		const fetch = await require("node-fetch")("https://cdbotlist.glitch.me/api/bots/list/");
        const res = await fetch.json();
        const embed = new MessageEmbed()
        .setTitle("Información Sophia.")
        .setDescription("Bienvenido al apartado de información sobre mi!, a continuación verás aspectos e información diversa de mi.")
        .addField("<a:ArrowRightGlow:878324199171690518> Nombre:", `${info.name}`, true)
        //.addField("<:like:908345283472150548> likes en CDbotlist:", res.filter(e=>"864930156857786388"==e.botid)[0].likes.toString(), true)
        .addField("<a:emoji_142:878324216242524190> Creadores:", `${info.author}`, true)
        .addField("<a:puntos:878324208864722954> Fire('echa de creación:", requmoment')(client.user.createdAt).format('DD/MM/YYYY [a las] hh:ssa'), true)
        .addField("<:vyxter:904595485615087636> Host:", "[VyxterHost](https://vyxterhost.com)", true)
        .addField("<a:de07f1a598f3418bad40172ddc1aba3a:878324224140390400> lenguaje de programación:", `javascript`, true)
        .addField("<a:palomita_YELLOW:881940973721116763> Servidores:", client.guilds.cache.size.toString(), true)
        .addField("<a:palo:883588606290194432> Usuarios:", client.users.cache.size.toString(), true)
		.addField("<a:Giveaways:878324188753068072> comandos totales:", client.slashcommands.filter(cmd => cmd.category !== "Owner").size, true)
        .setColor('00FFFF');

        message.channel.send({ embeds: [embed], components: [row] })
    }
}

module.exports = command


                