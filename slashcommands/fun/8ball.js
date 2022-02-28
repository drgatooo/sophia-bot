const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require('discord.js')
const { Modal, TextInputComponent, showModal } = require('discord-modals');
require('moment').locale('es');

module.exports = {
    category: "Diversión",
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("preguntale algo de si o no al bot."),

    async run(client, interaction){

        const preguntaComponent = new TextInputComponent()
        .setCustomId('8ball_pregunta')
        .setLabel('Pregunta')
        .setMinLength(1)
        .setMaxLength(4000)
        .setStyle('LONG')
        .setRequired(true)
        .setPlaceholder('Escribe aquí la pregunta que quieres hacerle a Sophia.')

        const modal = new Modal()
        .setTitle('8ball')
        .setCustomId('8ball')
        .addComponents(preguntaComponent)

        showModal(modal, { client: client, interaction: interaction });

        client.on("modalSubmit", async (modal) => {
          if (modal.customId === "8ball") {
            const respuesta = [
              "Si.",
              "No.",
              "Tal vez.",
              "Puede ser.",
              "No en absoluto.",
              "Mejor pregunta otra cosa.",
              "Mmmmm... no sé.",
              "Eso no se pregunta...",
              "No lo sé, dímelo tú.",
            ];
            const pregunta = modal.getTextInputValue('8ball_pregunta');
            const embed = new MessageEmbed()
              .setTitle("8Ball :8ball:")
              .setDescription(
                "➡ ***Tu pregunta es:***" +
                  "\n" +
                  `${pregunta}` +
                  "\n" +
                  "👀 *Mi respuesta a la pregunta es:* \n" +
                  `||` +
                  respuesta[Math.floor(Math.random() * respuesta.length)] +
                  `||`
              )
              .setColor("#00FFFF");
            modal.reply({ embeds: [embed] });
          }
        });

    }
}