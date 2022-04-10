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
    .addIntegerOption(o => o.setName("numero").setDescription("Número del objeto en el inventario.").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        schemaInv.findOne({
            guildid: interaction.guild.id, 
            userid: interaction.user.id
        }, async (err, results) => {
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
                    return await interaction.reply({embeds: [err], ephemeral: true})
                }

                let number = parseInt(numero) - 1;

                if(results.inventory.length < number) {
                    err.setDescription("Ese usuario no tiene ese producto")
                    return await interaction.reply({embeds: [err], ephemeral: true})
                }
                try {
                if(results && results.inventory[number].rolId !== null){
                    const author = interaction.member;
                    let result = results.inventory[number].rolId;
                    
                    author.roles.add(result).catch(async _ => {
                        err.setDescription("No he podido agregarte el rol, [puede ser por falta de permisos]\nConsulta con un administrador para resolver el problema!");
                        return await interaction.reply({embeds: [err], ephemeral: true})
                    });
                    if(!author.roles.cache.has(result)){
                        exi.setDescription("Rol <@&"+results.inventory[number].rolId+"> agregado correctamente!")
                    await interaction.reply({embeds: [exi]});
                    } else {
                        await interaction.reply({embeds: [
                            new MessageEmbed()
                            .setTitle(':x: Error')
                            .setDescription('Ya tienes ese rol!')
                            .setColor("RED")
                        ], ephemeral: true});
                    }
                    results.inventory.splice(number, 1);    
                    return results.save();
                } else {
                    exi.setDescription("Producto **"+results.inventory[number].product+"** usado correctamente.")
                    await interaction.reply({embeds: [exi]})
                    results.inventory.splice(number, 1);
                    return results.save();
                }
            } catch(err) {
                return await interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(":x: Error")
                    .setDescription("No se ha podido agregar el rol, revisa que el número que hayas puesto exista en tu inventario.")
                    .setColor("RED")
                ], ephemeral: true});
            }
            }
        })        

    }
}

module.exports = command;