const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { upsertClanRank } = require('../db');
const { THEMES, DIVIDER } = require('../themes');

const LOGGER_ROLE_NAME = 'Logger';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clanranklog')
    .setDescription('🌐 Log or update a clan\'s global ranking stats (Logger role required)')
    .addStringOption(opt =>
      opt.setName('clan_name')
        .setDescription('Name of the clan')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('clan_wins')
        .setDescription('Total wins of the clan')
        .setRequired(true)
        .setMinValue(0))
    .addIntegerOption(opt =>
      opt.setName('clan_loss')
        .setDescription('Total losses of the clan')
        .setRequired(true)
        .setMinValue(0)),

  async execute(interaction) {
    const theme = THEMES.clanrank;

    const member = interaction.member;
    const hasRole = member.roles.cache.some(r => r.name === LOGGER_ROLE_NAME)
      || member.permissions.has(PermissionFlagsBits.Administrator);
    if (!hasRole) {
      return interaction.reply({
        content: `🔒 You need the **@${LOGGER_ROLE_NAME}** role to use this command.`,
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const clanName = interaction.options.getString('clan_name');
    const wins = interaction.options.getInteger('clan_wins');
    const losses = interaction.options.getInteger('clan_loss');

    const entry = upsertClanRank(clanName, wins, losses);
    const total = wins + losses;
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

    const embed = new EmbedBuilder()
      .setColor(theme.color)
      .setTitle(`${theme.headerEmoji} CLAN RANK UPDATED — ${clanName.toUpperCase()}`)
      .setDescription(`${theme.decorLine}\n> *Clan standing has been recorded in the global registry.*\n${theme.decorLine}`)
      .addFields(
        { name: `🏰 Clan Name`, value: `\`${clanName}\``, inline: true },
        { name: `${theme.icons.wins} Wins`, value: `\`${wins}\``, inline: true },
        { name: `${theme.icons.losses} Losses`, value: `\`${losses}\``, inline: true },
        { name: DIVIDER, value: ' ', inline: false },
        { name: `${theme.icons.ratio} Win Rate`, value: `\`${winRate}%\``, inline: true },
        { name: `📅 Last Updated`, value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        { name: `👁️ Updated By`, value: `<@${interaction.user.id}>`, inline: true },
      )
      .setFooter({ text: theme.footer, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};
