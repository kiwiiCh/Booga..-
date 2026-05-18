const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { appendEntry } = require('../db');
const { THEMES, DIVIDER } = require('../themes');

const LOGGER_ROLE_NAME = 'Logger';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tourneylog')
    .setDescription('✨ Log a tournament result (Logger role required)')
    .addStringOption(opt =>
      opt.setName('clan_name')
        .setDescription('Your clan name')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('enemy_clan')
        .setDescription('Enemy/other clan name')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('clan_wins')
        .setDescription('Your clan\'s wins')
        .setRequired(true)
        .setMinValue(0))
    .addIntegerOption(opt =>
      opt.setName('enemy_wins')
        .setDescription('Enemy clan\'s wins')
        .setRequired(true)
        .setMinValue(0))
    .addStringOption(opt =>
      opt.setName('document')
        .setDescription('[Optional] Link to tournament documentation')
        .setRequired(false))
    .addAttachmentOption(opt =>
      opt.setName('image')
        .setDescription('[Optional] Tournament screenshot or image')
        .setRequired(false)),

  async execute(interaction) {
    const theme = THEMES.tourney;

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
    const enemyClan = interaction.options.getString('enemy_clan');
    const clanWins = interaction.options.getInteger('clan_wins');
    const enemyWins = interaction.options.getInteger('enemy_wins');
    const document = interaction.options.getString('document');
    const image = interaction.options.getAttachment('image');

    const entry = appendEntry('tourneys', {
      clanName,
      enemyClan,
      clanWins,
      enemyWins,
      document: document || null,
      imageUrl: image?.url || null,
      loggedBy: interaction.user.id,
      loggedByTag: interaction.user.tag,
      guild: interaction.guildId,
    });

    const winner = clanWins > enemyWins ? clanName : (enemyWins > clanWins ? enemyClan : null);
    const resultLabel = winner ? `👑 **${winner}** reigns supreme!` : `⚖️ **Draw — equally matched!**`;

    // Score bar visual
    const total = clanWins + enemyWins;
    const barLength = 20;
    const ownBars = total > 0 ? Math.round((clanWins / total) * barLength) : barLength / 2;
    const enemyBars = barLength - ownBars;
    const bar = `${'🟡'.repeat(ownBars)}${'⬛'.repeat(enemyBars)}`;
    const barLabel = `${clanName} [${clanWins}] ${bar} [${enemyWins}] ${enemyClan}`;

    const embed = new EmbedBuilder()
      .setColor(theme.color)
      .setTitle(`${theme.headerEmoji} TOURNAMENT LOG — ${clanName.toUpperCase()} vs ${enemyClan.toUpperCase()}`)
      .setDescription(`${theme.decorLine}\n> *The gods of Booga have witnessed this tournament.*\n${theme.decorLine}`)
      .addFields(
        { name: `${theme.icons.clan1} Your Clan`, value: `\`${clanName}\``, inline: true },
        { name: `${theme.icons.clan2} Enemy Clan`, value: `\`${enemyClan}\``, inline: true },
        { name: `${theme.icons.id} Log ID`, value: `\`#${entry.id}\``, inline: true },
        { name: DIVIDER, value: ' ', inline: false },
        { name: `${theme.icons.win1} Score`, value: `**${clanName}:** ${clanWins} wins\n**${enemyClan}:** ${enemyWins} wins`, inline: false },
        { name: `📊 Match Bar`, value: barLabel, inline: false },
        { name: `👑 Result`, value: resultLabel, inline: false },
        { name: `${theme.icons.id} Date`, value: `<t:${Math.floor(entry.id / 1000)}:F>`, inline: true },
        { name: `👁️ Logged By`, value: `<@${interaction.user.id}>`, inline: true },
      )
      .setFooter({ text: theme.footer, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    if (document) embed.addFields({ name: `${theme.icons.doc} Documentation`, value: `[📜 View Document](${document})`, inline: false });
    if (image) embed.setImage(image.url);

    await interaction.editReply({ embeds: [embed] });
  }
};
