const cmdUtil = require(__dirname + '/../util/commands')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, bot) {
        if(interaction.isSelectMenu()) {
            const menu = bot.menus.get(interaction.customId);
            if (!menu || (menu.access !== undefined && !(await cmdUtil.checkAccess(menu.access, interaction.member)))) return;
            try {
                return menu.execute(bot, interaction);
            } catch (error) {
                return interaction.reply({ content: 'An error occured while processsing request', ephemeral: true });
            }
        }
        if(interaction.isButton()) {
            const button = bot.buttons.get(interaction.customId);
            if (!button || (button.access !== undefined && !(await cmdUtil.checkAccess(button.access, interaction.member)))) return;
            try {
                return button.execute(bot, interaction);
            } catch (error) {
                return interaction.reply({ content: 'An error occured while processsing request', ephemeral: true });
            }
        }
        if(interaction.isCommand()) {
            const command = bot.commands.get(interaction.commandName);
            if (!command || (command.access !== undefined && !(await cmdUtil.checkAccess(command.access, interaction.member)))) return;
            try {
                return command.execute(bot, interaction);
            } catch (error) {
                return interaction.reply({ content: 'An error occured while processsing command', ephemeral: true });
            }
        }
    }
}