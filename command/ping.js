const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	interaction: true,
	message: true,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check vitality of bot'),
	async execute(bot, interaction) {
		return interaction.reply({ content: 'My ping is ' + interaction.client.ws.ping + 'ms', ephemeral: true })
	}
}