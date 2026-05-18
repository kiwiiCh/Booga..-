const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { appendEntry } = require('../db');
const { THEMES, DIVIDER } = require('../themes');

const LOGGER_ROLE_NAME = 'Logger';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warlog')
    .setDescription('🪨 Log a war result (Logger role required)')
    .addStringOption(opt =>
      opt.setName('enemy_clan')
        .setDescription('Name of the enemy clan')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('own_clan')
        .setDescription('Your clan name')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('enemy_wins')
        .setDescription('Number of wins by the enemy clan')
        .setRequired(true)
        .setMinValue(0))
    .addIntegerOption(opt =>
      opt.setName('clan_wins')
        .setDescription('Number of wins by your clan')
        .setRequired(true)
        .setMinValue(0))
    .addStringOption(opt =>
      opt.setName('document')
        .setDescription('[Optional] Link to war documentation')
        .setRequired(false))
    .addAttachmentOption(opt =>
      opt.setName('image')
        .setDescription('[Optional] War screenshot or image')
        .setRequired(false)),

  async execute(interaction) {
    const theme = THEMES.war;

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

    const enemyClan = interaction.options.getString('enemy_clan');
    const ownClan = interaction.options.getString('own_clan');
    const enemyWins = interaction.options.getInteger('enemy_wins');
    const clanWins = interaction.options.getInteger('clan_wins');
    const document = interaction.options.getString('document');
    const image = interaction.options.getAttachment('image');

    const entry = appendEntry('wars', {
      enemyClan,
      ownClan,
      enemyWins,
      clanWins,
      document: document || null,
      imageUrl: image?.url || null,
      loggedBy: interaction.user.id,
      loggedByTag: interaction.user.tag,
      guild: interaction.guildId,
    });

    const winner = clanWins > enemyWins ? ownClan : (enemyWins > clanWins ? enemyClan : null);
    const winnerLabel = winner ? `🏆 **${winner}** wins` : `⚖️ **Draw**`;
    const ownScore = `🏆 ${ownClan}: **${clanWins}** wins`;
    const enemyScore = `💀 ${enemyClan}: **${enemyWins}** wins`;

    const embed = new EmbedBuilder()
      .setColor(theme.color)
      .setTitle(`${theme.headerEmoji} WAR LOG — ${ownClan.toUpperCase()} vs ${enemyClan.toUpperCase()}`)
      .setDescription(theme.decorLine)
      .addFields(
        { name: `🏳️ Your Clan`, value: `\`${ownClan}\``, inline: true },
        { name: `🏴 Enemy Clan`, value: `\`${enemyClan}\``, inline: true },
        { name: `🆔 Log ID`, value: `\`#${entry.id}\``, inline: true },
        { name: DIVIDER, value: ' ', inline: false },
        { name: `⚔️ Results`, value: `${ownScore}\n${enemyScore}`, inline: false },
        { name: `🎖️ Outcome`, value: winnerLabel, inline: false },
        { name: `📅 Date`, value: `<t:${Math.floor(entry.id / 1000)}:F>`, inline: true },
        { name: `👁️ Logged By`, value: `<@${interaction.user.id}>`, inline: true },
      )
      .setFooter({ text: theme.footer, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    if (document) embed.addFields({ name: `📜 Document`, value: `[View Document](${document})`, inline: false });
    if (image) embed.setImage(image.url);

    await interaction.editReply({ embeds: [embed] });
  }
};
