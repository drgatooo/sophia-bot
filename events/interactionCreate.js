const { MessageEmbed } = require('discord.js');
const client = require('../index.js');
const toml = require("toml");
const fs = require('fs');
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));
const premiumguild = require("../models/premiumGuild");
const autoroles = require('../models/autorole.js');

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        const results = await autoroles.findOne({guildId: interaction.guild.id});
        if(results && interaction.channel.id === results.channelId && interaction.guild.roles.cache.get(interaction.customId)) {
                await interaction.deferUpdate();
                if(interaction.member.roles.cache.has(interaction.customId)){
                    await interaction.member.roles.remove(interaction.customId).catch(async () => {
                        return await interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                .setTitle('❌ Error')
                                .setDescription('No se te ha podido remover el rol.\nEs posible que me falten permisos, contacta con un administrador para solucionarlo!')
                                .setColor('RED')
                            ], ephemeral: true});
                    });
                    await interaction.followUp({ embeds: [
                        new MessageEmbed()
                        .setTitle("Rol Removido")
                        .setDescription(`**${interaction.member.user.tag}** se te ha removido el rol <@&${interaction.customId}> correctamente.`)
                        .setColor('GREEN')
                    ], ephemeral: true});
                } else {
                    await interaction.member.roles.add(interaction.customId).catch(async () => {
                        return await interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                .setTitle('❌ Error')
                                .setDescription('No se te ha podido añadir el rol.\nEs posible que me falten permisos, contacta con un administrador para solucionarlo!')
                                .setColor('RED')
                            ], ephemeral: true});
                    });
                    await interaction.followUp({ embeds: [
                        new MessageEmbed()
                        .setTitle("Rol añadido")
                        .setDescription(`**${interaction.member.user.tag}** se te ha añadido el rol <@&${interaction.customId}> correctamente.`)
                        .setColor('GREEN')
                    ], ephemeral: true});
                }
                
        }
    }
    if(interaction.isCommand()) {
    if(!interaction.guild) return interaction.reply({embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("¿Que intentas hacer?\nMis comandos no se pueden usar en mi privado!").setColor("RED")]})

    const slashcmds = client.slashcommands.get(interaction.commandName)
    if(!slashcmds) return;
	if(slashcmds.userPerms) {
            if(!interaction.member.permissions.has(slashcmds.userPerms || [])) return interaction.reply({embeds: [
          		new MessageEmbed()
            		.setTitle("❌ Error")
            		.setColor("RED")
            		.setDescription(
             			 `No tienes estos permisos: \`${slashcmds.userPerms}\` `
            	),
        	], ephemeral: true});
    }
    if(slashcmds.botPerms) {
            if(!interaction.guild.me.permissions.has(slashcmds.botPerms || [])) return interaction.reply({embeds: [
          		new MessageEmbed()
            		.setTitle("❌ Error")
            		.setColor("RED")
            		.setDescription(
             			 `No tengo estos permisos: \`${slashcmds.botPerms}\` `
            	),
        	], ephemeral: true});
        }
    if(slashcmds.devOnly && !config.owner.includes(interaction.user.id)) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(':x: Error')
        .setDescription('Solo los developers del Bot pueden usar este comando.')
        .setColor('RED')
        .setTimestamp()
    ], ephemeral: true});

    if(slashcmds.isPremium === true){
        const premium = await premiumguild.findOne({ServerID: interaction.guildId})
        if(!premium) return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(':x: Error')
            .setDescription('Este comando es de categoria Premium, adquiere la membresía en el [Servidor de soporte.](https://discord.sophia-bot.com).')
            .setColor('RED')
            .setTimestamp()
        ], ephemeral: true});
    }
    if(slashcmds.isMaintenance === true && !config.owner.includes(interaction.user.id)){
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle("⚠ Comando en mantenimiento....")
            .setTimestamp(new Date())
            .setColor("YELLOW")
        ], ephemeral: true})
    }

    const limit = require("../models/limitusecommands")
    const com = await limit.findOne({ServerID: interaction.guild.id})
    
    if(com && interaction.channel.id !== com.ChannelID){
        return interaction.reply({embeds: [new MessageEmbed()
        .setTitle("Hey, espera! 💔")
        .setDescription(`En este servidor mi uso de comandos esta limitado a el canal <#${com.ChannelID}> ve allí y reintenta.`)
        .setColor("RED")
        ], ephemeral: true})
    }

    try{
        const blackuser = require("../models/blacklist-user");
        const blackguild = require("../models/blacklist-guild");
        const server = await blackguild.findOne({ServerID: interaction.guildId})
        const user = await blackuser.findOne({UserID: interaction.user.id})
        
        if(user) {
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(":x: Error")
            .setDescription(`Hey que tal \`${interaction.user.tag}\` lamentablemente no puedes usar mis comandos porque estás dentro de la blacklist.`)
            .addField("`📑` | Razon", `\`${user.Reason}\``, true)
            .addField("`📆` | Fecha", `<t:${Math.floor(user.Date / 1000)}:F>`, true) //ya está
            .setColor('RED')
        ]}) 
    }
        if(server) {
        return interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle(":x: Error")
            .setDescription(`Hey que tal \`${interaction.user.tag}\` lamentablemente no puedes usar mis comandos en \`${interaction.guild.name}\` porque esta dentro de la blacklist.`)
            .addField("`📑` | Razon", `\`${server.Reason}\``, true)
            .addField("`📆` | Fecha", `<t:${Math.floor(server.Date / 1000)}:F>`, true)
            .setColor('RED')
        ]}) 
    }
        await slashcmds.run(client, interaction);
    
    }catch(e){
        console.error(e)

        const embedError = new MessageEmbed()
        .setColor('#FF5252')
        .setDescription(':x: | Ha ocurrido un error inesperado, vuelve a intentarlo.')
        .setThumbnail(client.user.displayAvatarURL({size: 4096}))

        interaction.reply({embeds: [embedError]}).catch(() => null)
    }
};
});