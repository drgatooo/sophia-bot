/* eslint-disable no-unused-vars */
const { CommandInteraction, Client } = require('discord.js-light')

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {String} keys
 * @return {String[]}
 */

module.exports = (client, interaction, ...keys) => {
	return keys.map((key) =>
		client.language.get(key)[interaction.locale]
			? client.language.get(key)[interaction.locale].replace('&44', ',')
			: client.language.get(key)['en-US'].replace('&44', ','),
	)
}
