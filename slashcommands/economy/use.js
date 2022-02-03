const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schemaInv = require("../../models/inventory-model.js");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["SEND_MESSAGES"],
    botPerms: ["SEND_MESSAGES"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("use")
    .setDescription("Usa un objeto de tu inventario de economía.")
    .addIntegerOption(o => o.setName("numero").setDescription("ID del objeto en el inventario.").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        schemaInv.findOne({
            guildid: interaction.guild.id, 
            userid: interaction.user.id
        }, (
            err, results
        ) => {
            if(err) throw err;
            if(results) {
                const args = interaction.options
                const numero = args.getInteger("numero")

                const err = new MessageEmbed()
                .setTitle(":x: Error").setColor("RED")
                const exi = new MessageEmbed()
                .setTitle("✅ Todo ha salido bien").setColor("GREEN")

                if(!Number.isInteger(numero)) {
                    err.setDescription("Debes ingresar un número positivo!")
                    return interaction.reply({embeds: [err], ephemeral: true})
                }

                let number = parseInt(numero) - 1;

                if(results.inventory.length < number) {
                    err.setDescription("Ese usuario no tiene ese producto")
                    return interaction.reply({embeds: [err], ephemeral: true})
                }

                if(results.inventory[number].product.startsWith("<@")){
                    const author = interaction.member;
                    let result = results.inventory[number].product.replace("<@&", "");
                    result = result.replace(">", "");
                    
                    author.roles.add(result);
                    exi.setDescription("Rol "+results.inventory[number].product+" agregado correctamente!")
                    interaction.reply({embeds: [exi]});
                    results.inventory.splice(number, 1);    
                    return results.save();
                } else {
                    exi.setDescription("Producto **"+results.inventory[number].product+"** usado correctamente.")
                    interaction.reply({embeds: [exi]})
                    results.inventory.splice(number, 1);
                    return results.save();
                }
            }
        })        

    }
}

module.exports = command;