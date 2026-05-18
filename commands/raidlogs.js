const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAll } = require('../db');
const { THEMES, DIVIDER } = require('../themes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raidlogs')
    .setDescription('🌋 View the raid logs archive')
    .addIntegerOption(opt =>
      opt.setName('page')
        .setDescription('Page number (default: 1)')
        .setRequired(false)
        .setMinValue(1)),

  async execute(interaction) {
    const theme = THEMES.raid;
    await interaction.deferReply();

    const allRaids = getAll('raids').reverse(); // newest first
    const page = interaction.options.getInteger('page') || 1;
    const perPage = 5;
    const totalPages = Math.max(1, Math.ceil(allRaids.length / perPage));
    const currentPage = Math.min(page, totalPages);
    const raids = allRaids.slice((currentPage - 1) * perPage, currentPage * perPage);

    if (allRaids.length === 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(theme.color)
            .setTitle(`${theme.headerEmoji} Raid Logs Archive`)
            .setDescription('> *No raids have been logged yet. Use `/raidlog` to record a raid.*')
            .setFooter({ text: theme.footer })
        ]
      });
    }

    const fields = [];
    for (const r of allRaids.slice((currentPage - 1) * perPage, currentPage * perPage)) {
      const date = Math.floor(r.id / 1000);
      const parts = r.participants.split(/,|\n/).map(p => p.trim()).filter(Boolean);
      let value = `⏳ **Duration:** ${r.duration}\n⚔️ **Participants:** ${parts.length}\n📅 <t:${date}:d>  🆔 \`#${r.id}\``;
      if (r.raidName) value += `\n📛 **Name:** ${r.raidName}`;
      if (r.document) value += `\n📜 [Document](${r.document})`;
      fields.push({ name: `${theme.accentEmoji} Raid #${r.id}${r.raidName ? ` — ${r.raidName}` : ''}`, value, inline: false });
    }

    const embed = new EmbedBuilder()
      .setColor(theme.color)
      .setTitle(`${theme.headerEmoji} RAID LOGS ARCHIVE`)
      .setDescription(`${theme.decorLine}\n> *All raids recorded from the lava fields of Booga.*\n${theme.decorLine}`)
      .addFields(...fields)
      .setFooter({ text: `${theme.footer} • Page ${currentPage}/${totalPages} • ${allRaids.length} total raids` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
