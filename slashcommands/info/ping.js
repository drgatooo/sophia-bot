const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    category: "Información",
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Comando ping"),

    async run(client, interaction){
    
    var ping = Math.round(interaction.client.ws.ping)
    let cpu = Math.round(process.cpuUsage().system)
    let usocpu = Math.round((cpu) / 1000) / 10;
    const embed = new MessageEmbed()
    .setTitle(":ping_pong: Calculando...")
    .setDescription("⏳ Espere un momento...")
    .setColor("RED")
    interaction.reply({embeds: [embed]}).then(async m => {
        embed.setTitle(`Estadisticas ${client.user.username}`)
        embed.setDescription(
        `> :ping_pong: **Ping actual:**\n` + 
        "`" + ping + " ms" + "`" + 
        `\n\n > 📈 **CPU en uso:**\n` + 
        "`" + usocpu + " %" + "`" + 
        `\n\n > ⏳ **Ram actual:**\n` + "`" + 
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}` + " MB" + "`"
        )
        embed.setColor("#00FFFF")
    interaction.editReply({embeds: [embed]});
    })
    }
}