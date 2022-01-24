const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton, version } = require('discord.js')
const info = require("../../package.json")
require('moment').locale('es');

module.exports = {
    category: 'Utilidad',
    data: new SlashCommandBuilder()
    .setName("infobot")
    .setDescription("Revisa información del bot."),

    async run(client, interaction){

        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setLabel("Invitación")
            .setStyle("LINK")
            .setURL("https://discord.com/oauth2/authorize?client_id=864930156857786388&permissions=8&scope=bot"),

            new MessageButton()
            .setLabel("Support Server")
            .setStyle("LINK")
            .setURL("https://discord.gg/QaY43QSDwK")
        )
        
        const embed = new MessageEmbed()
        .setTitle("Información Sophia.")
        .setDescription("Bienvenido al apartado de información sobre mi!, a continuación verás aspectos e información diversa de mi.")
        .addField("<a:ArrowRightGlow:878324199171690518> Nombre:", `${info.name}`, true)
        .addField("<a:check:878324190804070440> Discriminator:", `${client.user.discriminator}`, true)
        .addField("<a:emoji_142:878324216242524190> Owners:", `${info.owners}`, true)
        .addField("<a:emoji_142:878324216242524190> Developers:", `${info.programadores}`, true)
        .addField("<a:puntos:878324208864722954> Fecha de creación:", require('moment')(client.user.createdAt).format('DD/MM/YYYY [a las] hh:ssa'), true)
        .addField("<a:cora:925477856711180379> Uptime:", require('humanize-duration')(client.uptime, {language: "es", round: true}), true)
        .addField("<:vyxter:904595485615087636> Host:", "[VyxterHost](https://vyxterhost.com)", true)
        .addField("<a:de07f1a598f3418bad40172ddc1aba3a:878324224140390400> Lenguaje de programación:", `Javascript`, true)
        .addField("<a:de07f1a598f3418bad40172ddc1aba3a:878324224140390400> Package:", `discord.js ${version}`, true)
        .addField("<a:palomita_YELLOW:881940973721116763> Servidores:", client.guilds.cache.size.toString(), true)
        .addField("<a:palo:883588606290194432> Usuarios:", `${client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)}`, true)
		.addField("<a:Giveaways:878324188753068072> Comandos totales:", client.slashcommands.filter(cmd => cmd.category !== "Owner").size.toString(), true)
        .setColor('00FFFF');

        interaction.reply({ embeds: [embed], components: [row] })

    }
}