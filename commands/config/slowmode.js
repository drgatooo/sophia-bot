const { Client, Message, MessageEmbed } = require('discord.js');
const ms = require('ms');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'slowmode',
    description: 'Ajusta el slowmode de el canal',
    uso: '<tiempo | off>',
    userPerms: ['MANAGE_CHANNELS'],
    category: 'Configuration',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {
let time = args[0];
if(!time) return message.reply(`Debes escribir un tiempo, ej: \`${prefix}slowmode 1m, ${prefix}slowmode 6h, ${prefix}slowmode off, etc\``);
if(time === 'off'){
    message.channel.setRateLimitPerUser(0);

    return message.reply("El **SlowMode** para este canal a sido desactivado");
};

let convert = ms(time);
if(convert > 21600000) return message.reply('hubo un error inesperado, puede ser que hayas puesto mas de 6h (el maximo).');
let toSecond = Math.floor(convert / 1000);
if(!toSecond || toSecond == undefined) return message.reply("Debes poner un tiempo valido");
if(toSecond < 1) return message.reply('Debes poner un tiempo mayor a 1!');

await message.channel.setRateLimitPerUser(toSecond).catch(err => {
   return message.reply('hubo un error inesperado, puede ser que hayas puesto mas de 6h (el maximo).');
});

message.reply(`El **SlowMode** de este canal ha sido cambiado a: \`${time}\``);
    }
}

module.exports = command