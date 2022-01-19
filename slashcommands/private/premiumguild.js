const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const premiumGuild = require('../../models/premiumGuild')

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    devOnly: true,
    category: "private",


    data: new SlashCommandBuilder()
    .setName("premiumguild")
    .setDescription("OWNER")
    .addSubcommand(o =>
        o.setName("add")
        .setDescription("Sin descripción")
        .addStringOption(o => o.setName("id-server").setDescription("Sin descripción").setRequired(true))
    )
    .addSubcommand( o =>
        o.setName("remove")
        .setDescription("Sin descripción")
        .addStringOption(o => o.setName("id-server").setDescription("Sin descripción").setRequired(true))
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const subcmd = interaction.options.getSubcommand()

        if(subcmd === "add"){

        let server = await client.guilds.fetch(interaction.options.getString("id-server"));

        // Data-base

        const premium = await premiumGuild.findOne({ ServerID: server.id});


        if(!client.guilds.cache.has(`${interaction.options.getString("id-server")}`)) {
            let noServer = new MessageEmbed()
            .setTitle('❌ Error')
            .setDescription(`No pertenezco a \`${server.name}\`.`)
            .setColor('RED')
            return interaction.reply({embeds: [noServer]})
        }

        if(!premium) {
            let pg = new premiumGuild({
                ServerID: interaction.options.getString("id-server")
            })
            await pg.save()

            let pgembed = new MessageEmbed()
            .setTitle('✅Hecho')
            .setDescription(`El servidor \`${server.name}\` ha sido añadido.`)
            .setColor('GREEN')

            return interaction.reply({embeds: [pgembed]})

        } else {

            let pgyet = new MessageEmbed()
            .setTitle('⚠ Advertencia')
            .setDescription(`El servidor \`${server.name}\` ya se encuentra en la lista!`)
            .setColor('ORANGE')

            return interaction.reply({embeds: [pgyet]})
        }
    }

    if(subcmd === "remove"){
        let server = await client.guilds.fetch(interaction.options.getString("id-server"));
        const premium = await premiumGuild.findOne({ ServerID: server.id});

        if(!client.guilds.cache.has(`${interaction.options.getString("id-server")}`)) {
            let noServer = new MessageEmbed()
            .setTitle('❌ Error')
            .setDescription(`No pertenezco a \`${server.name}\` ese servidor.`)
            .setColor('RED')
            return interaction.reply({embeds: [noServer]})
        }

        if (!premium) {

            let pgno = new MessageEmbed()
            .setTitle('⚠ Advertencia')
            .setDescription(`El servidor \`${server.name}\` no esta registrado como premium`)
            .setColor('ORANGE')

            return interaction.reply({embeds: [pgno]})

        } else {
            await premiumGuild.findOneAndDelete({
                ServerID: server.id
            })

            let pgyet = new MessageEmbed()
            .setTitle('✅ Hecho')
            .setDescription(`El servidor \`${server.name}\` ha sido eliminado.`)
            .setColor('GREEN')

            return interaction.reply({embeds: [pgyet]})
        }

    }


    }
}

module.exports = command;