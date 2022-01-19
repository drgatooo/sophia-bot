const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/shop-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'remove-item',
    aliases: ['removeitem', 'remover-item', 'removeritem'],
    description: 'Elimina un producto de la tienda',
    userPerms: ['MANAGE_GUILD'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    premium: false,
    uso: `<numero-item>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        schema.findOne({
            guildid: message.guild.id
        }, (
            err, results
        ) => {
            if(err) throw err;
            if(results){
                const err = new MessageEmbed()
                .setTitle(":x: Error").setColor("RED")

                if(isNaN(args[0])) {
                err.setDescription("Debes ingresar un número!")
                 return message.reply({embeds: [err] });
                }
                let number = parseInt(args[0]) - 1;
                if(results.store.length < number){
                const err = new MessageEmbed()
                    .setTitle(":x: Error").setColor("RED")
                err.setDescription("Este producto no existe.")
                    return message.reply({embeds: [err]});
                }
                results.store.splice(number, 1);
                results.save();
                const exi = new MessageEmbed()
                    .setTitle("✅ Todo ha salido bien").setColor("GREEN").setDescription("producto removido con exito!")
                message.reply({embeds: [exi]});
            } else {
                const err = new MessageEmbed()
                    .setTitle(":x: Error").setColor("RED").setDescription("No hay ningún producto en el tienda!")
                message.reply({embeds: [err]});
            }
        });

    }
}

module.exports = command


                