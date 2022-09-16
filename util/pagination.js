const {
  MessageActionRow,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
/**
 * Creates a pagination embed
 * @param {Interaction} interaction
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
const paginationEmbed = async (
  interaction,
  pages,
  buttonList,
  timeout = 120000,
  page
) => {
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");
  if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
    throw new Error(
      "Link buttons are not supported with discordjs-button-pagination"
    );
  if (buttonList.length !== 2) throw new Error("Need two buttons.");

  const row = new MessageActionRow().addComponents(buttonList);

  //has the interaction already been deferred? If not, defer the reply.
  if (interaction.deferred == false) {
    await interaction.deferReply();
  }

  const curPage = await interaction.editReply({
    embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
    components: [row],
    fetchReply: true,
  });

  const filter = (i) =>
    i.customId === buttonList[0].customId ||
    i.customId === buttonList[1].customId;

  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].customId:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[1].customId:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", (_, reason) => {
    if (reason !== "messageDelete") {
      curPage.edit({
        embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
        components: [
          new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          )
        ],
      });
    }
  });

  return curPage;
};
module.exports = {
  paginationEmbed: paginationEmbed,
  async pagination(interaction, pages, page) {
    if(page === undefined) page = 0
    return paginationEmbed(interaction, pages, [
      new MessageButton()
        .setCustomId('previousbtn')
        .setLabel('⬅️')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('nextbtn')
        .setLabel('➡️')
        .setStyle('SECONDARY')
    ], 60000, Math.max(0, Math.min(pages.length - 1, page)));
  }
}