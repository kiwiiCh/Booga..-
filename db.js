const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const FILES = {
  raids: path.join(DATA_DIR, 'raids.json'),
  wars: path.join(DATA_DIR, 'wars.json'),
  tourneys: path.join(DATA_DIR, 'tourneys.json'),
  clanranks: path.join(DATA_DIR, 'clanranks.json'),
};

function readDB(key) {
  const file = FILES[key];
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeDB(key, data) {
  fs.writeFileSync(FILES[key], JSON.stringify(data, null, 2));
}

function appendEntry(key, entry) {
  const data = readDB(key);
  entry.id = Date.now();
  entry.timestamp = new Date().toISOString();
  data.push(entry);
  writeDB(key, data);
  return entry;
}

function getAll(key) {
  return readDB(key);
}

// Clan rank upsert: update if exists, insert if not
function upsertClanRank(clanName, wins, losses) {
  const data = readDB('clanranks');
  const normalizedName = clanName.toLowerCase();
  const idx = data.findIndex(c => c.clanNameLower === normalizedName);
  const entry = {
    clanName,
    clanNameLower: normalizedName,
    wins: parseInt(wins),
    losses: parseInt(losses),
    lastUpdated: new Date().toISOString(),
  };
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...entry };
  } else {
    entry.id = Date.now();
    data.push(entry);
  }
  // Sort by wins desc
  data.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  writeDB('clanranks', data);
  return entry;
}

function getClanRanks() {
  const data = readDB('clanranks');
  return data.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
}

module.exports = { appendEntry, getAll, upsertClanRank, getClanRanks };
