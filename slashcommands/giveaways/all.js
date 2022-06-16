const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js-light");

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
            .addStringOption(o => o.setName("id-sorteo").setDescription("Sorteo a eliminar.").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("end")
        .setDescription("Termina un sorteo activo!")
            .addStringOption(o => o.setName("id-sorteo").setDescription("Sorteo a terminar.").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("pause")
        .setDescription("Pon en pausa un sorteo activo!")
            .addStringOption(o => o.setName("id-sorteo").setDescription("Sorteo a pausar.").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("unpause")
        .setDescription("Quita la pausa a un sorteo activo!")
            .addStringOption(o => o.setName("id-sorteo").setDescription("Sorteo a reanudar.").setRequired(true))
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
    const prize = `🎉 ${interaction.options.getString('premio')}`
    
    if(isNaN(ms(duration))) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("Ingresa un tiempo valido.")
        .setColor("RED")
    ], ephemeral: true });

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

    if(winnerCount > 10) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No puedo crear un sorteo con mas de 10 ganadores.")
        .setColor("RED")
    ], ephemeral: true });

    client.giveawaysManager.start(interaction.channel, {
        duration: ms(duration),
        winnerCount,
        prize,
        hostedBy: interaction.user,
        messages: {
        giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
        giveawayEnded: '🎉🎉 **GIVEAWAY FINALIZADO** 🎉🎉',
        inviteToParticipate: 'Reacciona a 🎉 para participar!',
        winMessage: 'Felicidades, {winners}! has ganado **{this.prize}**!',
        hostedBy: 'Creado por: **{this.hostedBy}**',
        drawing:"Tiempo restante: {timestamp}",
        embedFooter: '{this.winnerCount} ganador(es)',
        noWinner: 'Giveaway cancelado, sin participantes validos.',
        winners: "Ganador(es):",
        endedAt:"Finalizado",
        }
    }).then((msg) => {
        interaction.reply({embeds: [
            new MessageEmbed()
            .setTitle("Vale! 💟")
            .setDescription("He creado un sorteo!")
            .addField("Tiempo:", `${duration}`, true)
            .addField("Ganador(es):", `${winnerCount}`, true)
            .addField("Premio:", `${prize}`, true)
            .addField("ID:", `${msg.messageId}`)
            .setColor("GOLD")
        ], ephemeral: true})
    })
}

if(subcmd === "reroll"){

    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('id-sorteo'));

    if(!giveaway) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No existe un sorteo con el ID: "+interaction.options.getString('id-sorteo'))
        .setColor("RED")
    ], ephemeral: true });

    const messageId = interaction.options.getString('id-sorteo');

    client.giveawaysManager.reroll(messageId, {
        messages: {
            congrat: ':tada: Nuevo(s) ganador(es): {winners}! Felicidades, Has ganado **{this.prize}**!',
            error: 'Sin participantes validos!'
        }
    }).then(() => {
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
        .setDescription("No existe un sorteo con el ID: "+interaction.options.getString('id-sorteo'))
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
        .setDescription("No existe un sorteo con el ID: "+interaction.options.getString('id-sorteo'))
        .setColor("RED")
    ], ephemeral: true });

    const messageId = interaction.options.getString('id-sorteo');
        client.giveawaysManager.end(messageId).then(() => {
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription('Hecho! Giveaway finalizado!')], ephemeral: true });
        }).catch(() => {
            return
        });
}

if(subcmd === "pause"){

    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('id-sorteo'));

    if(!giveaway) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No existe un sorteo con el ID: "+interaction.options.getString('id-sorteo'))
        .setColor("RED")
    ], ephemeral: true });

    const messageId = interaction.options.getString('id-sorteo');
    client.giveawaysManager.pause(messageId, {
            isPaused: true,
            content: '⚠️ **SORTEO EN PAUSA !** ⚠️',
            unPauseAfter: null,
            embedColor: '#FFFF00',
            infiniteDurationText: '**∞**'
    }).then(() => {
        interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription('Hecho! Giveaway pausado!')], ephemeral: true });
    }).catch(() => {
        return
    });

}

if(subcmd === "unpause"){

    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('id-sorteo'));

    if(!giveaway) return interaction.reply({embeds: [
        new MessageEmbed()
        .setTitle(":x: Error")
        .setDescription("No existe un sorteo con el ID: "+interaction.options.getString('id-sorteo'))
        .setColor("RED")
    ], ephemeral: true });

    const messageId = interaction.options.getString('id-sorteo');
        client.giveawaysManager.unpause(messageId).then(() => {
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription('Hecho! Giveaway reanudado!')], ephemeral: true });
        }).catch(() => {
            return
        });
}

    }
}

module.exports = command;