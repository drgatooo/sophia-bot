const client = require("../index.js")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"))
client.on(`guildCreate`, async (guild) => {
    const serverID = config.serverID

    const Embed = new MessageEmbed()
    .setTitle("Gracias por agregarme!")
    .setDescription("Estoy contenta de poder estar aqui, espero ser de mucha ayuda para tu servidor y que puedas disfrútar todo lo que tengo para ofrecer.\n\nRecuerda que me puede apoyar dando click en los botones de abajo, donde esta la bot-list y el servidor de soporte!")
    .setFooter("Disfruta!!!")
    .setColor("#00FFFF")
    
    const row = new MessageActionRow()
    .addComponents(
    new MessageButton()
    .setLabel("Vota por mi!")
    .setStyle("LINK")
    .setURL("https://discordbotlist.com/bots/sophia-8660"),
     
    new MessageButton()
    .setLabel("Servidor Soporte.")
    .setStyle("LINK")
	.setURL("https://discord.gg/QaY43QSDwK")
    )
    
    guild.channels.create("🎀 | Sophia", "text").then(c => c.send({embeds: [Embed], components: [row]}))

    const llegue = new MessageEmbed()
    .setTitle('✨ Entre a un nuevo servidor!')
    .addField('ℹ Nombre del servidor:',`${guild.name}`,true)
    .addField('🧒 Actualmente tiene:', `${guild.memberCount} usuarios.`)
    .addField('ℹ ID del servidor:',`${guild.id}`,true)
    .addField('🌐 Owner:',`${client.users.cache.get(guild.ownerId).tag}`,true)
    .addField('🎀 Estoy actualmente en:',`${client.guilds.cache.size} servidores.`)
    .setThumbnail(guild.iconURL({dynamic: true}))
    .setColor('LUMINOUS_VIVID_PINK')
    
   	client.channels.cache.get(serverID).send({embeds: [llegue]}).catch(()=>{});

       
    let support = client.guilds.cache.get("878037227005968414");
    let owners = client.guilds.cache.map(guild => guild.ownerId)

    for(var i in owners){
        let own = client.users.cache.get(owners[i])
        //mrd debo ir a comer xd ni idea, vuelvo lo antes posible, vale, chau
    }
    


})