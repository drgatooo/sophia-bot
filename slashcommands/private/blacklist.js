const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const blackuser = require("../../models/blacklist-user");
const blackguild = require("../../models/blacklist-guild");
const ms = require("ms")

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    devOnly: true,
    category: "private",


    data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("OWNER")
    .addSubcommandGroup(o =>
        o.setName("server")
        .setDescription("Sin decripcion.")
        .addSubcommand(o => 
            o.setName("add")
            .setDescription("Sin descripcion.")
            .addStringOption(o =>
                o.setName("id")
                .setDescription("El id del servidor a añadir.")
                .setRequired(true)
            )
            .addStringOption(o =>
                o.setName("imagen")
                .setDescription("Imagen del blacklist")
                .setRequired(true)
            )
            .addStringOption(o =>
                o.setName("razon")
                .setDescription("Razon del porque añades este servidor a la blacklist.")
            )
            .addStringOption(o =>
                o.setName("tiempo")
                .setDescription("Agrega timeout para blacklist")
            )
        )
        .addSubcommand(o => 
            o.setName("remove")
            .setDescription("Sin descripcion.")
            .addStringOption(o =>
                o.setName("id")
                .setDescription("El id del servidor a quitar.")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(o =>
        o.setName("user")
        .setDescription("Sin decripcion.")
        .addSubcommand(o => 
            o.setName("add")
            .setDescription("Sin descripcion.")
            .addStringOption(o =>
                o.setName("id")
                .setDescription("El id del usuario a añadir.")
                .setRequired(true)
            )
            .addStringOption(o =>
                o.setName("imagen")
                .setDescription("Imagen del blacklist")
                .setRequired(true)
            )
            .addStringOption(o =>
                o.setName("razon")
                .setDescription("Razon del porque añades este usuario a la blacklist.")
            )
            .addStringOption(o =>
                o.setName("tiempo")
                .setDescription("Agrega timeout para blacklist")
            )
        )
                
        .addSubcommand(o => 
            o.setName("remove")
            .setDescription("Sin descripcion.")
            .addStringOption(o =>
                o.setName("id")
                .setDescription("El id del usuario a remover.")
                .setRequired(true)
            )
        )
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const args = interaction.options
        const subcmd = args.getSubcommand()
        const subgroup = args.getSubcommandGroup()

        if (subgroup === "user"){
            if(subcmd === "add"){
                const user = await client.users.fetch(args.getString("id"))
                const imagen = args.getString("imagen")
                const reason = args.getString("razon") || "Razon no especificada"
                const tiempo = args.getString("tiempo")


                if(tiempo){
                    if(isNaN(ms(tiempo))) return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle(":x: Error")
                        .setDescription("Ingresa un tiempo valido.")
                        .setColor("RED")
                    ], ephemeral: true });
                }

                if(imagen){
                    if(!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(imagen)){
                      error.setDescription('La URL de la imagen no es válida.')
                      return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle(":x: Error")
                        .setDescription("Ingresa una imagen valida.")
                        .setColor("RED")
                    ], ephemeral: true });
                    }
                }

                let hasBlacklist = await blackuser.findOne({
                        UserID: user.id
                    })

                if (!hasBlacklist){
                    const newBlacklist = new blackuser({
                        UserID: user.id,
                        Reason: reason,
                        ModeratorID: interaction.user.id,
                        Date: Date(Date.now()).toLocaleString(),
                        expire: tiempo ? Math.floor((Date.now() + ms(tiempo)) / 1000) : 0,
                        Image: imagen
                    })
                    await newBlacklist.save()

                    hasBlacklist = await blackuser.findOne({
                        UserID: user.id
                    })
                    let expireUser = tiempo ? `<t:${hasBlacklist.expire}:R>` : "No especificado"

                    const embed = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${user.tag}** ha sido añadido a la blacklist.`)
                    .addField("`📑` | Razon", `\`${reason}\``,true)
                    .addField("`📆` | Fecha", `<t:${Math.floor(Date.now() / 1000)}:R>`,true)
                    .addField("`🗑` | Expira", `${expireUser}`, true)
                    .addField('`👮‍♂️` | Moderador', `${interaction.user.tag}`,true)
                    .setImage(imagen)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [embed]})
                } else {
                    const { Reason, ModeratorID, Date } = hasBlacklist
                    const moderator = await client.users.fetch(ModeratorID)
                    let expireUser = hasBlacklist.expire === 0 ? "No Especificado" : `<t:${hasBlacklist.expire}:R>`
                    const error = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${user.tag}** ya esta en la blacklist.`)
                    .addField("`📑` | Razon", `\`${Reason}\``,true)
                    .addField("`📆` | Fecha", `<t:${Math.floor(hasBlacklist.Date / 1000)}:R>`, true)
                    .addField("`🗑` | Expira", `${expireUser}`, true)
                    .addField('`👮‍♂️` | Moderador', `${moderator.tag}`,true)
                    .setImage(blackuser.Image)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [error]})
                }
            } else if (subcmd === "remove"){
                const user = await client.users.fetch(args.getString("id"))
                let hasBlacklist = await blackuser.findOne({
                        UserID: user.id
                    })

                if (!hasBlacklist){
                    const error = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${user.tag}** no esta en la blacklist.`)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [error]})
                } else {
                    await blackuser.deleteOne({
                        UserID: user.id
                    })

                    const embed = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${user.tag}** ha sido removido de la blacklist.`)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [embed]})
                }
            }
        } else if (subgroup === "server"){
            if(subcmd === "add"){
                const server = await client.guilds.fetch(args.getString("id"))
                const reason = args.getString("razon") || "Razon no especificada"
                const imagen = args.getString("imagen")
                const tiempo = args.getString("tiempo")


                if(tiempo){
                    if(isNaN(ms(tiempo))) return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle(":x: Error")
                        .setDescription("Ingresa un tiempo valido.")
                        .setColor("RED")
                    ], ephemeral: true });
                }
                if(imagen){
                    if(!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(imagen)){
                      error.setDescription('La URL de la imagen no es válida.')
                      return interaction.reply({embeds: [
                        new MessageEmbed()
                        .setTitle(":x: Error")
                        .setDescription("Ingresa una imagen valida.")
                        .setColor("RED")
                    ], ephemeral: true });
                    }
                  }

                let hasBlacklist = await blackguild.findOne({
                        ServerID: args.getString("id")
                    })

                if (!hasBlacklist){
                    const newBlacklist = new blackguild({
                        ServerID: args.getString("id"),
                        Reason: reason,
                        ModeratorID: interaction.user.id,
                        Date: Date(Date.now()).toLocaleString(),
                        expire: tiempo ? Math.floor((Date.now() + ms(tiempo)) / 1000) : 0,
                        Image: imagen
                        
                    })
                    await newBlacklist.save()
                    
                    hasBlacklist = await blackguild.findOne({
                        ServerID: args.getString("id")
                    })
                    let expireUser = tiempo ? `<t:${hasBlacklist.expire}:R>` : "No especificado"

                    const embed = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${server.name}** ha sido añadido a la blacklist.`)
                    .addField("`📑` | Razon", `\`${reason}\``,true)
                    .addField("`📆` | Fecha", `<t:${Math.floor(Date.now() / 1000)}:R>`,true)
                    .addField("`🗑` | Expira", `${expireUser}`, true)
                    .addField('`👮‍♂️` | Moderador', `${interaction.user.tag}`,true)
                    .setImage(imagen)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [embed]})
                } else {
                    const { Reason, ModeratorID, Date } = hasBlacklist
                    const moderator = await client.users.fetch(ModeratorID)
                    let expireUser = hasBlacklist.expire === 0 ? "No Especificado" : `<t:${hasBlacklist.expire}:R>`
                    const error = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${server.name}** ya esta en la blacklist.`)
                    .addField("`📑` | Razon", `\`${Reason}\``,true)
                    .addField("`📆` | Fecha", `<t:${Math.floor(hasBlacklist.Date / 1000)}:R>`,true)
                    .addField("`🗑` | Expira", `${expireUser}`, true)
                    .addField('`👮‍♂️` | Moderador', `${moderator}`,true)
                    .setImage(hasBlacklist.Image)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [error]})
                }
            } else if (subcmd === "remove"){
                const server = await client.guilds.fetch(args.getString("id"))
                const hasBlacklist = await blackguild.findOne({
                        ServerID: server.id
                    })

                if (!hasBlacklist){
                    const error = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${server.name}** no esta en la blacklist.`)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [error]})
                } else {
                    await blackguild.findOneAndDelete({
                        ServerID: args.getString("id")
                    })

                    const embed = new MessageEmbed()
                    .setTitle("`💀` | black-list")
                    .setDescription(`**${server.name}** ha sido removido de la blacklist.`)
                    .setColor("#ff0000")

                    interaction.reply({embeds: [embed]})
                }
            }
        }
        
    }
}

module.exports = command;