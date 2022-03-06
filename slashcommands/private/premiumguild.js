const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const premiumGuild = require('../../models/premiumGuild')
const ms = require('ms')

/**
* @type {import('../../types/typeslash').Command}
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
        .addStringOption(o => o.setName("tiempo").setDescription("Tiempo de membresia.").setRequired(true))
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
            let tiempo = ms(interaction.options.getString("tiempo"))

            /*if(isNaN(ms(tiempo))) return interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription("Ingresa un tiempo valido.")
                .setColor("RED")
            ], ephemeral: true });
        
            if(tiempo > ms("365d")) return interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription("No puedo agregarlo mas de 365 dias.")
                .setColor("RED")
            ], ephemeral: true });
        
            if(duration < ms("30d")) return interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(":x: Error")
                .setDescription("El minimo de dias son 30.")
                .setColor("RED")
            ], ephemeral: true });
*/
            let pg = new premiumGuild({
                ServerID: interaction.options.getString("id-server"),
                time: Math.floor(Date.now() / 1000),
                expire: Math.floor((Date.now() + tiempo) / 1000)
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