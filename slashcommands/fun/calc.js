const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	category: 'Diversión',
	data: new SlashCommandBuilder()
		.setName('calculator')
		.setDescription('abre una calculadora en discord'),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(_, interaction) {
		const { Calculator } = require('slash-calculator')

		await Calculator({
			interaction: interaction,
			embed: {
				title: 'Calculadora',
				color: '#5865F2',
				footer: ';)',
				timestamp: true,
			},
			disabledQuery: 'La calculadora está desactivada!',
			invalidQuery: 'La ecuación proporcionada no es válida!',
			othersMessage: 'Solo <@{{author}}> puede usar los botones!',
		})
	},
}

module.exports = command
