const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    isPremium: true,
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("votekick")
    .setDescription("Realiza una votación, para kickear a un usuario!")
    .addUserOption(o => o.setName("usuario").setDescription("El usuario que deseas enviar a la votación.").setRequired(true)),
    
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    let kickuser = interaction.options.getUser("usuario")

    var kickear = "👍"//"<a:Stable:910938393968517180>"
    var noKickear = "👣"//"<a:Down:910938393993699350>"

    const embed = new MessageEmbed()
    .setColor("#00FFFF")
    .setTitle("Vota para sacar al usuario!")
    .addField("Usuario:", `${kickuser}`)
    .setDescription("Se ha abierto una nueva votación para sacar a un usuario del discord, participa en la decisión votando!")

    interaction.reply({embeds: [new MessageEmbed()
    .setTitle("Listo!")
    .setColor("GREEN")
    ], ephemeral: true})
    await interaction.channel.send({embeds: [embed]}).then(async (msg) => {

    await msg.react(kickear)
    await msg.react(noKickear)

    const filtro = reaction => reaction.emoji.name === kickear || reaction.emoji.name === noKickear
    const reacciones = await msg.awaitReactions({filter: filtro, time: 30000 })
    
    var NO_Cuenta = reacciones.get(noKickear).count
    var SI_Cuenta = reacciones.get(kickear);

    if (SI_Cuenta == undefined) {
      var SI_Cuenta = 1;
    } else {
      var SI_Cuenta = reacciones.get(kickear).count
    }

    var sumsum = new MessageEmbed()
    .addField(
        "Votación Terminada:", "----------------------------------------\n" +
        `Votos Totales (NO): **${NO_Cuenta - 1}**\n` +
        `Votos Totales (Si): **${SI_Cuenta - 1}**\n` +
        "----------------------------------------\n" +
        "NOTA: Se necesitan (+1) Votos\n" +
        "----------------------------------------", true
    )
    .setColor("#00FFFF")

    await msg.edit({ embeds: [sumsum] })

    if (SI_Cuenta >= 0 && SI_Cuenta > NO_Cuenta) {

      kickuser.kick("has perdido, la encuesta").then(() => {
        msg.edit({embeds:[new MessageEmbed()
            .setColor("RED")
            .setDescription(`${kickuser} Ha sido Kickeado Exitosamente`)
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

module.exports = command;