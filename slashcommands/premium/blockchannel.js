const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['MANAGE_CHANNELS'],
    botPerms: ['MANAGE_CHANNELS'],
    category: "premium",
    isPremium: true,
    data: new SlashCommandBuilder()
    .setName("block-channel")
    .setDescription("Activa o desactiva el bloqueo a un canal.")
    .addSubcommand(o => 
        o.setName("activate")
        .setDescription("Bloquea un canal para que no puedan usarlo.")
        .addChannelOption(o => o.setName("canal").setDescription("Canal a bloquear.").setRequired(false))
    )
    .addSubcommand(o => 
        o.setName("desactivate")
        .setDescription("Desbloquea un canal para que puedan usarlo.")
        .addChannelOption(o => o.setName("canal").setDescription("Canal a desbloquear.").setRequired(false))
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
    const subcmd = interaction.options.getSubcommand()
        
    if(subcmd === "activate"){
        const canal = interaction.options.getChannel("canal") || interaction.channel
        const everyone = interaction.guild

        if(canal.permissionOverwrites.cache.get([{id: `${everyone.id}`, deny: ["SEND_MESSAGES"] }])){
            const e = new MessageEmbed()
            .setTitle(":x: Error")
            .setDescription(`${canal} ya se encuentra bloqueado, desbloquealo o menciona otro canal.`)
            .setColor("RED")
            interaction.reply({embeds: [e], ephemeral: true})
        } else {
            canal.permissionOverwrites.set([{id: everyone.id, deny: ["SEND_MESSAGES"] }])

            const embed = new MessageEmbed()
            .setTitle("<a:Giveaways:878324188753068072> Listo!")
            .setDescription(`He bloqueado ${canal} a todos, menos a los administradores del servidor.`)
            .setColor("GREEN")
            interaction.reply({embeds: [embed]})
        }
    }

    if(subcmd === "desactivate"){
        const canal = interaction.options.getChannel("canal")
        if(!canal) canal = interaction.channel
        const everyone = interaction.guild

        if(canal.permissionOverwrites.cache.get([{id: `${everyone.id}`, allow: ["SEND_MESSAGES"] }])){
            const e = new MessageEmbed()
            .setTitle(":x: Error")
            .setDescription(`${canal} no se encuentra bloqueado, bloquealo o menciona otro canal.`)
            .setColor("RED")
            interaction.reply({embeds: [e], ephemeral: true})
        } else {
            canal.permissionOverwrites.set([{id: everyone.id, allow: ["SEND_MESSAGES"] }])

            const embed = new MessageEmbed()
            .setTitle("<a:Giveaways:878324188753068072> Listo!")
            .setDescription(`He desbloqueado ${canal} a todos.`)
            .setColor("GREEN")
            interaction.reply({embeds: [embed]})
        }
    }


    }
}

module.exports = command;