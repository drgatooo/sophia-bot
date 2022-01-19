const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/shop-model.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ["MANAGE_GUILD"],
    botPerms: ["MANAGE_GUILD"],
    category: "Economía",


    data: new SlashCommandBuilder()
    .setName("create-item")
    .setDescription("Crea un item para la tienda!")
    .addStringOption(o => o.setName("producto").setDescription("Nombre del producto.").setRequired(true))
    .addIntegerOption(o => o.setName("precio").setDescription("Precio del producto.").setRequired(true))
    .addStringOption(o => o.setName("descripcion").setDescription("Descripcion del producto, ¿Para que sirve?, ¿Para que es?")),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    const err = new MessageEmbed()
    .setTitle(":x: Error")
    .setColor("RED")

    const exi = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("✅ Exito")

    const results = await schema.findOne({ guildid: interaction.guild.id });
    const args = interaction.options;
    const regex = /<@([0-9]*)>|<@&([0-9]*)/g;
    let productName = args.getString("producto")
    let productPrice = args.getInteger("precio")
    let productDescription = args.getString("descripcion")

    //-- conditions

    if(!Number.isInteger(productPrice)) return interaction.reply({embeds: [err.setDescription("Debes poner un número positivo!")], ephemeral: true})
    if(regex.test(productName)) productName = productName.replace(/<@>/g, "");
    if(regex.test(productName) && !interaction.guild.roles.cache.get(productName.match(regex)[1])) {
        err.setDescription("Debes poner un rol inferior al mio!")
        return interaction.reply({embeds: [err], ephemeral: true});
    }

    if(!productDescription) productDescription = 'Sin descripción';

    const uuid = () => {
    const { v4: uuidv4 } = require("uuid");
    let id = uuidv4();
    return id.slice(0, 8);
    };
    if(results) {
        await schema.updateOne({
            guildid: interaction.guild.id
        },
        {
            $push: {
                store: [
                    {
                        id: uuid(),
                        product: productName,
                        price: productPrice,
                        description: productDescription,
                    },
                ],
            },
        });
        exi.setDescription("Producto agregado correctamente.")
        return interaction.reply({embeds: [exi]});
    } else {
        const newShop = new schema({
            guildid: interaction.guild.id,
            store: [
                {
                    id: uuid(),
                    product: productName,
                    price: productPrice,
                    description: productDescription,
                },
            ],
        });
        await newShop.save();
        exi.setDescription("Producto agregado correctamente.")
        return interaction.reply({embeds: [exi]});
    };

    }
}

module.exports = command;