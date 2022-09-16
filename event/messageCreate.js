const { discordPrefix } = require(__dirname + '/../config.json')
const cmdUtil = require(__dirname + '/../util/commands')

module.exports = {
    name: 'messageCreate',
    async execute(message, bot) {
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        if(!cmd.startsWith(discordPrefix) && message.author.bot) return;
        const command = bot.commands.get(cmd.slice(discordPrefix.length));    
        if(!command || !command.message || (command.access !== undefined && !(await cmdUtil.checkAccess(command.access, message.member)))) return;
        if(message.channel.type === "dm" && command.direct !== true) return;
        try {
            return command.execute(bot, message, messageArray.slice(1));
        } catch (e) {
            return message.reply({ content: 'An error occured while processsing command', ephemeral: true });
        }
    }
}
