const { SlashCommandBuilder } = require(`@discordjs/builders`),
captchaSchema = require(`../../models/captcha`),
{ CommandInteraction, Client } = require(`discord.js`)

module.exports = {
    userPerms: [`MANAGE_GUILD`],
    botPerms: [],
    category: "Administración",
    isPremium: true,
    data: new SlashCommandBuilder()
    .setName(`configcaptcha`)
    .setDescription(`Configura el sistema de verificación captcha`)
    .addSubcommand(s =>//Agregamos un subcomando para habilitar o deshabilitar la varificación captcha
        s.setName(`habilitar`)
        .setDescription(`Habilita o deshabilita el sistema de verificación captcha`)
        .addBooleanOption(o => o.setName(`habilitar`).setDescription(`Usa true para habilitar y false para deshabilitar`).setRequired(true))
    )
    .addSubcommand(s => //Agregamos un subcomando para establecer el rol que se dará
        s.setName(`rol`)
        .setDescription(`Establece el rol que se dará al pasar la verificación`)
        .addRoleOption(o => o.setName(`rol`).setDescription(`Menciona un rol o no escribas nada para eliminar`))
    )
    .addSubcommand(s => //Se crea un nuevo subcomando para establecer el cnala donde solo se podrá usar el comando /captcha
        s.setName(`canal`)
        .setDescription(`Establece un canal para la verificación`)
        .addChannelOption(o => o.setName(`canal`).setDescription(`Menciona un canal o no escribas nada para eliminar`))
    ),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: `Tienes que tener permisos para gestionar el servidor`}) //Damos error si la persona no tiene permisos para gestionar el servidor
        var db = await captchaSchema.findOne({ guild: interaction.guildId }) //Buscamos el servidor en la base de datos

        if(!db) { //Si no está en la base de datos
            var newDB = new captchaSchema({enable: false, guild: interaction.guildId}) //Añadimos el servidor a la base de datos
            await newDB.save() //Guardamos los cambios en la db
            db = await captchaSchema.findOne({ guild: interaction.guildId }) //Sustituimos la db vacia por la nueva que se creo
        }

        if(interaction.options.getSubcommand() === `habilitar`) {
            await enable(client, interaction, db) //Si el subcomando es "habilitar" entonces ejecutamos la función enable
        } else if(interaction.options.getSubcommand() === `rol`) {
            await role(client, interaction, db) //En caso de que sea el subcomando "rol" ejecutamos la función role
        } else {
            await channel(client, interaction, db) //Y si no fue ninguna de las anteriores ejecutamos la función channel
        }
    }
}

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */

async function enable(client, interaction, db) {
    const en = interaction.options.getBoolean(`habilitar`) //Obtenemos la opción para habilitar y la amacenamos
    if(db.enable == en) return interaction.reply({ content: `La verificación ya está ${en == true ? `habilitada` : `deshabilitada`}`, ephemeral: true}) //Si la opción es la misma que está en la base de datos avisamos que no es necesario cambiarla

    db.enable = en //Cambiamos la propiedad de habilitar de la db, por la que se recolectó en la opción

    await db.save() //Guardamos la nueva db modificada

    interaction.reply({ content: `Ahora el sistema de verificación captcha está ${en == true ? `habilitado` : `desactivado`}`}) //Avisamos que todo salió bien
}

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */

async function role(client, interaction, db) {
    const role = interaction.options.getRole(`rol`) //Buscamos el rol

    if(role) { //Si puso el parametro del rol
        if(!interaction.guild.roles.cache.has(role.id)) return interaction.reply({ content: `El rol no pertenece a este servidor, por favor introduce un rol que se encuentre en el servidor`, ephemeral: true}) //Si el rol no pertenece al servidor avisa
        if(interaction.guild.me.roles.highest.comparePositionTo(role) <= 0) return interaction.reply({ content: `El rol es superior al mio`, ephemeral: true}) //Si el rol es superior al del bot avisa sobre el fallo
        if(db.role && (db.role === role.id) == true){ //Si existe un rol en la db y es el mismo que la opción rol
            return interaction.reply({ content: `El rol es el mismo que está almacenado en la base de datos`, ephemeral: true}) //Damos aviso sobre ero
        } else { //Si no es el mismo rol
            db.role = `${role.id}` //Establecemos el nuevo rol
            interaction.reply({ content: `Ahora el rol **${role.name}** será dado a las personas que se verifiquen al usar el captcha`}) //Avisamos que todo salió bien
        }
    } else { //En caso de que no se diera la opción rol
        if((db.role == ``)) { //Si el rol en la base de datos está vacio
            return interaction.reply({ content: `El rol ya estaba eliminado. Establece uno nuevo`, ephemeral: true}) //Avisamos que ya está vacio
        } else { //Sino, se diera la opción del rol
            db.role = `` //El rol será removido de la base de datos
            interaction.reply({ content: `Se elimino el rol correctamente`}) //Mandamos aviso de que se eliminó el rol
        }
    }

    db.save() //Guardamos los cambios en la base de datos
}

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */

async function channel(client, interaction, db) {
    const channel = interaction.options.getChannel(`canal`) //Buscamos la opción del canal

    if(channel) { //Si existe un canal
        if(!interaction.guild.channels.cache.has(channel.id)) return interaction.reply({ content: `El canal no pertenece al servidor, por favor intenta con un canal que esté dentro del servidor`, ephemeral: true}) //Si el canal no se encuentrá en el servidor avisamos
        if(!channel.permissionsFor(interaction.guild.me).has("VIEW_CHANNEL")) return interaction.reply({ content: `No puedo ver el canal`, ephemeral: true}) //Si el bot no puede leer mensajes en el canal avisará
        if(channel.type !== `GUILD_TEXT`) return interaction.reply({ content: `El canal debe de ser un canal de texto normal`, ephemeral: true}) //Si el tipo del canal no es de tipo GUILD_TEXT avisamos que no se puede establecer ese canal
        if(db.channel && (db.channel === channel.id) == true) { //Si existe un canal en la db y es el mismo que está en la db
            return interaction.reply({ content: `El canal es el mismo que se encuentra en la base de datos`, ephemeral: true}) //Avisamos que no es necesario cambiar el canal
        } else { //Si no existe o no es el mismo
            db.channel = `${channel.id}` //Guardamos el nuevo canal
            interaction.reply({ content: "El comando `/captcha` ahora solo se puede usar en el canal <#" + channel.id + ">"}) //Mandamos un mensaje de que se cambió el canal
        }
    } else { //En caso de que no se tenga la opción del canal
        if(db.channel == ``) { //Si no existe canal
            return interaction.reply({ content: `No existe un canal en la base de datos, por lo que no se puede borrar`, ephemeral: true}) //Avisamos que ya está eliminado y no es necesario usarlo
        } else { //En caso de que exista
            db.channel = `` //Borramos el canal
            interaction.reply({ content: "Ahora el comando `/captcha` puede ser usado en todo el servidor"}) //Avisamos que se borró el canal
        }
    }

    db.save() //Guardamos los cambios
}