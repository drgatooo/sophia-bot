const { MessageEmbed } = require('discord.js');
const client = require('../index.js');
const toml = require("toml");
const fs = require('fs');
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));

client.on("interactionCreate", async (interaction) => {
   if(!interaction.isCommand()) return;

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
});