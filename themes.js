// ═══════════════════════════════════════════
//  BOOGA: WAR LOGS BOT — Theme & Emoji Config
// ═══════════════════════════════════════════

const THEMES = {
  // 🔥 RAID — Lava Theme
  raid: {
    color: 0xFF4500,         // Deep lava orange-red
    footer: '🌋 Booga Raid Registry • Lava Division',
    headerEmoji: '🌋',
    accentEmoji: '🔥',
    borderTop: '```ansi\n\u001b[2;31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\u001b[0m\n```',
    decorLine: '🔥━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🔥',
    thumbnail: null,
    badge: '🌋 **RAID LOG**',
    icons: {
      time: '⏳',
      players: '⚔️',
      name: '📛',
      doc: '📜',
      img: '🖼️',
      id: '🆔',
      date: '📅',
      logger: '👁️',
    }
  },

  // ⚔️ WAR — Obsidian Theme
  war: {
    color: 0x1A1A2E,         // Deep obsidian
    footer: '🪨 Booga War Registry • Obsidian Division',
    headerEmoji: '🪨',
    accentEmoji: '⚔️',
    borderTop: '```ansi\n\u001b[2;34m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\u001b[0m\n```',
    decorLine: '⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️',
    badge: '🪨 **WAR LOG**',
    icons: {
      enemy: '🏴',
      own: '🏳️',
      enemyWins: '💀',
      ownWins: '🏆',
      doc: '📜',
      img: '🖼️',
      id: '🆔',
      date: '📅',
      logger: '👁️',
    }
  },

  // 🏆 TOURNAMENT — Booga God Theme
  tourney: {
    color: 0xFFD700,         // Divine gold
    footer: '✨ Booga Tournament Registry • God Division',
    headerEmoji: '✨',
    accentEmoji: '👑',
    borderTop: '```ansi\n\u001b[2;33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\u001b[0m\n```',
    decorLine: '👑━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━👑',
    badge: '✨ **TOURNAMENT LOG**',
    icons: {
      clan1: '🛡️',
      clan2: '⚡',
      win1: '🏆',
      win2: '💔',
      doc: '📜',
      img: '🖼️',
      id: '🆔',
      date: '📅',
      logger: '👁️',
    }
  },

  // 🌐 CLAN RANK — God Theme (gold/divine)
  clanrank: {
    color: 0xC0A000,
    footer: '🌐 Booga Global Clan Registry',
    headerEmoji: '🌐',
    accentEmoji: '👑',
    decorLine: '🌐━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌐',
    badge: '🌐 **CLAN RANK**',
    icons: {
      rank: '🏅',
      wins: '✅',
      losses: '❌',
      ratio: '📊',
    }
  }
};

// Medal emojis for top 3 in leaderboards
const RANK_MEDALS = ['🥇', '🥈', '🥉'];
const RANK_EMOJI = (i) => i < 3 ? RANK_MEDALS[i] : `**#${i + 1}**`;

// Divider for embeds
const DIVIDER = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';

module.exports = { THEMES, RANK_EMOJI, DIVIDER };
