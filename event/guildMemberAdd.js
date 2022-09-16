const tools = require(__dirname + '/../util/tools')

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, bot) {
        if(member.nickname === null || member.nickname === undefined) await member.setNickname(tools.stripUnicode(member.user.username))
        else await member.setNickname(tools.stripUnicode(member.nickname))
    }
}