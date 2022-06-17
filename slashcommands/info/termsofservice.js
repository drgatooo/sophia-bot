const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-light')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	category: 'Información',

	data: new SlashCommandBuilder()
		.setName('termsofservice')
		.setDescription('Lee, analiza, y acepta nuestros términos y condiciónes.'),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const tos =
			'Al usar a nuestro bot en cualquier servidor de discord, aceptas conjunto a ello los presentes términos.' +
			'\n' +
			'***Términos del servicio: ***' +
			'\n' +
			'```' +
			'\n' +
			'1-	Almacenamiento de información:' +
			'\n' +
			'```' +
			'\n' +
			'Nuestro bot que de ahora en adelante lo llamaremos servicio, almacena diversas informaciones para el funcionamiento del mismo, dentro de estos datos, almacenamos:' +
			'\n' +
			'`- ID USUARIO`' +
			'\n' +
			'`- ID SERVIDOR`' +
			'\n' +
			'`- ID MENSAJE (en ciertos casos)`' +
			'\n' +
			'`- Username`' +
			'\n' +
			'`- Tag del usuario`' +
			'\n' +
			'```' +
			'\n' +
			'2-	Totalmente gratis:' +
			'\n' +
			'```' +
			'\n' +
			'Nuestro servicio, jamás te pedirá un dato bancario o números de tarjeta, nuestro compromiso es con la gente, el ofrecer un servicio de calidad, sin costo alguno (a excepción de membresías VIP), en caso de que nuestro servicio pida uno de los datos mencionados, comunícate con nosotros en el servidor de soporte para averiguar de forma optima porque lo hizo o si fue usado por un usuario del servidor donde se ejecutó la acción.' +
			'\n' +
			'```' +
			'\n' +
			'3-	Privacidad, ante todo:' +
			'\n' +
			'```' +
			'\n' +
			'En caso de tener una membresía o información confidencial en nuestro servicio, este, se mantendrá seguro bajo estrictos protocolos de seguridad, en caso de una filtración de datos, Sophia Company, tomará medidas legales ante dicha situación.' +
			'\n' +
			'```' +
			'\n' +
			'4-	Eliminación definitiva de datos:' +
			'\n' +
			'```' +
			'\n' +
			'Si eres un usuario que ya no le gusta nuestro servicio, puedes optar por la opción de borrar tus datos permanentemente del mismo, ¿qué quiere decir esto?, si borramos tus datos ya no podrás usar nunca mas el servicio y por ende el mismo tampoco tomará en cuenta acciones que te relacionen, por ejemplo; juegos, advertencias, entre otros, para esto lo único que conservaremos de ti será tu ID de usuario para así poder almacenarlo en una base de datos que evita el funcionamiento del servicio con tu usuario.' +
			'\n' +
			'```' +
			'\n' +
			'5-	Librería Distube:' +
			'\n' +
			'```' +
			'\n' +
			'A través de estos términos de servicio queremos dejar constancia del uso del NPM llamado “Distube”, el cual nos facilita el funcionamiento del sistema de música presente en nuestro bot, **aclaramos y rechazamos la venta de algún servicio a través del mismo**, todo el sistema es totalmente abierto al público en general.' +
			'\n' +
			'```' +
			'\n' +
			'6-	Lenguaje fuera de lugar u ofensivo:' +
			'\n' +
			'```' +
			'\n' +
			'Nuestro servicio, jamás dirá una mala palabra para insultar como, por ejemplo; *“aquí tienes desgraciado.” *, nuestro bot esta libre y totalmente en contra del lenguaje racista, ofensivo, descalificativo, en caso de que esto suceda, puede ser el uso del comando /say, el cual replica lo que tu le indiques a nuestro servicio.' +
			'\n' +
			'```' +
			'\n' +
			'7-	Abusar no es usar:' +
			'\n' +
			'```' +
			'\n' +
			'Los comandos que proporciona nuestro servicio son para que se usen de **forma correcta**, tú puedes usar un comando ya sea para probar e informarte. Pero no debes abusar de ello haciendo **Spam** del mismo, porque al hacer esos abusos se consumen recursos del bot y lo hacen más lento. De lo cual **No se van a tolerar abusos del mismo**.' +
			'\n' +
			'```' +
			'\n' +
			'8-	Blacklist:' +
			'\n' +
			'```' +
			'\n' +
			'Nuestro servicio, cuenta con una blacklist privada, en la cual la única forma que entres sea haciendo **spam, floor, ofendiendo al personal de Sophia Company u otro motivo grave**, según clasifiquemos la gravedad este puede ser permanente o temporal.'

		const toc = new MessageEmbed()
			.setTitle('Términos y condiciones Sophia Company.')
			.setDescription(
				'***Términos y condiciones: ***' +
					'\n' +
					'```' +
					'\n' +
					'1-	Atención:' +
					'\n' +
					'```' +
					'\n' +
					'Nuestro servicio dispondrá servicio 12 horas al día en su servidor de soporte, no obstante, este derecho puede ser retirado en caso de pertenecer a la blacklist del mismo, o de presentar faltas de respeto y cordialidad con nuestro personal, además siendo añadido a la blacklist, aceptamos sugerencias, criticas, siempre bajo un margen de respeto y cordialidad entre ambas partes.' +
					'\n' +
					'```' +
					'\n' +
					'2-	Copyright' +
					'\n' +
					'```' +
					'\n' +
					'Nuestro servicio es privado, es decir su código fuente no es público ni será liberado, el intento de suplantación o filtración de código de Sophia, será notificado a la plataforma, solicitando la cancelación de la cuenta o bot relacionado al caso, nos reservamos la propiedad intelectual de las funciones de Sophia, la imitación o uso de ellas sin mención alguna hacia nosotros de igual forma será notificado al dueño y posteriormente a la plataforma.' +
					'\n' +
					'```' +
					'\n' +
					'3-	Membresías VIP y donaciones:' +
					'\n' +
					'```' +
					'\n' +
					'Si te has decidido en adquirir una membresía o donación, tendrás 48 horas para realizar la devolución de la misma, pasado este periodo de tiempo, las mismas no tendrán devolución alguna.' +
					'\n' +
					'```' +
					'\n' +
					'4-	TOS de Discord:' +
					'\n' +
					'```' +
					'\n' +
					'Nuestro servicio, respeta, analiza y sigue al pie de la letra los terms of service de Discord, si tu visualizas una acción en contra de los mismos, háznoslo saber a través de un reporte con el comando `/report`, para asi aplicar las respectivas sanciones.',
			)
			.setFooter({
				text: 'Sophia company 2021-2022 © Todos los derechos reservados.',
			})
			.setColor('#00FFFF')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))

		const embed = new MessageEmbed()
			.setTitle('Términos y condiciones Sophia Company.')
			.setDescription('Elije una de las opciónes.')
			.setFooter({
				text: 'Sophia company 2021-2022 © Todos los derechos reservados.',
			})
			.setColor('#00FFFF')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))

		const row = new MessageActionRow().addComponents(
			new MessageButton().setLabel('web').setStyle('DANGER').setCustomId('web'),

			new MessageButton().setLabel('embed').setStyle('DANGER').setCustomId('text'),
		)

		await interaction.reply({ embeds: [embed], components: [row] })
		const filtro = (i) => i.user.id === interaction.user.id
		const collector = interaction.channel.createMessageComponentCollector({
			filter: filtro,
			time: 180000,
		})

		collector.on('collect', async (i) => {
			await i.deferUpdate()

			if (i.customId === 'web') {
				interaction.editReply({
					embeds: [
						embed.setDescription(
							'[TERMS OF SERVICE](https://sophia-bot.com/termsofservices)',
						),
					],
				})
			}

			if (i.customId === 'text') {
				interaction
					.editReply({
						embeds: [
							embed.setDescription(
								'Okay 🧡,\nprocedo a borrar el mensaje en 30 segundos, has elegido la opción ephemeral.',
							),
						],
						components: [],
					})
					.then(() => {
						setTimeout(() => {
							interaction.deleteReply()
						}, 30000)
					})
				interaction.followUp({
					embeds: [embed.setDescription(tos), toc],
					ephemeral: true,
				})
			}
		})
	},
}

module.exports = command
