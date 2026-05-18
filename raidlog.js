const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { appendEntry } = require('../db');
const { THEMES, DIVIDER } = require('../themes');

const LOGGER_ROLE_NAME = 'Logger';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raidlog')
    .setDescription('🌋 Log a raid event (Logger role required)')
    .addStringOption(opt =>
      opt.setName('duration')
        .setDescription('How long the raid lasted (e.g. "45 minutes", "2 hours")')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('participants')
        .setDescription('Players/participants in the raid (comma-separated or list)')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('raid_name')
        .setDescription('[Optional] Name of the raid')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('document')
        .setDescription('[Optional] Link to raid documentation')
        .setRequired(false))
    .addAttachmentOption(opt =>
      opt.setName('image')
        .setDescription('[Optional] Raid screenshot or image')
        .setRequired(false)),

  async execute(interaction) {
    const theme = THEMES.raid;

    // Role check
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

    const duration = interaction.options.getString('duration');
    const participants = interaction.options.getString('participants');
    const raidName = interaction.options.getString('raid_name');
    const document = interaction.options.getString('document');
    const image = interaction.options.getAttachment('image');

    // Persist
    const entry = appendEntry('raids', {
      duration,
      participants,
      raidName: raidName || null,
      document: document || null,
      imageUrl: image?.url || null,
      loggedBy: interaction.user.id,
      loggedByTag: interaction.user.tag,
      guild: interaction.guildId,
    });

    // Build participant list (up to 20 shown)
    const parts = participants.split(/,|\n/).map(p => p.trim()).filter(Boolean);
    const partDisplay = parts.slice(0, 20).map((p, i) => `${theme.icons.players} ${p}`).join('\n')
      + (parts.length > 20 ? `\n*...and ${parts.length - 20} more*` : '');

    const embed = new EmbedBuilder()
      .setColor(theme.color)
      .setTitle(`${theme.headerEmoji} RAID LOG — ${raidName ? raidName.toUpperCase() : 'UNNAMED RAID'}`)
      .setDescription(`${theme.decorLine}\n> *A new raid has been recorded in the Booga archives.*\n${theme.decorLine}`)
      .addFields(
        { name: `${theme.icons.time} Duration`, value: `\`\`\`${duration}\`\`\``, inline: true },
        { name: `${theme.icons.id} Log ID`, value: `\`\`\`#${entry.id}\`\`\``, inline: true },
        { name: `${theme.icons.date} Date`, value: `<t:${Math.floor(entry.id / 1000)}:F>`, inline: true },
        { name: DIVIDER, value: ' ', inline: false },
        { name: `${theme.icons.players} Participants (${parts.length})`, value: partDisplay || '*(none listed)*', inline: false },
      )
      .setFooter({ text: `${theme.footer} • Logged by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    if (raidName) embed.addFields({ name: `${theme.icons.name} Raid Name`, value: raidName, inline: true });
    if (document) embed.addFields({ name: `${theme.icons.doc} Documentation`, value: `[📜 View Document](${document})`, inline: true });
    if (image) {
      embed.setImage(image.url);
      embed.addFields({ name: `${theme.icons.img} Image`, value: '*(attached below)*', inline: true });
    }

    await interaction.editReply({ embeds: [embed] });
  }
};
