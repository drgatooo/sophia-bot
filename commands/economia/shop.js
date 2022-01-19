const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/shop-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'shop',
    aliases: ['tienda'],
    description: 'Revisa la tienda de objetos.',
    userPerms: ['SEND_MESAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {

        const results = await schema.findOne({guildid: message.guild.id});

        if(results && results.store.length > 0){
            const embedSuccess = new MessageEmbed()
            .setTitle(`🛒 Tienda de ${message.guild.name}`)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setDescription(
                `Para ver la información detallada de un producto escribe: \`${prefix}item-info <numero-del-item>\``+results.store.map((p, i) => `\n\n\`#${i+1}\`** ${p.price}$ - ${!p.product.toUpperCase().startsWith("<@") ? p.product.toUpperCase() : "ROL "+p.product.toUpperCase()}**\n${p.description}`
            ).toString().replace(/,/g, " "))
            .setColor("WHITE")
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            return message.reply({ embeds: [embedSuccess]});
        } else {
            const embedFail = new MessageEmbed()
            .setTitle(`🛒 Tienda de ${message.guild.name}`)
            .setDescription("☹ No hay productos en la tienda, agregalos!")
            .setColor("RED")
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
            return message.reply({ embeds: [embedFail]});
        }

    }
}

module.exports = command


                