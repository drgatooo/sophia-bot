const { SlashCommandBuilder } = require(`@discordjs/builders`),
{ Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton} = require(`discord.js`),
captchaSchema = require(`../../models/captcha`),
firstLineNumbers = new MessageActionRow().addComponents( //La línea de los botones del 0 al 4
    new MessageButton()
    .setCustomId(`captcha0`)
    .setLabel(`0`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha1`)
    .setLabel(`1`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha2`)
    .setLabel(`2`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha3`)
    .setLabel(`3`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha4`)
    .setLabel(`4`)
    .setStyle(`PRIMARY`)
),
secondLineNumbers = new MessageActionRow().addComponents( //Línea de los botones del 5 al 9
    new MessageButton()
    .setCustomId(`captcha5`)
    .setLabel(`5`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha6`)
    .setLabel(`6`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha7`)
    .setLabel(`7`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha8`)
    .setLabel(`8`)
    .setStyle(`PRIMARY`),

    new MessageButton()
    .setCustomId(`captcha9`)
    .setLabel(`9`)
    .setStyle(`PRIMARY`)
),
failedCaptcha = new MessageEmbed({ //El embed que se mandará al fallar el captcha
    title: `:x: ¡Haz fallado el captcha!`,
    color: `RED`,
    description: `Vuelve a intentarlo y asegurate de hacerlo con calma`
}),
completedCaptcha = new MessageEmbed({ //El embed cuando se complete el captcha
    title: `¡Haz pasado el captcha!`,
    color: `GREEN`,
    description: `¡Disfruta tu estadía en el servido!`
}),
timeOutEmbed = new MessageEmbed({ //El embed que se mandará si el captcha terminó el tiempo para responder
    title: `:x: ¡El tiempo se acabo!`,
    color: `RED`,
    description: "No has compledato la verificación, vuelve a usar el comando `/captcha`"
})

module.exports = {
    userPerms: [],
    botPerms: [],
    category: 'Utilidad',
    data: new SlashCommandBuilder()
    .setName(`captcha`)
    .setDescription(`Usa el comando para verificarte en el servidor`),


    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction //Ponemos los tipos a las constantes iniciales de la función run
     */

    async run(client, interaction) {
        const db = await captchaSchema.findOne({ guild: interaction.guildId})
        var captcha = [] //Creamos un array vacio

        if(!db) return interaction.reply({ content: `No se ha configurado la verificación captcha en este servidor`, ephemeral: true}) //Verificamos que la base de datos tenga al servidor
        if(db.enable == false) return interaction.reply({ content: `La verificación captcha en este servidor está desactivada!`, ephemeral: true}) //Checamos que el sistema no esté desactivado
        if(!db.role) return interaction.reply({ content: `El rol que se dará al pasar el captcha no está establecido. Por favor habla con un administrador para que resuelva el problema`, ephemeral: true}) //Checamos si existe un rol en la base de datos
        if(db.channel){ //Si existe un canal
            if(!interaction.guild.channels.cache.has(db.channel)) return interaction.reply({ content: `El canal de la verificación fue eliminado, contacta con un admin para que establezca un nuevo canal`, ephemeral: true}) //Verificamos que exista el canal en el servidor
            if(interaction.channelId !== db.channel) return interaction.reply({ content: `Este comando solo se puede usar en <#${db.channel}>`, ephemeral: true}) //Comprobamos que el canal esté en el canal para los captchas
        }
        const role = interaction.guild.roles.cache.get(db.role) //Buscamos el rol

        if(!role) return interaction.reply({ content: `No se encontró el rol puede que haya sido eliminado`, ephemeral: true}) //Si no se encuentra el rol retornamos
        if(interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `Ya haz usado el chaptcha`, ephemeral: true}) //Comprobamos que el miembro no tenga el rol

        for(let i = 0; i < 6; i++) {  //Hacemos que se pongan 6 dijitos del 0 al 9 en el array captcha
            captcha.push(`${Math.floor(Math.random() * 10)}`)
        }

        const embedCaptcha = new MessageEmbed({ //El embed del captcha
            title: `¡Estamos verificando que seas humano!`,
            description: `Por favor, usa los botones para teclear el siguiente código:\n\n**${captcha.join(``)}**`,
            color: `YELLOW`,
            footer: {
                text: `¡Solo tienes un minuto para responder correctamente!`
            }
        })

        interaction.reply({ embeds: [embedCaptcha], components: [firstLineNumbers, secondLineNumbers]}) //Mandamos el mensaje con el embed y los botones del 0 al 9

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 }) //Creamos un collector de 60 segundos
        var collectorEnd = false //Una variable para saber si el captcha finalizó por que quisimos, esto sirve para averiguar si el collector finalizó por tiempo

        collector.on("collect", async(i) => { //Cuando se prenda el collector
            if(!i.member.id === interaction.user.id) return i.reply({ content: `¡Esta interacción no es para ti!`, ephemeral: true}) //Si el id no es el mismo de la persona que creó la interacción retornará

            var choice = i.customId.substring(i.customId.length - 1) //Agarramos el id del boton y sustraemos el número

            if(captcha[0] !== choice) { //Sí el numero que debería poner con los botones no es el mismo
                collectorEnd = true // Ponemos que finalizamos nosotros el captcha
                collector.stop() //Finalizamos el collector
                return interaction.editReply({ embeds: [failedCaptcha], components: []}) //Damos aviso de que fallo
            }

            captcha.shift() //En caso de que si lo sea, quitamos el primer elemento del array captcha

            if(captcha.length == 0) { //Si al array captcha no le quedan más elementos
                interaction.member.roles.add(role) //Damos el rol
                interaction.editReply({ embeds: [completedCaptcha], components: []}) //Repetimos la interacción y decimos que ha completado el captcha
                collectorEnd = true //Decimos que cerramos el collector
                collector.stop() //Paramos el collector
            } else {
                embedCaptcha.setFooter({ text: `${Math.floor(6 - captcha.length)}/6`}) //Le ponemos en el footer del embed su progreso
                interaction.editReply({ embeds:[embedCaptcha]}) //Editamos el embed captcha. Solo se cambia el footer
            }
        })

        collector.on("end", collected => { //Cuando finalice el captcha
            if(collectorEnd == false) interaction.editReply({ embeds: [timeOutEmbed], components: []}) //Si no finalizamos el collector nosotros, entonces será por tiempo, así que avisamos que se acabó el tiempo
        })
    }
}