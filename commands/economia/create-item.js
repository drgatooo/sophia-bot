const { Client, Message, MessageEmbed } = require('discord.js')
const schema = require("../../models/shop-model.js");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'create-item',
    aliases: ['createitem'],
    description: 'Crea un item para la economia de tu servidor',
    userPerms: ['MANAGE_GUILD'],
    botPerms: ['MANAGE_GUILD'],
    category: 'Economy',
    premium: false,
    uso: `<nombre-producto o @rol> | <precio> | <descripción (opcional)> (el \" | \" es requerido)`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {

    const err = new MessageEmbed()
    .setTitle(":x: Error")
    .setColor("RED")

    const exi = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("✅ Exito")

    const results = await schema.findOne({ guildid: message.guild.id });
    let product = args.join(" ").split(" | ");
    let productName = product[0];
    let productPrice = product[1];
    let productDescription = product[2];


    //-- conditions
    if(message.mentions.roles.first() && !message.mentions.roles.first().editable) {
        err.setDescription("Debes poner un rol inferior al mio!")
        return message.reply({embeds: [err]});
    }
    if(isNaN(productPrice) || !productPrice) {
        err.setDescription("Debes poner un precio valido.")
        return message.reply({embeds: [err]});
    }

    if(!productDescription) productDescription = 'Sin descripción';

    const uuid = () => {
    const { v4: uuidv4 } = require("uuid");
    let id = uuidv4();
    return id.slice(0, 8);
    };
    if(results) {
        await schema.updateOne({
            guildid: message.guild.id
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
        return message.reply({embeds: [exi]});
    } else {
        const newShop = new schema({
            guildid: message.guild.id,
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
        return message.reply({embeds: [exi]});
    };

    }
}

module.exports = command


                