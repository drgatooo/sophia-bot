const { SlashCommandBuilder } = require(`@discordjs/builders`),
{ Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton} = require(`discord.js`),
firstLineNumbers = new MessageActionRow().addComponents(
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
secondLineNumbers = new MessageActionRow().addComponents(
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
)

module.exports = {
    userPerms: [],
    botPerms: [],
    data: new SlashCommandBuilder()
    .setName(`captcha`)
    .setDescription(`Usa el comando para verificarte en el servidor`),


    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction) {
        const role = interaction.guild.roles.cache.get(`911114183892938822`) //Aquí se obtendría el rol de la base de datos
        const channel = 928421423851110461 //Aquí hiría el canal donde solo se enviaría el captcha
        var captcha = []

        if(!channel === interaction.channelId) return interaction.reply({ content: `Este comando solo se puede usar en <#${channel.id}>`, ephemeral: true}) //Comprobamos que el canal esté en el canal para los captchas
        if(interaction.member.roles.cache.has(role)) return interacion.reply({ content: `Ya haz usado el chache`, ephemeral: true}) //Comprobamos que el miembro no tenga el rol

        for(let i = 0; i < 6; i++) {
            captcha.push(`${Math.floor(Math.random() * 10)}`)
        }

        const embedCaptcha = new MessageEmbed({
            title: `¡Estamos verificando que seas humano!`,
            description: `Por favor, usa los botones para teclear el siguiente código:\n\n**${captcha.join(``)}**`,
            color: `YELLOW`,
            footer: {
                text: `¡Solo tienes un minuto para responder correctamente!`
            }
        })

        interaction.reply({ embeds: [embedCaptcha], components: [firstLineNumbers, secondLineNumbers]})

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 })

        collector.on("collect", async(i) => {
            if(!i.member.id === interaction.user.id) return i.reply({ content: `¡Esta interacción no es para ti!`, ephemeral: true})

            var choice = i.customId.substring(i.customId.length - 1)
            console.log(choice, captcha)

            if(!captcha[0] === choice) return i.reply({ content: `¡Haz contestado mal el captcha! Usa de nuevo el mensaje para empezar de nuevo`, ephemeral: true})

            captcha.shift()

            if(captcha.length == 0) {
                interaction.member.roles.add(role)
                i.reply({ content: `Haz pasado el captcha!`, ephemeral: true})
            } else {
                i.reply({ content: `Vas bien!`, ephemeral: true})
            }
        })
    }
}