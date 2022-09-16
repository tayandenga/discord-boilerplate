const { discordToken } = require(__dirname + '/config.json')
const { Client, Collection, Intents } = require('discord.js')
const fs = require('node:fs')

const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
})

bot.commands = new Collection()
for (let file of fs.readdirSync(__dirname + '/command').filter(file => file.endsWith('.js'))) {
    let command = require(__dirname + '/command/' + file)
    bot.commands.set(command.data.name, command)
}

bot.buttons = new Collection()
for (let file of fs.readdirSync(__dirname + '/button').filter(file => file.endsWith('.js'))) {
    let button = require(__dirname + '/button/' + file)
    bot.buttons.set(button.customId, button)
}

bot.menus = new Collection()
for (let file of fs.readdirSync(__dirname + '/menu').filter(file => file.endsWith('.js'))) {
    let menu = require(__dirname + '/menu/' + file)
    bot.menus.set(menu.customId, menu)
}

for (let file of fs.readdirSync(__dirname + '/event').filter(file => file.endsWith('.js'))) {
    const event = require(__dirname + '/event/' + file)
    if(event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot))
    } else {
        bot.on(event.name, (...args) => event.execute(...args, bot))
    }
}
bot.login(discordToken)

process.on('unhandledRejection', (reason, p) => {
    console.log(reason)
})
process.on('uncaughtException', (error, origin) => {
    console.log(error)
})
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(error)
})
process.on('multipleResolves', (reason, p) => {
    console.log(reason)
})
