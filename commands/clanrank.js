const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getClanRanks } = require('../db');
const { THEMES, RANK_EMOJI, DIVIDER } = require('../themes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clanrank')
    .setDescription('🌐 View the global Booga clan leaderboard'),

  async execute(interaction) {
    const theme = THEMES.clanrank;
    await interaction.deferReply();

    const clans = getClanRanks();

    if (clans.length === 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(theme.color)
            .setTitle(`${theme.headerEmoji} Global Clan Rankings`)
            .setDescription('> *No clans have been ranked yet. Use `/clanranklog` to add a clan.*')
            .setFooter({ text: theme.footer })
        ]
      });
    }

    // Build top 25 leaderboard
    const leaderboard = clans.slice(0, 25).map((clan, i) => {
      const medal = RANK_EMOJI(i);
      const total = clan.wins + clan.losses;
      const wr = total > 0 ? ((clan.wins / total) * 100).toFixed(1) : '0.0';
      return `${medal} **${clan.clanName}** — ✅ ${clan.wins}W / ❌ ${clan.losses}L  \`(${wr}%)\``;
    }).join('\n');

    const top = clans[0];
    const topTotal = top.wins + top.losses;
    const topWR = topTotal > 0 ? ((top.wins / topTotal) * 100).toFixed(1) : '0.0';

    const embed = new EmbedBuilder()
      .setColor(theme.color)
      .setTitle(`${theme.headerEmoji} GLOBAL CLAN RANKINGS`)
      .setDescription(`${theme.decorLine}\n> *The mightiest clans of Booga, ranked by glory.*\n${theme.decorLine}`)
      .addFields(
        { name: `👑 #1 Clan — ${top.clanName}`, value: `✅ **${top.wins}** Wins  |  ❌ **${top.losses}** Losses  |  📊 **${topWR}%** Win Rate`, inline: false },
        { name: DIVIDER, value: ' ', inline: false },
        { name: `🏅 Full Leaderboard (Top ${Math.min(clans.length, 25)})`, value: leaderboard, inline: false },
        { name: DIVIDER, value: ' ', inline: false },
        { name: `📈 Total Clans Ranked`, value: `\`${clans.length}\``, inline: true },
        { name: `📅 As Of`, value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
      )
      .setFooter({ text: theme.footer })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
