const { Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const client = require('../../index.js')
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));
const owner = config.owner;


/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'help',
    aliases: ['ayuda','comandos','cmd','commands','cmds'],
    description: 'Catalogo de ayuda del bot',
    category: 'Information',
    premium: false,
    uso: `<comando (opcional)>`,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {    
   const configuracion = client.commands.filter(cmd => cmd.category === 'Configuration');
   const administracion = client.commands.filter(cmd => cmd.category === 'Administration');
   const moderacion = client.commands.filter(cmd => cmd.category === 'Moderation');
   const diversion = client.commands.filter(cmd => cmd.category === 'Diversion');
   const informacion = client.commands.filter(cmd => cmd.category === 'Information');
   const utilidad = client.commands.filter(cmd => cmd.category === 'Utility');
   const nsfw = client.commands.filter(cmd => cmd.category === 'NSFW');
   const economia = client.commands.filter(cmd => cmd.category === 'Economy');
   const premiums = client.commands.filter(cmd => cmd.category == 'Premium');
   const totalCommands = client.commands.filter(cmd => cmd.category !== "Owner");

        ///////////////////////////////////////////////////////EMBEDS///////////////////////////////////////////////////////

        //menu principal
        let embedmenu = new MessageEmbed()
        .setTitle(`¿Ayuda , alguien necesita ayuda? Acá está Sophia para ayudarte!`)
        .setColor("#00FFFF")
        .setDescription(`🎀 Hola <@${message.author.id}> ! aca tenes una lista de comandos que podes usar\n🌐 Tengo un total de **[${totalCommands.size}]** comandos para que puedas usar!\n💡 Recorda que el prefix en este servidor es \`${prefix}\``)
        .addField(`💼 Administracion [${administracion.size}]`,  `\`${administracion.map(z => z.name).join(`\` \``)}\``)
        .addField(`👮‍ Moderacion [${moderacion.size}]`,  `\`${moderacion.map(z => z.name).join(`\` \``)}\``)
        .addField(`🔩 Configuracion [${configuracion.size}]`, `\`${configuracion.map(z => z.name).join(`\` \``)}\``)
        .addField(`ℹ Informacion [${informacion.size}]`,`\`${informacion.map(z => z.name).join(`\` \``)}\``)
        .addField(`🎡 Diversión [${diversion.size}]`,`\`${diversion.map(z => z.name).join(`\` \``) ? diversion.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\` `)
        .addField(`💵 Economia [${economia.size}]`,`\`${economia.map(z => z.name).join(`\` \``) ? economia.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\` `)
        .addField(`🛠 utilidad [${utilidad.size}]`,`\`${utilidad.map(z => z.name).join(`\` \``) ?utilidad.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\` `)
        if (message.channel.nsfw) {
            embedmenu.addField(`🔞 NSFW [${nsfw.size}]`,`\`${nsfw.map(z => z.name).join(`\` \``) ? nsfw.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\` `)
        } else {
            embedmenu.addField("🔞 NSFW [Deshabilitado]", "(Para saber informacion de los comandos NSFW utiliza el comando en un canal NSFW)")
        }
        
        embedmenu.addField(`💰 Premium [${premiums.size}]`,`\`${premiums.map(z => z.name).join(`\` \``) ?premiums.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\` `)
        
        

        // admin menu
        
        let embedadmin = new MessageEmbed()
        .setTitle(`Se una leyenda administrando!.`)
        .setDescription
        (
            `Hay un total de **[${administracion.size}]** comandos!\n\`${administracion.map(z => z.name).join(`\` \``)}\``
        )
        .setColor("#00FFFF")
        
        
        //menu mod
        let embedmod = new MessageEmbed()
        .setTitle(`Modera con facilidad!.`)
        .setDescription
        (
            `Hay un total de **[${moderacion.size}]** comandos!\n\`${moderacion.map(z => z.name).join(`\` \``)}\``
        )
        .setColor("#00FFFF")

        //menu div
        let embeddiv = new MessageEmbed()
        .setTitle(`Pasemos un rato divertido!`)
        .setDescription
        (
        	`Hay un total de **[${diversion.size}]** comandos!\n\`${diversion.map(z => z.name).join(`\` \``) ? diversion.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\``
        )
        .setColor("#00FFFF")
        
        //menu info
        let embedinfo = new MessageEmbed()
        .setTitle(`Informate rapidamente!.`)
        .setDescription
        (
            `Hay un total de **[${informacion.size}]** comandos!\n\`${informacion.map(z => z.name).join(`\` \``)}\``
        )
        .setColor("#00FFFF")

        //menu config
        let embedconfig = new MessageEmbed()
        .setTitle(`Aprende a configurar tu servidor!.`)
        .setDescription
        (
           `Hay un total de **[${configuracion.size}]** comandos!\n\`${configuracion.map(z => z.name).join(`\` \``) ? configuracion.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\``
        )
        .setColor("#00FFFF")
        
        //-- menu util
        let embedUtil = new MessageEmbed()
        .setTitle(`Comandos de utilidad!`)
        .setDescription
        (
           `Hay un total de **[${utilidad.size}]** comandos!\n\`${utilidad.map(z => z.name).join(`\` \``) ? utilidad.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\``
        )
        .setColor("#00FFFF")
        
        //-- menu economia
        let embedeconomia = new MessageEmbed()
        .setTitle(`Comandos de economia!`)
        .setDescription
        (
           `Hay un total de **[${economia.size}]** comandos!\n\`${economia.map(z => z.name).join(`\` \``) ? economia.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\``
        )
        .setColor("#00FFFF")
        
        //-- menu nsfw
        let embednsfw = new MessageEmbed()
        .setTitle(`Solo para despues de las 12 amigo!`)
        .setDescription
        (
           `Hay un total de **[${nsfw.size}]** comandos!\n\`${nsfw.map(z => z.name).join(`\` \``) ? nsfw.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\``
        )
        .setColor("#00FFFF")
        
        
        // premium embed
        
        let embedpremium = new MessageEmbed()
        .setTitle(`Demuestra que tienes el poder!.`)
        .setDescription
        (
            `Hay un total de **[${premiums.size}]** comandos!\n\`${premiums.map(z => z.name).join(`\` \``) ? premiums.map(z => z.name).join(`\` \``) : 'no hay por el momento!'}\``
        )
        .setColor("#00FFFF")
        
        
        
        
        
        ///////////////////////////////////////////////////////MENU///////////////////////////////////////////////////////
        let row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId("menu-1")
            .setPlaceholder("Investiga mis categorias!")
            .addOptions([
                {
                    label: "Menú principal.",
                    description: "Te enviará al menú principal.",
                    value: "menuprincipal",
                    emoji: "🏠",
                },
                 {
                    label: "Apartado Administracion.",
                    description: "Te enviará al apartado de Administracion.",
                    value: "menuadm",
                     emoji: "💼",
                     
                },
                {
                    label: "Apartado Moderación.",
                    description: "Te enviará al apartado de moderación.",
                    value: "menumod",
                    emoji: "👮‍♂️",
                    
                },
                {
                    label: "Apartado Información",
                    description: "Te enviará al apartado de información.",
                    value: "menuinfo",
                    emoji: "ℹ",
                },
                {
                    label: "Apartado Configuración.",
                    description: "Te enviará al apartado de configuración.",
                    value: "menuconfig",
                    emoji: "🔩",
                },
                {
                    label: "Apartado Diversión.",
                    description: "Te enviará al apartado de diversión.",
                    value: "menudiv",
                    emoji: "🎡"
                },
                {
                    label: "Apartado Utilidad.",
                    description: "Te enviará al apartado de utilidad.",
                    value: "menuUtil",
                    emoji: "🛠"
                },
                {
                    label: "Apartado economia.",
                    description: "Te enviará al apartado de economia.",
                    value: "menueco",
                    emoji: "💵"
                },
                {
                    label: "Apartado NSFW.",
                    description: "Te enviará al apartado NSFW.",
                    value: "menunsfw",
                    emoji: "🔞"
                },
                {
                    label: "Apartado Premium",
                    description: "Te enviará al apartado premium.",
                    value: "menupremium",
                    emoji: "💰",
                },
            ]),
        )
        
        if (!args[0]) {
            const m = await message.reply({ embeds: [embedmenu], components: [row] })
            const filtro = i => i.user.id === message.author.id
            const collector = m.createMessageComponentCollector({filter: filtro, time: 60000})

            collector.on("collect", async m => {
                /*if(m.values[0] === ""){
                    await m.deferUpdate()
                    m.editReply({})
                }*/

               switch(m.values[0]) {
                   case 'menuprincipal':
                        await m.deferUpdate();
                    	m.editReply({embeds: [embedmenu]});
                   case 'menumod':
                       await m.deferUpdate();
                   	   m.editReply({embeds: [embedmod]});
                   case 'menudiv':
                    	await m.deferUpdate();
                    	m.editReply({embeds: [embeddiv]});
                   case 'menuinfo':
                    	await m.deferUpdate();
                    	m.editReply({embeds: [embedinfo]});
                   case 'menuconfig':
                       await m.deferUpdate();
                       m.editReply({embeds: [embedconfig]});
                   case 'menuadm':
                    	await m.deferUpdate();
                    	m.editReply({embeds: [embedadmin]});
                   case 'menupremium':
                       await m.deferUpdate();
                       m.editReply({embeds: [embedpremium]});
                   case 'menuUtil':
                       await m.deferUpdate();
                       m.editReply({embeds: [embedUtil]})
                       
                   case 'menunsfw':
                  if(message.channel.nsfw){
                       await m.deferUpdate();
                       m.editReply({embeds: [embednsfw]})
                  } else {
                     await m.deferUpdate();
                      embednsfw.setDescription(":x: No puedes mirar esta categoria fuera de un canal NSFW :x:")
                     m.editReply({embeds: [embednsfw]})
                  }
                       
                   case 'menueco':
                       await m.deferUpdate();
                       m.editReply({embeds: [embedeconomia]})
            }
                
            })
            
            collector.on("end", (_collector, reason) => {
            if (reason === "time"){
                m.edit({components: []})
            }
        })
            
        } else {
            
            const data = []
            
            let cmdname = args[0]
            
            let commandFinded = client.commands.get(cmdname) || client.commands.find(x => x.aliases && x.aliases.includes(cmdname))
            
            
            if (!commandFinded || commandFinded.category == 'Owner' && !owner.includes(message.author.id)){
                let nocommand = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription(`El comando \`${cmdname}\` no existe o lo escribiste mal, intenta usar \`${prefix}help\` para saber mas!`)
                .setColor('RED')
                return message.reply({embeds: [nocommand]})
            } else {
                let commandinfo = new MessageEmbed()
                .setTitle('Informacion de los comandos!')
                .setColor('WHITE')
                .setThumbnail(`${client.user.avatarURL({size: 2048, dynamic: true})}`)
                
                data.push({ embeds: [commandinfo.addField('📑 Nombre:',`${commandFinded.name}`,true)]})
                if (commandFinded.aliases){
                    data.push({ embeds: [commandinfo.addField('📑 Alias:', `${commandFinded.aliases.join(', ') || 'Sin alias'}`,true)]})
                }
                data.push({ embeds: [commandinfo.addField('📂 Categoria:', `${commandFinded.category || 'Sin Categoria'}`,true)]})
                data.push({ embeds: [commandinfo.addField('📖 Descripcion:', `${commandFinded.description || 'Sin descripcion actualmente'}`,true)]})
                data.push({ embeds: [commandinfo.addField('✏ Uso:', `\`\`\`${prefix + (commandFinded.uso ? commandFinded.uso : commandFinded.name)}\`\`\``)]})
                
                message.reply({data, embeds: [commandinfo], split: true})
                
                
                
                
            }
            
            
            
        }
        
        


    }
}

module.exports = command