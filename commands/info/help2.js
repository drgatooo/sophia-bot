const { Client, Message, MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
const fetch = require('node-fetch');
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'help2',
    category: 'Information',
    uso: '<comando (opcional)>',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args, prefix) => {
        const emojis = {};
        if(args[0]){
            const data = []
            let cmdname = args[0]
            let commandFinded = client.commands.get(cmdname) || client.commands.find(x => x.aliases && x.aliases.includes(cmdname))
            if (!commandFinded || commandFinded.category == 'Owner' && !owner.includes(message.author.id)){
                let nocommand = new MessageEmbed()
                .setTitle('❌ Error')
                .setDescription(`El comando \`${cmdname}\` no existe o lo escribiste mal, intenta usar \`${prefix}help\` para saber mas!`)
                .setColor('RED');
                return message.reply({embeds: [nocommand]})
            } else {
                let commandinfo = new MessageEmbed()
                .setTitle('Informacion de los comandos!')
                .setColor('WHITE')
                data.push({ embeds: [commandinfo.addField('➡ Nombre:',`${commandFinded.name}`)]})
                if (commandFinded.aliases) data.push({ embeds: [commandinfo.addField('➡ Alias', `${commandFinded.aliases.join(', ') || 'Sin alias'}`)]})
                data.push({ embeds: [commandinfo.addField('➡ Descripcion:', `${commandFinded.description || 'Sin descripcion actualmente'}`)]})
                data.push({ embeds: [commandinfo.addField('➡ Uso', `${prefix + commandFinded.uso}`)]})
                data.push({ embeds: [commandinfo.addField('➡ Categoria', `${commandFinded.category || 'Sin Categoria'}`)]})
                message.reply({data, embeds: [commandinfo], split: true});
            } return;
        }
        fetch('http://sophia-bot.site/api/cmds')
        .then(res => res.json())
        .then(async data => {
            $data = data.map(a=>a.category);
            const categories=$data.filter((a,t)=>data.map(a=>a.category).indexOf(a)===t);
            const obj = new Object();
            const options = new Array();
                categories.forEach(c => {
                options.push({
                    label: c,
                    description: 'revisa los comandos de la categoria '+c,
                    value: c,
                    emoji: emojis[c] || '➖'
                });
                data.filter(cmd => cmd.category === c).forEach(commands => {
                    obj[c] = [...(obj[c] || []), commands];
                });
            });
            const embed = new MessageEmbed().setColor('#00FFFF').setTitle('¿Ayuda , alguien necesita ayuda? Acá está Sophia para ayudarte!').setDescription('🎀 Hola <@'+message.author.id+'> ! aca tenes una lista de comandos que podes usar\n🌐 Tengo un total de ['+client.commands.size+'] comandos para que puedas usar!\n💡 Recuerda que el prefix en este servidor es '+prefix);
            categories.forEach(async (item, i) => embed.addField(emojis[Object.keys(obj)[i].toString()]||'➖'+Object.keys(obj)[i].toString()+' ['+obj[item].length+']', `\`${!message.channel.nsfw && Object.keys(obj)[i].toLowerCase() === 'nsfw' ? 'Debes estar en un canal nsfw para ver o usar estos comandos' : obj[item].map(cmd => cmd.name).join('` `')}\``));
            const menu = new MessageSelectMenu()
	            .setCustomId('menu')
	            .setPlaceholder('Selecciona una categoría')
	            .addOptions(options);
        const row = new MessageActionRow()
        .addComponents(menu);
            const msg = await message.reply({embeds: [embed], components: [row]});
            const filter = i => i.user.id === message.author.id;
            const time = 60 * 1000;
            const collector = msg.createMessageComponentCollector({filter, time});
            collector.on('collect', i => {
                if(message.author.id !== i.user.id) return message.reply({content: 'No puedes interferir en el comando de otra persona.', ephemeral: true});
                categories.forEach((c) => {
                    if(i.values[0] === c) {
                        i.deferUpdate();
                        msg.edit({embeds: [
                            new MessageEmbed()
                            .setTitle(emojis[c]||'➖'+' comandos de '+c)
                            .setDescription(`\`${!message.channel.nsfw && c.toLowerCase() === 'nsfw' ? 'Debes estar en un canal nsfw para ver o usar estos comandos' : obj[item].map(cmd => cmd.name).join('` `')}\``)
                            .setColor('#00FFFF')
                        ], components: [row]});
                    }
                });
            });
            setTimeout(() => msg.edit({ components: []}), time);
        });
    }
}

module.exports = command;