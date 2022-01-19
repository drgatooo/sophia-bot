const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));

const logsModel = require("../../models/setModLogs");

const time = config.deleteTime;

/**
 * @type {import('../../types/typesctructure').Command}
 */

const command = {
  name: "clear",
  aliases: ["cc"],
  description: "Borra el chat del canal!",
  userPerms: ["MANAGE_MESSAGES"],
  botPerms: ["MANAGE_MESSAGES"],
  category: "Moderation",
  premium: false,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {string[]} args
   */

  run: async (client, message, args) => {
    var amount = args[0];
      let ch;

    let logsChannel = await logsModel.findOne({ ServerID: message.guild.id });
      
    try {

    	ch = message.guild.channels.cache.get(logsChannel.ChannelID) || message.channel;

    } catch(error){console.log(error)}
    

    var row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("10")
        .setCustomId("10")
        .setStyle("SECONDARY"),

      new MessageButton()
        .setLabel("25")
        .setCustomId("25")
        .setStyle("SECONDARY"),

      new MessageButton()
        .setLabel("50")
        .setCustomId("50")
        .setStyle("SECONDARY"),

      new MessageButton()
        .setLabel("100")
        .setCustomId("100")
        .setStyle("SECONDARY"),

      new MessageButton()
        .setLabel("Custom")
        .setCustomId("101")
        .setStyle("PRIMARY")
    );

    const noargsDelete = new MessageEmbed()
      .setTitle("✏ Borrar mensajes")
      .setDescription("🔢 Escribe una cantidad!")
      .setColor("WHITE");

    const mindelete = new MessageEmbed()
      .setTitle("✏ Borrando mensajes...")
      .setColor("WHITE")
      .setDescription(`Mensajes totales eliminados: \`${amount}/${amount}\` `);

    const waiting = new MessageEmbed()
      .setTitle("⌛ Esperando")
      .setDescription("Escribe un numero!")
      .setColor("GOLD");

    if (!amount) {
      let myMessage = await message.reply({
        embeds: [noargsDelete],
        components: [row],
      });

      let iFilter = (i) => i.user.id === message.author.id;

      const collector = myMessage.createMessageComponentCollector({
        filter: iFilter,
        time: 60000,
        errors: ["time"],
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case "10":
            amount = 10;
            break;
          case "25":
            amount = 25;
            break;
          case "50":
            amount = 50;
            break;
          case "100":
            amount = 100;
            break;
          case "101":
            myMessage.edit({ embeds: [waiting], components: [] });

            mfilter = (m) => m.author.id === message.author.id;

            let mcollector = message.channel.createMessageCollector({
              filter: mfilter,
              max: 1,
            });

            mcollector.on("collect", async (msg) => {
              if (isNaN(msg.content)) {
                let nanEmbed = new MessageEmbed()
                  .setTitle("❌ Error")
                  .setDescription("Solo inserta numeros")
                  .setColor("RED");
                myMessage.edit({ embeds: [nanEmbed] });
                return;
              } else if (msg.content < 0 || msg.content > 100) {
                let menorEmbed = new MessageEmbed()
                  .setTitle("❌ Error")
                  .setColor("RED")
                  .setDescription(
                    "Solo acepto numeros mayores a 0 y menores a 100"
                  )

                myMessage.edit({ embeds: [menorEmbed] });
                  if(Number.isInteger(parseInt(msg))) return message.reply('Debes escribir un numero entero, no decimal! (escribe denuevo el comando)'); else {return message.reply('Debes escribir un numero entero, no decimal! (escribe denuevo el comando)');}
                return;
              } 

              amount = msg;
                try {
              await message.channel
                .bulkDelete(
                  (
                    await message.channel.messages.fetch({ limit: amount })
                  ).filter((m) => m.id !== message.id)
                )
                .then((messages) => {
                  if (amount === 99) amount = 100;

                if (logsChannel){
                    ch.send({
                        embeds: [
                          mindelete.setDescription(
                            `Mensajes totales eliminados: \`${
                              messages.size + 1
                            }/${amount}\` `
                          ).addField('👮‍♂️ Staff:',`<@${message.author.id}>`,true).addField('📓 Canal:',`${message.channel}`,true),
                        ],
                        components: [],
                      })
                }

                  message
                    .reply({
                      embeds: [
                        mindelete.setDescription(
                          `Mensajes totales eliminados: \`${
                            messages.size + 1
                          }/${amount}\` `
                        ),
                      ],
                      components: [],
                    })
                    .then((msg) => {
                      setTimeout(() => {
                        msg.delete();
                        message.delete();
                      }, time);
                    })
                    .catch(() => null);
                });
                } catch(err){
                    return message.reply('Debes escribir un numero valido! (escribe denuevo el comando)');
                }
            });

            break;
        }

        if (i.customId !== "101") {
          await i.deferUpdate();

          await message.channel
            .bulkDelete(
              (
                await message.channel.messages.fetch({ limit: amount })
              ).filter((m) => m.id !== message.id)
            )
            .then((messages) => {
              if (amount === 99) amount = 100;


                if (logsChannel){
                    ch.send({
                        embeds: [
                          mindelete.setDescription(
                            `Mensajes totales eliminados: \`${
                              messages.size + 1
                            }/${amount}\` `
                          ).addField('👮‍♂️ Staff:',`<@${message.author.id}>`,true).addField('📓 Canal:',`${message.channel}`,true),
                        ],
                        components: [],
                      })
                }

              message
                .reply({
                  embeds: [
                    mindelete.setDescription(
                      `Mensajes totales eliminados: \`${
                        messages.size + 1
                      }/${amount}\` `
                    ),
                  ],
                  components: [],
                })
                .then((msg) => {
                  setTimeout(() => {
                    msg.delete();
                    message.delete();
                  }, time);
                })
                .catch(() => null);
            });
        }
      });
    } else {
      if (isNaN(amount)) {
        let nanEmbed = new MessageEmbed()
          .setTitle("❌ Error")
          .setDescription("Escribe solo numeros")
          .setColor("RED");
        let m = await message.reply({ embeds: [nanEmbed] });
        setTimeout(() => {
          m.delete();
        }, time);
        return;
      }

      if (amount < 0 || amount > 100) {
        let menorEmbed = new MessageEmbed()
          .setTitle("❌ Error")
          .setColor("RED")
          .setDescription(
            "Solo acepto numeros mayores a 0 y menores a 100"
          );
        let m = await message.reply({ embeds: [menorEmbed] });
        setTimeout(() => {
          m.delete();
        }, time);
        return;
      }

      await message.channel
        .bulkDelete(
          (
            await message.channel.messages.fetch({ limit: amount }).catch(() => {return message.reply('Debes escribir un numero valido! (escribe denuevo el comando)')})
          )
        )
        .then((messages) => {
          if (amount === 99) amount = 100;
          

          /*if (logsChannel){
            ch.send({
                embeds: [
                  mindelete.setDescription(
                    `Mensajes totales eliminados: \`${
                      messages.size + 1
                    }/${amount}\` `
                  ).addField('👮‍♂️ Staff:',`<@${message.author.id}>`,true).addField('📓 Canal:',`${message.channel}`,true),
                ],
                components: [],
              })
        }*/

          message
            .reply({
              embeds: [
                mindelete.setDescription(
                  `Mensajes totales eliminados: \`${
                    messages.size + 1
                  }/${amount}\` `
                ),
              ],
              components: [],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete();
                message.delete();
              }, time);
            })
            .catch(() => null);
        });
    }
  },
};

module.exports = command;
