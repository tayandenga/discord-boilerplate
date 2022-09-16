const {
    discordToken,
    discordUser,
    discordDescription,
    discordGuild
} = require(__dirname + '/../config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
    name: 'ready',
    once: true,
    execute(bot) {
        bot.user.setUsername(discordUser);
        bot.user.setActivity(discordDescription, { type: 'STREAMING' });

        const commands = [];
        for (const command of Array.from(bot.commands.values())) {
            try {
                if(command.interaction) commands.push(command.data.toJSON());
            } catch(e) {}
        }

        (async () => {
            const rest = new REST({ version: '9' }).setToken(discordToken);
            try {
                console.log('Started refreshing application slash commands...');
                await rest.put(
                    Routes.applicationGuildCommands(bot.user.id, discordGuild),
                    { body: commands },
                );
                console.log('Successfully reloaded application slash commands!');
            } catch (error) {
                console.error(error);
            }
        })();
        console.log(`${bot.user.username} is online!`);
    }
}
