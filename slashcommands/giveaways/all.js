const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["MANAGE_CHANNELS"],
    botPerms: ["MANAGE_CHANNELS"],
    category: "Giveaways",


    data: new SlashCommandBuilder()
    .setName("giveaways")
    .setDescription("Inicia un sorteo!")
    .addSubcommand(o =>
        o.setName("start")
        .setDescription("Inicia un sorteo!")
            .addStringOption(o => o.setName("duracion").setDescription("Tiempo que durará el sorteo.").setRequired(true))
            .addIntegerOption(o => o.setName("ganadores").setDescription("Cantidad de ganadores.").setRequired(true))
            .addStringOption(o => o.setName("premio").setDescription("¿Que ganara el ganador?").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("reroll")
        .setDescription("Elije nuevos ganadores!")
            .addStringOption(o => o.setName("id-sorteo").setDescription("¿Que ganara el ganador?").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("delete")
        .setDescription("Elimina un sorteo activo!")
            .addStringOption(o => o.setName("id-sorteo").setDescription("¿Que ganara el ganador?").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("end")
        .setDescription("Termina un sorteo activo!")
            .addStringOption(o => o.setName("id-sorteo").setDescription("¿Que ganara el ganador?").setRequired(true))
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    
    const subcmd = interaction.options.getSubcommand()

if(subcmd === "start"){

    const ms = require('ms');
    const duration = interaction.options.getString('duracion');
    const winnerCount = interaction.options.getInteger('ganadores');
    const prize = interaction.options.getString('premio');
    
    if(duration > ms("26d")) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedo crear un sorteo con una duración de mas de 26 dias.")
        .setColor("RED")
    ], ephemeral: true });

    if(duration < ms("1m")) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedo crear un sorteo con una duración de menos de 1 minuto.")
        .setColor("RED")
    ], ephemeral: true });

    if(winnerCount > 6) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedo crear un sorteo con mas de 6 ganadores.")
        .setColor("RED")
    ], ephemeral: true });

    client.giveawaysManager.start(interaction.channel, {
        duration: ms(duration),
        winnerCount,
        prize,
        messages: {
        giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
        giveawayEnded: '🎉🎉 **GIVEAWAY FINALIZADO** 🎉🎉',
        inviteToParticipate: 'Reacciona a 🎉 para participar!',
        winMessage: 'Felicidades, {winners}! has ganado **{this.prize}**!\n{this.messageURL}',
        drawing:"Tiempo restante: {timestamp}",
        embedFooter: '{this.winnerCount} ganador(es)',
        noWinner: 'Giveaway cancelado, sin participantes validos.',
        endedAt:"Finalizado",
        hostedBy: 'Creado por: {this.hostedBy}',
        }
    }).then(() => {
        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle("Vale! 💟")
            .setDescription("He creado un sorteo!")
            .addField("Tiempo:", `${duration}`, true)
            .addField("Ganador(es):", `${winnerCount}`, true)
            .addField("Premio:", `${prize}`, true)
            .setColor("GOLD")
        ], ephemeral: true})
    })
}

if(subcmd === "reroll"){

    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('id-sorteo'));

    if(!giveaway) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Al parecer el ID: "+interaction.options.getString('id-sorteo')+" del sorteo no lo he encontrado en este servidor!")
        .setColor("RED")
    ], ephemeral: true });

    const messageId = interaction.options.getString('id-sorteo');

    client.giveawaysManager.reroll(messageId).then(() => {
        interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription('Hecho! Giveaway reroll!')] });
    }).catch(() => {
        return
    })

}

if(subcmd === "delete"){

    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('id-sorteo'));

    if(!giveaway) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Al parecer el ID: "+interaction.options.getString('id-sorteo')+" del sorteo no lo he encontrado en este servidor!")
        .setColor("RED")
    ], ephemeral: true });

    const messageId = interaction.options.getString('id-sorteo');
    client.giveawaysManager.delete(messageId).then(() => {
        interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription('Hecho! Giveaway eliminado!')], ephemeral: true });
    }).catch(() => {
        return
    });

}

if(subcmd === "end"){

    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('id-sorteo'));

    if(!giveaway) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Al parecer el ID: "+interaction.options.getString('id-sorteo')+" del sorteo no lo he encontrado en este servidor!")
        .setColor("RED")
    ], ephemeral: true });

    const messageId = interaction.options.getString('id-sorteo');
        client.giveawaysManager.end(messageId).then(() => {
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription('Hecho! Giveaway finalizado!')], ephemeral: true });
        }).catch(() => {
            return
        });
}

    }
}

module.exports = command;