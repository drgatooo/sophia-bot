const { Client, Message, MessageEmbed, MessageAttachment } = require('discord.js')
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'yt-comment',
    aliases: ['comentario-youtube'],
    description: 'Simula un comentario de youtube',
    category: 'Diversion',
    args: true,
    uso: '<@usuario (opcional)> <comentario>',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
	if(!message.guild.me.permissions.has(["SEND_MESSAGES", "ATTACH_FILES"])) return message.channel.send('no tengo permisos suficientes, necesito `ATTACH_FILES`');
    const mention = message.mentions.members.first() || message.member; //--define mention
    let comment = args.join(' '); //--define comment
    let msgErr = 'debes poner el comentario que quieres simular. tambien si quieres puedes simular el comentario de otra persona ej:\n`yt-coment <@usuario> <comentario>`'; //--define msgErr
    if(message.mentions.members.first()) {
        comment = args.slice(1).join(' ');
    }
    let url = `${comment.replace(/ /g, "%20")}`; //--define url
    if(url.length > 35) return message.reply('Debes escribir menos de 35 caracteres!');
    if(message.mentions.members.first() && !args[1]) return message.channel.send(msgErr); //--we omit errors
    const username = mention.nickname || mention.user.username; //--define username
    let result = `https://some-random-api.ml/canvas/youtube-comment?avatar=${mention.user.displayAvatarURL({format: "png"})}&comment=${url}&username=${username.replace(/ /g, "%20")}`; //--define result
    result = new MessageAttachment(result, 'comment.png');
    message.channel.send({files: [result]}).catch((err) => {
        return;
    }); //--send result
    }
}

module.exports = command