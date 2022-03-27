const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageAttachment, MessageEmbed } = require("discord.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {
    category: "Diversión",

    data: new SlashCommandBuilder()
    .setName("yt-comment")
    .setDescription("Simula un comentario de youtube")
    .addStringOption(o =>
        o.setName("texto")
        .setDescription("El texto del comentario")
        .setRequired(true)
    )
    .addUserOption(o =>
        o.setName("usuario")
        .setDescription("El usuario que comenta (opcional)")
        .setRequired(false)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(_, interaction){
        const mention = interaction.options.getUser('usuario') ? interaction.guild.members.cache.get(interaction.options.getUser('usuario').id) : interaction.member; //--define mention
        let comment = interaction.options.getString('texto'); //--define comment
        let url = `${comment.replace(/ /g, "%20")}`; //--define url
        if(url.length > 35) return await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(':x: Error')
                .setDescription('Debes escribir menos de 35 caracteres!')
                .setColor('RED')
            ],
            ephemeral: true
        });
        const username = mention.nickname || mention.user.username; //--define username
        let result = `https://some-random-api.ml/canvas/youtube-comment?avatar=${mention.user.displayAvatarURL({format: "png"})}&comment=${url}&username=${username.replace(/ /g, "%20")}`; //--define result
        result = new MessageAttachment(result, 'comment.png');
        await interaction.reply({embeds: [new MessageEmbed().setDescription("Listo! ❤").setColor("GREEN")]})
        await interaction.channel.send({files: [result]}).catch(() => {
            return;
        }); //--send result
    }
}

module.exports = command;