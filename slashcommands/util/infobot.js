const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, version } = require("discord.js-light");
const { name, owners, programadores } = require("../../package.json")

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Utilidad",


    data: new SlashCommandBuilder()
    .setName("infobot")
    .setDescription("Revisa la información general de Sophia."),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setLabel("Invitación")
                .setStyle("LINK")
                .setURL("https://invite.sophia-bot.com/"),
    
                new MessageButton()
                .setLabel("Support Server")
                .setStyle("LINK")
                .setURL("https://discord.gg/8PSwGHhZM8")
            )
            
            const embed = new MessageEmbed()
            .setTitle("Información Sophia.")
            .setDescription("Bienvenido al apartado de información sobre mi!, a continuación verás aspectos e información diversa de mi.")
            .addField("<a:ArrowRightGlow:878324199171690518> Nombre:", `${name}`, true)
            .addField("<a:check:878324190804070440> Discriminator:", `${client.user.discriminator}`, true)
            .addField("<a:emoji_142:878324216242524190> Owners:", `${owners}`, true)
            .addField("<a:emoji_142:878324216242524190> Developers:", `${programadores}`, true)
            .addField("<a:puntos:878324208864722954> Fecha de creación:", `<t:${parseInt(client.user.createdTimestamp / 1000)}:d>`, true)
            .addField("<a:cora:925477856711180379> Uptime:", `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, true)
            .addField("<:vyxter:904595485615087636> Host:", "[VyxterHost](https://vyxterhost.com)", true)
            .addField("<a:de07f1a598f3418bad40172ddc1aba3a:878324224140390400> Lenguaje de programación:", `Javascript`, true)
            .addField("<a:de07f1a598f3418bad40172ddc1aba3a:878324224140390400> Package:", `discord.js-light ${version}`, true)
            .addField("<a:palomita_YELLOW:881940973721116763> Servidores:", `${client.guilds.cache.size}`, true)
            .addField("<a:palo:883588606290194432> Usuarios:", `${client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)}`, true)
            .addField("<a:Giveaways:878324188753068072> Comandos totales:", client.sc.filter(cmd => cmd.category !== "Owner").size.toString(), true)
            .setColor('00FFFF');
    
            interaction.reply({ embeds: [embed], components: [row] })

    }
}

module.exports = command;