# 🌅 Golden Summer Sunset — Birthday Website

A cinematic, clock-aware birthday website for your friend's special day.

---

## 📁 File Structure

```
birthday-site/
├── index.html          ← Main website (don't need to edit)
├── style.css           ← All styles and animations (don't need to edit)
├── script.js           ← All interactivity (don't need to edit)
├── content.js          ← ✏️ EDIT THIS — name, message, sender, etc.
├── birthday-song.mp3   ← 🎵 ADD YOUR MUSIC FILE HERE (optional)
├── vercel.json         ← Vercel deployment config
└── README.md           ← This file
```

---

## ✏️ How to Personalise

1. Open **`content.js`** in any text editor (Notepad, TextEdit, VS Code, etc.)
2. Change the text between the `" "` quotes
3. Save the file

**That's it!** No coding required.

---

## 🎵 Adding Background Music

1. Find a birthday song or any .mp3 you like
2. Rename the file to `birthday-song.mp3`
3. Place it in the same folder as `index.html`
4. In `content.js`, make sure `musicFile: "birthday-song.mp3"` is set

> **Tip:** Royalty-free music sources: [pixabay.com/music](https://pixabay.com/music/), [freemusicarchive.org](https://freemusicarchive.org/)

---

## 🚀 Deploy to Vercel (get a shareable link)

### Option A — Vercel Web UI (easiest, no terminal)

1. Go to [vercel.com](https://vercel.com) and create a free account
2. Click **"Add New Project"**
3. Choose **"Upload"** (drag & drop the entire `birthday-site` folder)
4. Click **Deploy** — you'll get a live link in ~30 seconds! 🎉

### Option B — Vercel CLI (terminal)

```bash
# Install Vercel CLI (only once)
npm install -g vercel

# Go into the project folder
cd birthday-site

# Deploy
vercel --prod
```

Follow the prompts. You'll get a URL like:
`https://birthday-site-abc123.vercel.app`

Share that link with your friend! 🎂

---

## 🌅 Features

- **Clock-aware sky** — automatically detects the viewer's local time
  - Morning: bright blue sky with soft clouds
  - Afternoon: warm golden hour hues
  - Evening/Night: deep sunset oranges → purples → starry night with moon
- **Live sky gradient** shifts smoothly and cinematically in real time
- **Sun/Moon** that moves across the sky based on the hour
- **3 layered animated ocean waves** with parallax depth
- **Drifting clouds** at different speeds and heights
- **Message in a Bottle** — tap to reveal the birthday scroll with smooth animation
- **Animated seagulls** flying across periodically
- **Sparkle cursor trail** on desktop
- **Film grain texture** for a cinematic feel
- **Background music** player (optional)
- **Mobile-first** and fully responsive

---

## 🛠 Technical Notes

- Pure HTML + CSS + Vanilla JS — no frameworks, no npm, no build step
- All animations are CSS-only (60fps smooth)
- Fonts: Cormorant Garamond + Jost (Google Fonts)
- Works offline after first load (except Google Fonts)
