const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js-light");
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
        .addStringOption(o => o.setName("tiempo").setDescription("Tiempo de membresia.").setRequired(false)
        .addChoices(
        {name: "1 Mes", value: "1mes"},
        {name: "2 Meses", value: "2meses"},
        {name: "3 Meses", value: "3meses"},
        {name: "4 Meses", value: "4meses"},
        {name: "5 Meses", value: "5meses"},
        {name: "6 Meses", value: "6meses"},
        {name: "7 Meses", value: "7meses"},
        {name: "8 Meses", value: "8meses"},
        {name: "9 Meses", value: "9meses"},
        {name: "10 Meses", value: "10meses"},
        {name: "11 Meses", value: "11meses"},
        {name: "12 Meses", value: "12meses"}
        )
    )
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
            let tiempo = interaction.options.getString("tiempo")
            let now = Math.floor(Date.now()/1000)
            let year = now + 31536000
            let month = now + 2592000


            if(tiempo){

                if (tiempo == "1mes") {
                    tiempo = ms("30d")
                } else if (tiempo == "2meses") {
                    tiempo = ms("60d")
                } else if (tiempo == "3meses") {
                    tiempo = ms("90d")
                } else if (tiempo == "4meses") {
                    tiempo = ms("120d")
                } else if (tiempo == "5meses") {
                    tiempo = ms("150d")
                } else if (tiempo == "6meses") {
                    tiempo = ms("180d")
                } else if (tiempo == "7meses") {
                    tiempo = ms("210d")
                } else if (tiempo == "8meses") {
                    tiempo = ms("240d")
                } else if (tiempo == "9meses") {
                    tiempo = ms("270d")
                } else if (tiempo == "10meses") {
                    tiempo = ms("300d")
                } else if (tiempo == "11meses") {
                    tiempo = ms("330d")
                } else if (tiempo == "12meses") {
                    tiempo = ms("365d")
                }

                if(isNaN(tiempo)) return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(":x: Error")
                    .setDescription("Ingresa un tiempo valido.")
                    .setColor("RED")
                ], ephemeral: true });
            
                if(tiempo / 1000 + now > year) return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(":x: Error")
                    .setDescription("No puedo agregarlo mas de 365 dias.")
                    .setColor("RED")
                ], ephemeral: true });
            
                if(tiempo / 1000 + now < month) return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(":x: Error")
                    .setDescription("El minimo de dias son 30.")
                    .setColor("RED")
                ], ephemeral: true });
                
            }
            
            
            let pg = new premiumGuild({
                ServerID: interaction.options.getString("id-server"),
                time: Math.floor(Date.now() / 1000),
                expire: tiempo ? Math.floor((Date.now() + tiempo) / 1000) : 0
            })
            await pg.save()

            let pgembed = new MessageEmbed()
            .setTitle('✅Hecho')
            .setDescription(`El servidor \`${server.name}\` ha sido añadido.`)
            .setColor('GREEN')
            if(tiempo){
                pgembed.addField("Tiempo:", interaction.options.getString("tiempo"), true)
            }

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
            .setDescription(`El servidor \`${server.name}\` ha sido eliminado de las membresias premium.`)
            .setColor('GREEN')

            return interaction.reply({embeds: [pgyet]})
        }

    }


    }
}

module.exports = command;