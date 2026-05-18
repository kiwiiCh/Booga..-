# 🌋 Booga War Logs Bot

> A Discord bot for **Roblox Booga** clans — log Raids, Wars, Tournaments and track Global Clan Rankings with persistent storage and themed embeds.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌋 Raid Logs | Log raids with duration, participants, optional name & document |
| 🪨 War Logs | Log wars with score, optional document & image |
| 👑 Tournament Logs | Log tourney results with score bar visual |
| 🌐 Clan Rankings | Global leaderboard auto-sorted by wins |
| 💾 Persistent Storage | JSON files — data survives restarts & redeploys |
| 🎨 Themed Embeds | Lava (Raid) • Obsidian (War) • God (Tourney/Clan) |
| 🔐 Role Gating | Only `@Logger` role can write logs; everyone can read |

---

## 🎮 Commands

### 📝 Logger-Only Commands (requires `@Logger` role)

#### `/raidlog`
```
/raidlog duration: "45 minutes" participants: "Player1, Player2, Player3"
         [raid_name: "Great Lava Raid"] [document: https://...] [image: <upload>]
```

#### `/warlog`
```
/warlog enemy_clan: "DarkClan" own_clan: "LavaClan" enemy_wins: 3 clan_wins: 7
        [document: https://...] [image: <upload>]
```

#### `/tourneylog`
```
/tourneylog clan_name: "GodClan" enemy_clan: "StoneClan" clan_wins: 5 enemy_wins: 2
            [document: https://...] [image: <upload>]
```

#### `/clanranklog`
```
/clanranklog clan_name: "LavaClan" clan_wins: 42 clan_loss: 8
```
Updates (or creates) a clan in the global rankings.

---

### 👁️ Public Commands (everyone can use)

#### `/clanrank`
Shows the global clan leaderboard, sorted by wins with win rate %.

#### `/warlogs [page]`
Browse all war logs, newest first. Paginated (5 per page).

#### `/raidlogs [page]`
Browse all raid logs, newest first. Paginated (5 per page).

---

## 🚀 Setup Guide

### Step 1 — Create the Discord Bot

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application** → give it a name (e.g. `Booga Logs Bot`)
3. Go to **Bot** tab → click **Add Bot**
4. Under **Privileged Gateway Intents**, enable:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Click **Reset Token** → copy the token (this is your `BOT_TOKEN`)
6. Copy the **Application ID** from the General Information tab (this is your `CLIENT_ID`)

### Step 2 — Invite the Bot to Your Server

Go to **OAuth2 → URL Generator**, select:
- Scopes: `bot`, `applications.commands`
- Bot Permissions: `Send Messages`, `Embed Links`, `Attach Files`, `Read Message History`

Copy and open the generated URL, then invite the bot to your server.

### Step 3 — Create the `@Logger` Role

In your Discord server:
1. Go to **Server Settings → Roles**
2. Create a new role called exactly: **`Logger`**
3. Assign it to your trusted log managers

---

## ☁️ Deploy on Render (Recommended)

Render gives you **free persistent disk storage** — your data won't be lost on redeploys.

### Steps:

1. Push this project to a **GitHub repository**
2. Go to [render.com](https://render.com) and sign in
3. Click **New → Web Service** → connect your GitHub repo
4. Configure:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `BOT_TOKEN` | Your bot token |
   | `CLIENT_ID` | Your application ID |
   | `GUILD_ID` | Your server ID (optional, for fast command registration) |
6. Add a **Disk** (under Advanced):
   - Name: `bot-data`
   - Mount Path: `/opt/render/project/src/data`
   - Size: 1 GB (free tier)
7. Click **Create Web Service**

> ✅ The `render.yaml` file in this repo pre-configures all of this!

---

## 💻 Run Locally

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/booga-bot
cd booga-bot
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and fill in BOT_TOKEN, CLIENT_ID, GUILD_ID

# 3. Start
npm start
# or for development with auto-restart:
npm run dev
```

---

## 📁 Project Structure

```
booga-bot/
├── index.js          # Bot entry point & command loader
├── db.js             # Persistent JSON database helpers
├── themes.js         # Themed colors, emojis & decorations
├── commands/
│   ├── raidlog.js    # /raidlog — log a raid
│   ├── warlog.js     # /warlog — log a war
│   ├── tourneylog.js # /tourneylog — log a tournament
│   ├── clanranklog.js # /clanranklog — update clan rank
│   ├── clanrank.js   # /clanrank — view clan leaderboard
│   ├── warlogs.js    # /warlogs — view war archive
│   └── raidlogs.js   # /raidlogs — view raid archive
├── data/             # Auto-created; all JSON log files live here
│   ├── raids.json
│   ├── wars.json
│   ├── tourneys.json
│   └── clanranks.json
├── .env.example      # Copy this to .env and fill in values
├── render.yaml       # Render deployment config
└── package.json
```

---

## 🎨 Themes

| Log Type | Theme | Color | Vibe |
|---|---|---|---|
| 🌋 Raids | Lava Theme | `#FF4500` | Molten, fierce, volcanic |
| 🪨 Wars | Obsidian Theme | `#1A1A2E` | Dark, heavy, powerful |
| 👑 Tournaments | Booga God Theme | `#FFD700` | Divine gold, legendary |
| 🌐 Clan Ranks | God Theme | `#C0A000` | Prestige, global glory |

---

## ❓ Troubleshooting

**Slash commands not showing?**
- Make sure `CLIENT_ID` is correct
- If using `GUILD_ID`, commands appear instantly. Without it, global commands take up to 1 hour.

**Data disappearing on Render?**
- Make sure you added the **Disk** with mount path `/opt/render/project/src/data`
- Without the disk, Render's filesystem resets on every deploy

**Bot not responding?**
- Check that `BOT_TOKEN` is correct and the bot is online in Discord
- Check Render logs for errors
