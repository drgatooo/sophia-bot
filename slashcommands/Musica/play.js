const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: [`SEND_MESSAGES`],
    botPerms: [`SEND_MESSAGES`],
    category: "Música",


    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Escucha música en un canal de voz.")
    .addStringOption(o =>
        o.setName("canción")
        .setDescription("Pon el nombre de la canción que deseas escuchar.")
        .setRequired(true)
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const e = new MessageEmbed()
        .setTitle("Error<a:puntos:878324208864722954>")
        .setColor("DARK_RED")
        const args = interaction.options;
        const cancion = args.getString("canción");

        if(!interaction.member.voice.channel) return interaction.reply({embeds: [e.setDescription("Debes estar en un canal de voz.")], ephemeral: true})
        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({embeds: [e.setDescription("Debes estar en el mismo canal de voz que yo.")], ephemeral: true})
    
        interaction.client.distube.playVoiceChannel(
            interaction.member.voice.channel,
            cancion,
            {
                textChannel: interaction.channel,
                member: interaction.member
            }
        )

        const embed = new MessageEmbed()
        .setTitle("Espera un momento<a:puntos:878324208864722954>")
        .addField("**Buscando canción:**", `${cancion}`, true)
        .addField("**Solicitado por:**", `<@${interaction.user.id}>`, true)
        .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
        .setColor("GREEN")

        const listo = new MessageEmbed()
        .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
        .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
        .setColor("GREEN")

        const row = new MessageActionRow()
        .addComponents(
            [
                new MessageButton()
                .setCustomId("pause")    
                .setEmoji("⏸")
                .setStyle("PRIMARY")
            ],    
            [
                new MessageButton()
                .setCustomId("resume")
                .setEmoji("▶")
                .setStyle("PRIMARY")
            ],
            [
                new MessageButton()
                .setCustomId("skip")
                .setEmoji("⏮")
                .setStyle("PRIMARY")
            ],
            [
                new MessageButton()
                .setCustomId("stop")
                .setEmoji("⏹")
                .setStyle("PRIMARY")
            ]    
        )

        const disabled = new MessageActionRow()
        .addComponents(
            [
                new MessageButton()
                .setCustomId("pause")    
                .setEmoji("⏸")
                .setStyle("PRIMARY")
                .setDisabled()
            ],    
            [
                new MessageButton()
                .setCustomId("resume")
                .setEmoji("▶")
                .setStyle("PRIMARY")
                .setDisabled()
            ],
            [
                new MessageButton()
                .setCustomId("skip")
                .setEmoji("⏮")
                .setStyle("PRIMARY")
                .setDisabled()
            ],
            [
                new MessageButton()
                .setCustomId("stop")
                .setEmoji("⏹")
                .setStyle("PRIMARY")
                .setDisabled()
            ]    
        )

        const queue = client.distube.getQueue(interaction.member.voice.channel)

        interaction.reply({ embeds: [embed] }).then(() => {
            setTimeout(() => { 
                interaction.editReply({ embeds: [listo], components: [row] })
            }, 3000)

            const ifilter = i => i.user.id === interaction.user.id

            const collector = interaction.channel.createMessageComponentCollector({ filter: ifilter })
            collector.on("collect", async(i) => {
                if(i.customId === "pause"){
                    await i.deferUpdate()

                    try{
                        interaction.client.distube.pause(i.member.voice.channel,
                          {
                              textChannel: i.channel,
                              member: i.member
                          }
                        )

                        const pause = new MessageEmbed()
                        .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
                        .setDescription("Has pausado la música.")
                        .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
                        .setColor("GREEN")

                        i.channel.send({ embeds: [pause] })
                    } catch(e) {
                      return;
                    }
                }
                if(i.customId === "resume"){
                    await i.deferUpdate()

                    try{
                        interaction.client.distube.resume(i.member.voice.channel,
                          {
                              textChannel: i.channel,
                              member: i.member
                          }
                        )

                        const resume = new MessageEmbed()
                        .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
                        .setDescription("Has reanudado la música.")
                        .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
                        .setColor("GREEN")

                        i.channel.send({ embeds: [resume] })
                    } catch(e) {
                      return;
                    }
                }
                if(i.customId === "skip"){
                    await i.deferUpdate()

                    if(!queue.songs[1]) return i.channel.send({ embeds: [new MessageEmbed().setTitle(":x: Error").setDescription("No hay una próxima canción en la lista.").setColor("RED")], ephemeral: true }).then(msg => {
                        setTimeout(() => {
                            msg.delete()
                        }, 3000)
                    })
                    
                    try{
                        interaction.client.distube.skip(i.member.voice.channel,
                            {
                                textChannel: i.channel,
                                member: i.member
                            }
                        )

                          const skip = new MessageEmbed()
                          .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
                          .setDescription("Has saltado a la siguiente canción.")
                          .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
                          .setColor("GREEN")

                          i.channel.send({ embeds: [skip] })
                          await interaction.editReply({ embeds: [embed], components: [disabled] })
                    } catch(e) {
                        return;
                    }
                }
                if(i.customId === "stop"){
                    await i.deferUpdate()

                    try{
                        interaction.client.distube.stop(i.member.voice.channel,
                            {
                                textChannel: i.channel,
                                member: i.member
                            }
                          )

                          const stop = new MessageEmbed()
                          .setTitle("<a:Giveaways:878324188753068072> Todo ha salido bien...")
                          .setDescription("La lista ha sido eliminada.")
                          .setAuthor({ "name": `${interaction.user.username}`, "iconURL": interaction.user.displayAvatarURL({dynamic: true})})
                          .setColor("GREEN")

                          i.channel.send({ embeds: [stop] })
                          await interaction.editReply({ embeds: [embed], components: [disabled] })
                    } catch(e) {
                        return;
                    }
                }
            })
        })

    }
}

module.exports = command;