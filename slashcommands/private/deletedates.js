const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/deletedates-sophia")

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    devOnly: true,
    category: "private",


    data: new SlashCommandBuilder()
    .setName("deletedates")
    .setDescription("Sin descripción.")
    .addSubcommand(o =>
        o.setName("add").setDescription("Sin descripción.")
        .addUserOption(o => o.setName("usuario").setDescription("Sin descripción").setRequired(false))
        .addStringOption(o => o.setName("id").setDescription("Sin descripción.").setRequired(false))
    )
    .addSubcommand(o =>
        o.setName("remove").setDescription("Sin descripción.")
        .addUserOption(o => o.setName("usuario").setDescription("Sin descripción").setRequired(false))
        .addStringOption(o => o.setName("id").setDescription("Sin descripción.").setRequired(false))
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options
        const id = args.getString("id")
        const usuario = args.getUser("usuario")
        const opcion = id || usuario.id
        const subcmd = args.getSubcommand()

        const database = await schema.findOne({UserID: opcion})

        if (subcmd === "add") {

            if (database) {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(":x: Error")
                            .setDescription("El usuario ya está en mi base de datos de eliminados permanentes.")
                            .setColor("RED")
                    ], ephemeral: true
                })

            } else {

                const ndb = new schema({
                    UserID: opcion
                })
                await ndb.save();

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Que lastima, pero está bien. 💔")
                            .setDescription(`El usuario: \`${client.users.cache.get(opcion).tag}\` ha sido añadido a la eliminación de datos.`)
                            .setColor("GREEN")
                    ]
                })

            }
        }

        if (subcmd === "add") {
            
            if (!database) {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(":x: Error")
                            .setDescription("El usuario no está en mi base de datos de eliminados permanentes.")
                            .setColor("RED")
                    ], ephemeral: true
                })

            } else {

                schema.findOneAndDelete({UserID: opcion})

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Esa es la actitud! 🤍")
                            .setDescription(`El usuario: \`${client.users.cache.get(opcion).tag}\` ha sido removido de la eliminación de datos.`)
                            .setColor("GREEN")
                    ]
                })

            }
        }
    }
}

module.exports = command;