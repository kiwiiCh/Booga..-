const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAll } = require('../db');
const { THEMES, DIVIDER } = require('../themes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warlogs')
    .setDescription('⚔️ View the war logs archive')
    .addIntegerOption(opt =>
      opt.setName('page')
        .setDescription('Page number (default: 1)')
        .setRequired(false)
        .setMinValue(1)),

  async execute(interaction) {
    const theme = THEMES.war;
    await interaction.deferReply();

    const allWars = getAll('wars').reverse(); // newest first
    const page = interaction.options.getInteger('page') || 1;
    const perPage = 5;
    const totalPages = Math.max(1, Math.ceil(allWars.length / perPage));
    const currentPage = Math.min(page, totalPages);
    const wars = allWars.slice((currentPage - 1) * perPage, currentPage * perPage);

    if (allWars.length === 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(theme.color)
            .setTitle(`${theme.headerEmoji} War Logs Archive`)
            .setDescription('> *No wars have been logged yet. Use `/warlog` to record a war.*')
            .setFooter({ text: theme.footer })
        ]
      });
    }

    const fields = [];
    for (const w of wars) {
      const winner = w.clanWins > w.enemyWins ? w.ownClan : (w.enemyWins > w.clanWins ? w.enemyClan : 'Draw');
      const date = Math.floor(w.id / 1000);
      let value = `⚔️ **${w.ownClan}** vs 🏴 **${w.enemyClan}**\n🏆 ${w.ownClan}: **${w.clanWins}** | 💀 ${w.enemyClan}: **${w.enemyWins}**\n🎖️ Winner: **${winner}**\n📅 <t:${date}:d>  🆔 \`#${w.id}\``;
      if (w.document) value += `\n📜 [Document](${w.document})`;
      fields.push({ name: `${theme.accentEmoji} War #${w.id}`, value, inline: false });
    }

    const embed = new EmbedBuilder()
      .setColor(theme.color)
      .setTitle(`${theme.headerEmoji} WAR LOGS ARCHIVE`)
      .setDescription(`${theme.decorLine}\n> *All wars fought under the obsidian sky.*\n${theme.decorLine}`)
      .addFields(...fields)
      .setFooter({ text: `${theme.footer} • Page ${currentPage}/${totalPages} • ${allWars.length} total wars` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
