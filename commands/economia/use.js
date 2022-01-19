const { Client, Message, MessageEmbed } = require('discord.js')
const schemaInv = require("../../models/inventory-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'use',
    aliases: ['use-item', 'usar', 'usar-item'],
    description: 'Usa un objeto de tu inventario',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    category: 'Economy',
    args: true,
    premium: false,
    uso: `<numero-item>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

        schemaInv.findOne({
            guildid: message.guild.id, 
            userid: message.author.id
        }, (
            err, results
        ) => {
            if(err) throw err;
            if(results) {
                const err = new MessageEmbed()
                .setTitle(":x: Error").setColor("RED")
                const exi = new MessageEmbed()
                .setTitle("✅ Todo ha salido bien").setColor("GREEN")

                if(isNaN(args[0])) {
                    err.setDescription("Debes ingresar un número!")
                    return message.reply({embeds: [err]})
                }

                let number = parseInt(args[0]) - 1;

                if(results.inventory.length < number) {
                    err.setDescription("Ese usuario no tiene ese producto")
                    return message.reply({embeds: [err]})
                }

                if(results.inventory[number].product.startsWith("<@")){
                    const author = message.member;
                    let result = results.inventory[number].product.replace("<@&", "");
                    result = result.replace(">", "");
                    
                    author.roles.add(result);
                    exi.setDescription("Rol "+results.inventory[number].product+" agregado correctamente!")
                    message.reply({embeds: [exi]});
                    results.inventory.splice(number, 1);    
                    return results.save();
                } else {
                    exi.setDescription("Producto **"+results.inventory[number].product+"** usado correctamente.")
                    message.reply({embeds: [exi]})
                    results.inventory.splice(number, 1);
                    return results.save();
                }
            }
        })

    }
}

module.exports = command


                