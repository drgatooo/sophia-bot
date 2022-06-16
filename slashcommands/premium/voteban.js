const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js-light");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["BAN_MEMBERS"],
    botPerms: ["BAN_MEMBERS"],
    isPremium: true,
    category: "premium",


    data: new SlashCommandBuilder()
    .setName("voteban")
    .setDescription("Realiza una votación, para banear a un usuario!")
    .addUserOption(o => o.setName("usuario").setDescription("El usuario que deseas enviar a la votación.").setRequired(true)),
    
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
    const embedError = new MessageEmbed({ title: ":x: Error", color: "RED"})
    var kickuser = interaction.options.getUser("usuario")
    var kickMember = interaction.guild.members.cache.get(kickuser.id)
    var kickear = "💹"
    var noKickear = "❎"

    const embed = new MessageEmbed()
    .setColor("#00FFFF")
    .setTitle("Vota para banear al usuario!")
    .addField("Usuario:", `${kickuser}`)
    .setDescription("Se ha abierto una nueva votación para sacar a un usuario del discord, participa en la decisión votando!")

    if(interaction.member.roles.highest.comparePositionTo(kickMember.roles.highest) <= 0) return interaction.reply({ 
        embeds: [ 
            embedError.setDescription(`El miembro tiene un rol superior al tuyo.`) 
        ], 
        ephemeral: true 
    })
    if(interaction.guild.me.roles.highest.comparePositionTo(kickMember.roles.highest) <= 0) return interaction.reply({ 
        embeds: [ 
            embedError.setDescription(`El miembro tiene un rol superior al mio.`) 
        ], 
        ephemeral: true 
    })
    if(!kickMember.bannable) return interaction.reply({
        embeds: [
            embedError.setDescription(`El miembro no puede ser baneado!`)
        ],
        ephemeral: true
    })

    interaction.reply({embeds: [new MessageEmbed()
    .setTitle("Listo!")
    .setDescription("He emitido la votación, esperemos los resultados!")
    .setColor("GREEN")
    ], ephemeral: true})
    await interaction.channel.send({embeds: [embed]}).then(async (msg) => {

    await msg.react(kickear)
    await msg.react(noKickear)

    const filtro = reaction => reaction.emoji.name === kickear || reaction.emoji.name === noKickear
    const reacciones = await msg.awaitReactions({filter: filtro, time: 30000 })
    
    var NO_Cuenta = reacciones.get(noKickear)
    var SI_Cuenta = reacciones.get(kickear);

    if (SI_Cuenta == undefined) {
      var SI_Cuenta = 1;
    } else {
      var SI_Cuenta = reacciones.get(kickear).count
    }

    if (NO_Cuenta == undefined) {
        var NO_Cuenta = 1;
      } else {
        var NO_Cuenta = reacciones.get(noKickear).count
      }

    var sumsum = new MessageEmbed()
    .addField(
        "Votación Terminada:", "----------------------------------------\n" +
        `Votos Totales (NO): **${NO_Cuenta - 1}**\n` +
        `Votos Totales (Si): **${SI_Cuenta - 1}**\n` +
        "----------------------------------------\n" +
        "NOTA: Se necesitan (+10) Votos\n" +
        "----------------------------------------", true
    )
    .setColor("#00FFFF")

    await msg.edit({ embeds: [sumsum] })

    if (SI_Cuenta >= 10 && SI_Cuenta > NO_Cuenta) {

      kickMember.kick("has perdido, la encuesta").then(() => {
        msg.edit({embeds:[new MessageEmbed()
            .setColor("RED")
            .setDescription(`${kickuser} Ha sido baneado Exitosamente`)
        ]})
    
        })
    } else {
        msg.edit({embeds: [new MessageEmbed()
            .setColor("RED")
            .setDescription(`${kickuser} Se ha salvado!`)
        ]})
    }

})
    }
}

module.exports = command