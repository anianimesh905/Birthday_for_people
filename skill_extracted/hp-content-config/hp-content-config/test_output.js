// ════════════════════════════════════════════════════════════════
// ⚡  HARRY POTTER BIRTHDAY SITE — CONTENT CONFIGURATION
// ════════════════════════════════════════════════════════════════
//
//  Welcome! This file controls everything you see and read on the site.
//  You don't need to know any coding — just find the field you want to
//  change, edit the text between the quotes, save the file, and refresh.
//
//  IMPORTANT: Always keep the commas at the end of each line!
//  IMPORTANT: Don't delete the quotes around the values.
//
// ════════════════════════════════════════════════════════════════

const siteContent = {

  // ════════════════════════════════════════════════════════════════
  // 👤  BIRTHDAY PERSON & SENDER DETAILS
  // ════════════════════════════════════════════════════════════════

  friendName: "Luna",
  // ^ The birthday person's first name. Appears in the letter heading,
  //   messages, and page title. Change to whoever's birthday it is!

  birthdayDate: "13 February",
  // ^ The date shown inside the letter. Any format works —
  //   "February 13th", "13/02", "the 13th of February" — your choice.

  senderName: "Priya",
  // ^ Your name (the person sending the card). Appears at the bottom
  //   of the birthday letter as the sign-off.

  // ════════════════════════════════════════════════════════════════
  // 🎵  MUSIC
  // ════════════════════════════════════════════════════════════════

  musicFile: "ocean_waves.mp3",
  // ^ The background music filename. Place the file in your /music/ folder.
  //   Swap this for "hedwigs_theme.mp3" or any other .mp3 you like.
  //   The visitor controls playback with the spell button below.

  // ════════════════════════════════════════════════════════════════
  // 🏰  HOGWARTS HOUSE THEMES — WHICH HOUSE LOADS FIRST?
  // ════════════════════════════════════════════════════════════════

  defaultHouse: "Gryffindor",
  // ^ Which house theme loads when someone first opens the site.
  //   The visitor can still switch houses using the crest buttons on screen.
  //   Options (copy exactly, capital first letter):
  //     "Gryffindor"  |  "Slytherin"  |  "Ravenclaw"  |  "Hufflepuff"

  senderHouse: "Gryffindor",
  // ^ Which house YOU (the sender) belong to.
  //   This is used for the sign-off flourish at the bottom of the letter.
  //   Same options as defaultHouse above.

  // ════════════════════════════════════════════════════════════════
  // 🦁  GRYFFINDOR THEME
  //      Colours: Scarlet & Gold  |  Tone: Brave, warm, lion-hearted
  // ════════════════════════════════════════════════════════════════

  gryffindorVideo: "gryffindor.mp4",
  // ^ Background video for Gryffindor theme. Place the file in /videos/.
  //   If it can't load (slow connection, missing file), the site uses
  //   gryffindorFallbackColor instead — no blank screen!

  gryffindorFallbackColor: "#740001",
  // ^ Deep Gryffindor crimson — shown when video is unavailable.
  //   You can change this to any 6-digit hex colour code (e.g. "#AE0001").

  gryffindorMessage: `Dear Luna,

To the most daring soul I know — the one who charges headfirst into adventure with a laugh and a lion's heart — happy birthday! You remind everyone around you that courage isn't the absence of fear; it's choosing to show up anyway, wand in hand and eyes bright. The world is a braver, warmer place with you in it.

Wishing you a birthday filled with golden light, laughter loud enough to echo down the corridors of Hogwarts, and every joy you deserve.

With pride and a heart full of Gryffindor fire,
Priya ✨`,
  // ^ The birthday letter shown when Gryffindor theme is active.
  //   You can rewrite this entirely! Just keep the text inside the
  //   backtick characters (` `). Line breaks are preserved.

  // ════════════════════════════════════════════════════════════════
  // 🐍  SLYTHERIN THEME
  //      Colours: Emerald & Silver  |  Tone: Sophisticated, elegant, ambitious
  // ════════════════════════════════════════════════════════════════

  slytherinVideo: "slytherin.mp4",
  // ^ Background video for Slytherin theme. Place the file in /videos/.

  slytherinFallbackColor: "#1A472A",
  // ^ Deep Slytherin forest green — shown when video is unavailable.

  slytherinMessage: `Dear Luna,

To one whose brilliance is unmatched and whose ambitions are as boundless as the dungeons of Slytherin are deep — happy birthday. You have always known what you want and moved toward it with a quiet, elegant determination that most people can only admire from a distance. That is a rare and precious gift.

May this birthday mark the beginning of your finest chapter yet — crafted, as always, entirely on your own terms.

With admiration and a silver serpent's smile,
Priya 🐍`,
  // ^ The birthday letter shown when Slytherin theme is active.

  // ════════════════════════════════════════════════════════════════
  // 🦅  RAVENCLAW THEME
  //      Colours: Blue & Bronze  |  Tone: Wise, poetic, intellectual
  // ════════════════════════════════════════════════════════════════

  ravenclawVideo: "ravenclaw.mp4",
  // ^ Background video for Ravenclaw theme. Place the file in /videos/.

  ravenclawFallbackColor: "#0E1A40",
  // ^ Deep Ravenclaw midnight blue — shown when video is unavailable.

  ravenclawMessage: `Dear Luna,

To a mind as vast as the night sky over the Astronomy Tower — happy birthday. You have always seen what others overlook, found questions worth asking in the spaces between ordinary things, and chased understanding with a kind of quiet, relentless wonder. The world is richer for every idea you have ever dared to explore.

May the year ahead bring you beautiful problems, unexpected discoveries, and all the books you've been meaning to read.

With warmth and the deepest respect,
Priya 📚`,
  // ^ The birthday letter shown when Ravenclaw theme is active.

  // ════════════════════════════════════════════════════════════════
  // 🦡  HUFFLEPUFF THEME
  //      Colours: Yellow & Black  |  Tone: Loyal, heartfelt, warm
  // ════════════════════════════════════════════════════════════════

  hufflepuffVideo: "hufflepuff.mp4",
  // ^ Background video for Hufflepuff theme. Place the file in /videos/.

  hufflepuffFallbackColor: "#ECB939",
  // ^ Warm Hufflepuff gold — shown when video is unavailable.

  hufflepuffMessage: `Dear Luna,

To the truest friend in all of Hogwarts — the one who shows up without being asked, who remembers the small things that matter most, and whose kindness makes every room feel like home — happy birthday. There is no loyalty more steadfast than yours, and no heart more genuinely good.

Here's to you: the sunshine in the Hufflepuff common room and in every life you touch.

With so much love it barely fits in this envelope,
Priya 🌻`,
  // ^ The birthday letter shown when Hufflepuff theme is active.

  // ════════════════════════════════════════════════════════════════
  // ✨  MAGICAL UI TEXT
  //      These are the small labels and hints the visitor sees on screen.
  // ════════════════════════════════════════════════════════════════

  openingCharm: "Tap to unseal — an owl delivered this ✦",
  // ^ The hint text shown on the sealed envelope before the visitor taps it.
  //   Keep it short and magical! You can use any emoji.

  spellLabel: "🎵 Wingardium Leviosa",
  // ^ The label on the music play/pause button.
  //   Change the spell name to whatever you like — "Sonorus", "Alohomora", etc.

  scrollTitle: {
    Gryffindor: "A Letter from the Gryffindor Common Room",
    Slytherin:  "A Letter from the Slytherin Dungeons",
    Ravenclaw:  "A Letter from Ravenclaw Tower",
    Hufflepuff: "A Letter from the Hufflepuff Burrow",
  },
  // ^ The heading shown at the top of the birthday letter scroll.
  //   Each house has its own title — change any or all of them.
  //   Keep the { curly braces } and the commas after each line.

};

export default siteContent;

// ════════════════════════════════════════════════════════════════
// 📋  QUICK-EDIT CHECKLIST (things to personalise before sharing)
// ════════════════════════════════════════════════════════════════
//
//  ☐  friendName     — the birthday person's name
//  ☐  birthdayDate   — the date (any format)
//  ☐  senderName     — your name
//  ☐  musicFile      — swap in a Hedwig's Theme or HP soundtrack file
//  ☐  defaultHouse   — which house loads first (Luna's house? yours?)
//  ☐  senderHouse    — your Hogwarts house
//  ☐  Messages       — personalise at least the defaultHouse message
//  ☐  Videos folder  — add gryffindor.mp4 / slytherin.mp4 / ravenclaw.mp4 / hufflepuff.mp4
//
// ════════════════════════════════════════════════════════════════
