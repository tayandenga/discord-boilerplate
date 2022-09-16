const { WebhookClient } = require('discord.js');
const { discordWebhook } = require(__dirname + '/../config.json')

module.exports = {
    logger: new WebhookClient({
        url: discordWebhook
    }),
    async log(text) {
        this.logger.send(text).catch(e => console.log('Webhook Logger error', e))
    },
    makeArgs(args, list) {
        var result = {}
        list.map((data, id) => {
            if (data.joinable) {
                result[data.key] = args.slice(id).join(' ')
            } else {
                result[data.key] = args[id]
            }
        });
        return result
    },
    async checkAccess(access, member) {
        if(typeof access !== 'object') return false;
        return member.roles.cache.some(r => access.includes(r.id))
    },
    async prepareCommand(interaction, real, ephemeral) {
        if (!real) return interaction.reply('Processing...')
        await interaction.deferReply({ ephemeral: ephemeral || false })
        return
    },
    async finishCommand(interaction, response, message) {
        if (message) return message.edit(response)
        if (typeof response !== 'object') return interaction.editReply({ content: response })
        return interaction.editReply(response)
    }
}
