---
name: hp-content-config
description: >
  Transforms a beach-themed birthday website's content.js into a Harry Potter / Hogwarts-themed version.
  Replaces the time-based theme system (morning/afternoon/sunset/night) with 4 Hogwarts house themes
  (Gryffindor, Slytherin, Ravenclaw, Hufflepuff). Adds house-specific video backgrounds, fallback colors,
  personality-matched birthday messages, and magical UI text (openingCharm, spellLabel, scrollTitle).
  Preserves all original fields (friendName, birthdayDate, senderName, musicFile) and outputs a
  complete, heavily-commented content.js ready for non-coders to edit.
  Use this skill whenever the user asks to: "make a Harry Potter birthday site", "convert content.js
  to Harry Potter theme", "add Hogwarts houses to the birthday website", "replace beach theme with HP
  theme", "hp content config", or any request involving transforming a birthday website config into a
  Hogwarts / wizarding world style.
---

# hp-content-config Skill

## Purpose

Transform a beach/time-based birthday website `content.js` into a Hogwarts house–themed equivalent.
The output must be a **single, complete, drop-in `content.js`** that:
- A non-coder can open in Notepad/TextEdit and customise without breaking anything.
- Has generous inline comments explaining every field in plain English.
- Works as a drop-in replacement (same export shape the rest of the site already reads).

---

## What to Preserve (Original Fields)

Always keep these fields from the original site — they are read by the rest of the website:

| Field | Purpose |
|---|---|
| `friendName` | The birthday person's name |
| `birthdayDate` | Date shown in the letter |
| `senderName` | Who is sending the card |
| `musicFile` | Background music filename (in `/music/` folder) |

---

## What to Replace / Add

### 1. Replace time-based themes → House themes

Remove `morningVideo`, `afternoonVideo`, `sunsetVideo`, `nightVideo` (and any matching fallback colors).

Add per-house video and fallback color:

```js
gryffindorVideo: "gryffindor.mp4",
slytherinVideo:  "slytherin.mp4",
ravenclawVideo:  "ravenclaw.mp4",
hufflepuffVideo: "hufflepuff.mp4",

gryffindorFallbackColor: "#740001",
slytherinFallbackColor:  "#1A472A",
ravenclawFallbackColor:  "#0E1A40",
hufflepuffFallbackColor: "#ECB939",
```

### 2. House-specific birthday messages

Each message must match the house's canonical personality. Use the templates below as defaults —
but **always personalise them** using `friendName` and `senderName` from the config, and invite
the user to customise the tone/content further.

| House | Tone Keywords | Default Opening Line |
|---|---|---|
| Gryffindor | brave, warm, lion-hearted, daring | "To the most daring soul I know..." |
| Slytherin | sophisticated, ambitious, elegant, cunning | "To one whose brilliance is unmatched..." |
| Ravenclaw | wise, poetic, intellectual, curious | "To a mind as vast as the night sky..." |
| Hufflepuff | loyal, heartfelt, warm, steadfast | "To the truest friend in all of Hogwarts..." |

Fields in the config object:

```js
gryffindorMessage: `...`,
slytherinMessage:  `...`,
ravenclawMessage:  `...`,
hufflepuffMessage: `...`,
```

Each message should be 3–5 sentences, written as a magical birthday letter excerpt.

### 3. House / UI control fields

```js
senderHouse:  "Gryffindor",   // which house the sender belongs to
defaultHouse: "Gryffindor",   // which house theme loads on first visit
```

### 4. Magical UI text

```js
openingCharm: "Tap to unseal — an owl delivered this ✦",
spellLabel:   "🎵 Wingardium Leviosa",
scrollTitle:  "A Letter from Hogwarts",
```

`scrollTitle` can optionally be a per-house object:

```js
scrollTitle: {
  Gryffindor: "A Letter from the Gryffindor Common Room",
  Slytherin:  "A Letter from the Slytherin Dungeons",
  Ravenclaw:  "A Letter from Ravenclaw Tower",
  Hufflepuff: "A Letter from the Hufflepuff Burrow",
},
```

Use the per-house object form by default (richer experience).

---

## Output Format Rules

1. **Single JS file** — `const siteContent = { ... }; export default siteContent;` (or `module.exports` if the original used CommonJS — match the original).
2. **Comment every field** with a plain-English `//` comment explaining what to change and any constraints (e.g. filename must exist in `/videos/` folder).
3. **Section headers** using `// ════════ SECTION NAME ════════` style dividers.
4. **Do not omit any required field** — if a field is unclear, include it with a sensible default and comment explaining it.
5. **No external imports** — the file must be self-contained.

---

## Step-by-Step Generation Process

1. **Receive** the original `content.js` (user pastes it, uploads it, or it is already in context).
2. **Extract** all existing fields: note names, values, export style (ES module vs CommonJS).
3. **Identify** the time-theme pattern (morning/afternoon/sunset/night keys) to confirm it's the beach site.
4. **Build** the new config object following the schema above.
5. **Write messages** for all 4 houses, personalised with `friendName` / `senderName`.
6. **Add comments** — every field gets at least one comment line.
7. **Output** the complete file inside a code block, ready to copy-paste.
8. **After the code block**, add a short plain-English summary:
   - What changed
   - What the user needs to rename/add (e.g. "add 4 video files to your /videos/ folder")
   - How to switch houses (point to `defaultHouse` field)

---

## Comment Style Guide

Use this exact commenting style so non-coders can scan it easily:

```js
// ════════════════════════════════════════════
// 👤 BIRTHDAY PERSON DETAILS
// ════════════════════════════════════════════

friendName: "Hermione",
// ^ Change this to the birthday person's first name.
//   It will appear throughout the letter and messages.

birthdayDate: "19 September",
// ^ The date to show inside the letter (any format works, e.g. "September 19th").

// ════════════════════════════════════════════
// 🏰 HOGWARTS HOUSE THEMES
// ════════════════════════════════════════════

defaultHouse: "Gryffindor",
// ^ Which house theme loads when someone first opens the site.
//   Options: "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff"
//   The visitor can still switch houses using the crest buttons.

gryffindorVideo: "gryffindor.mp4",
// ^ The background video for Gryffindor theme.
//   Place the video file inside your /videos/ folder.
//   If the video can't load, the site uses gryffindorFallbackColor instead.

gryffindorFallbackColor: "#740001",
// ^ Deep Gryffindor red — used when the video fails to load or on slow connections.
//   You can change this to any hex colour code.
```

---

## Edge Cases

- **If the original file has no time-theme keys** — still produce the full HP config; note in the summary that no beach-theme keys were found to replace.
- **If `friendName` is missing from original** — use `"[Name]"` as placeholder with a prominent `// ⚠️ FILL IN` comment.
- **If the original uses CommonJS** (`module.exports = ...`) — match that style; do not switch to ESM.
- **If the original has extra custom fields** (e.g. `instagramHandle`, `photoList`) — preserve them unchanged in a `// ════ ORIGINAL CUSTOM FIELDS ════` section at the bottom.

---

## Quality Checklist (self-review before outputting)

- [ ] All 4 house video fields present
- [ ] All 4 house fallback color fields present  
- [ ] All 4 house birthday messages present and personalised
- [ ] `senderHouse` and `defaultHouse` present
- [ ] `openingCharm`, `spellLabel`, `scrollTitle` present
- [ ] `friendName`, `birthdayDate`, `senderName`, `musicFile` preserved from original
- [ ] Every field has at least one comment
- [ ] Section dividers used
- [ ] Export style matches original
- [ ] Post-code plain-English summary included
