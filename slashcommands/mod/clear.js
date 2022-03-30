const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Client, CommandInteraction } = require("discord.js");

module.exports = {
    userPerms: ['MANAGE_MESSAGES'],
    category: 'Moderación',
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("borra una cantidad de mensajes")
    .addIntegerOption(o => o.setName('cantidad').setDescription('Escribe la cantidad de mensajes a borrar - Máximo 100').setRequired(true))
    .addChannelOption(o => o.addChannelType(0).setName(`en`).setDescription(`Canal en el que se borrarán los mensajes`))
    .addUserOption(o => o.setName(`de`).setDescription(`Miembro del que se borrarán los mensajes`))
    .addStringOption(o => o.setName(`contenido`).setDescription(`El mensaje debe de contener lo que escribas aquí para eliminarlo`))
    .addBooleanOption(o => o.setName(`embeds`).setDescription(`Si los mensajes deben de tener embeds`))
    .addBooleanOption(o => o.setName(`archivos`).setDescription(`¿Se buscarán mensajes que tengan archivos?`)),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async run(client, interaction) {
        const { options } = interaction,
        amount = options.getInteger(`cantidad`),
        user = options.getUser(`de`),
        content = options.getString(`contenido`),
        embeds = options.getBoolean(`embeds`),
        files = options.getBoolean(`archivos`)
        var obj = { text: `` }
        var channel = options.getChannel(`en`)
    
        if(amount < 1 || amount > 101) return createMsgError(`¡Debes escribir un número entre el 1 y el 100!`)
    
        if(channel) {
            obj.text = ` en <#${channel.id}> `
        } 
        else {
            channel = interaction.channel
        }
    
        obj.messages = await channel.messages.fetch()
    
        if(user) obj = filterMessages(obj.messages, (m) => m.author.id == user.id , amount, ` de <@${user.id}` , obj.text)
        if(content) obj = filterMessages(obj.messages, (m) => m.content.includes(content), amount, " que contenían`" + content + "`", obj.text)
        if(embeds) obj = filterMessages(obj.messages, (m) => m.embeds[0], amount, ` que tenían embeds`, obj.text)
        if(files) obj = filterMessages(obj.messages, (m) => m.attachments.size > 0, amount, ` que contenían archivos`, obj.text)
    
        channel.bulkDelete(obj.messages)
        .then(msgs => {
            if(msgs.size < 1) return createMsgError(`No hay ningún mensaje para borrar`)
            interaction.reply({ embeds: [new MessageEmbed({
                title: `<a:TPato_Check:911378912775397436> ¡Tarea completada!`,
                description: `Se han borrado *${msgs.size}* mensajes de *${amount.toString()}*` + obj.text,
                color: `GREEN`,
                footer: { text: '*Los mensajes con más de 14 días de antigüedad, no se pueden borrar' }
            }) ] })
        })
    
        function createMsgError(msg){
            return interaction.reply({ephemeral: true, embeds: [new MessageEmbed({
                title: `:x: Error`,
                description: msg,
                color: `RED`
            }) ] });
        }
    }
}

function filterMessages(messages, fil, amount, text, oldText = ``) {
    var i = 0
    const filtered = []
    messages.filter(m => {
        if(fil(m) && amount > i) {
            filtered.push(m)
            i++
        }
    })
    return {
        messages: filtered,
        text: oldText + text
    }}