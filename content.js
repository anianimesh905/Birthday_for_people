/**
 * ⚡ HOGWARTS BIRTHDAY WEBSITE CONFIGURATION ⚡
 * ─────────────────────────────────────────────────────────────────
 * Hi! You do not need to know any coding to edit this file.
 * Just change the text between the quotation marks " " or backticks ` `
 * Save the file, then open index.html in your browser to see changes.
 * DO NOT delete any commas, curly braces { }, or semicolons ;
 * ─────────────────────────────────────────────────────────────────
 */

// ════════════════════════════════════════════
// 👤 BIRTHDAY PERSON & SENDER DETAILS
// ════════════════════════════════════════════

const BIRTHDAY_CONTENT = {
  friendName: "Ayushi Mishra",
  // ^ The birthday person's name — shown in letter salutation and page header.

  friendAddressLine: "The Bedroom",
  // ^ The second line of the address written on the envelope (e.g. "The Bedroom" or "The Library").

  birthdayDate: "2 June",
  // ^ The date shown inside the Hogwarts letter (any format works,
  //   e.g. "2 June" or "June 2nd").

  tagline: "An owl arrived at midnight — this letter is for you…",
  // ^ A short line shown above the envelope. Keep it poetic (1–2 lines).

  senderName: "Ani",
  // ^ Your name — shown at the bottom of the letter as the signature.

  // ════════════════════════════════════════════
  // 🏰 HOGWARTS HOUSE THEMES
  // ════════════════════════════════════════════

  defaultHouse: "Slytherin",
  // ^ Which house theme loads when someone first opens the site.
  //   Options: "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff"
  //   The visitor can still switch houses using the crest buttons in the top-right corner.

  senderHouse: "Slytherin",
  // ^ Which house the sender (you) belongs to.
  //   Used for the default wax seal letter and sign-off signature style.

  // ════════════════════════════════════════════
  // 🎬 HOUSE VIDEO BACKGROUNDS
  // ════════════════════════════════════════════
  // Place all video files inside a /videos/ subfolder in the same folder as index.html.
  // If a video can't load, the site automatically uses the fallback colour instead.

  gryffindorVideo: "videos/gryffindor.mp4",
  // ^ Background video for Gryffindor theme (warm, fiery, golden candlelight).

  slytherinVideo: "videos/slytherin.mp4",
  // ^ Background video for Slytherin theme (dark, cool, mysterious underwater/mist).

  ravenclawVideo: "videos/ravenclaw.mp4",
  // ^ Background video for Ravenclaw theme (celestial, deep space, starry night).

  hufflepuffVideo: "videos/hufflepuff.mp4",
  // ^ Background video for Hufflepuff theme (warm, earthy, autumnal nature).

  // ════════════════════════════════════════════
  // 🎨 HOUSE FALLBACK COLOURS
  // ════════════════════════════════════════════
  // Shown while the video loads or if the video file is missing.
  // These are the official canonical house colours.

  gryffindorFallbackColor: "#740001",
  // ^ Deep Gryffindor scarlet.

  slytherinFallbackColor: "#1A472A",
  // ^ Deep Slytherin forest green.

  ravenclawFallbackColor: "#0E1A40",
  // ^ Ravenclaw midnight navy.

  hufflepuffFallbackColor: "#ECB939",
  // ^ Hufflepuff golden yellow.

  // ════════════════════════════════════════════
  // 💌 HOUSE BIRTHDAY MESSAGES
  // ════════════════════════════════════════════
  // Each message is shown when that house is selected. Written as a magical letter.
  // We use backticks ` ` here to allow multi-line formatting easily.

  slytherinMessage: `Dear Ayushi Mishra ( Alt. Narcissa Malfoy, but significantly less judgmental ),

To the most cunning, ambitious and greatest pride of women in the world. I present you with the happiest birthday. Your brilliance is unmatched with the pride of conquering the dungeons of Slytherin. You have always known what you want and moved toward it with a quiet, elegant determination that most people can only admire from a distance. That is my rare and precious gift to you.

May this birthday be the best of your life — crafted, as always, entirely on your own terms. And you can have the green foggy forest too huihuihuihui.

With evil and Voldemort's serpent smile ( MuHeHeHeHeHeHe ),
Ani 🐍`,

  gryffindorMessage: `Dear Ayushi Mishra (Alt. Hermione Granger with black hair),

To the most daring soul I know — the one who charges first into the world of adventure with a big laugh and a beautiful heart — happy birthday! You are the reminder to everyone around you that everything is possible, your determination has always pushed me, I will forever be grateful to you; The world is a braver, warmer place with you in it.

Wishing you the best gryffindor style birthday filled with golden light, and a warm fireplace just for you to relax from your journey.

With pride and a heart full of Gryffindor fire,
Ani ✨`,

  ravenclawMessage: `Dear Ayushi Mishra ( Alt. Cho Chang with a library card addiction ),

To a mind and beauty as vast as the night sky over the Astronomy Tower — happy birthday. You have always been a keen-sighted person and seen what others overlook, found questions no one asked, and chased dreams quietly and wonderfully.

May the year ahead bring you beautiful solutions to your problems, unexpected discoveries, and all the books you've been meaning to read.

With warmth and the deepest respect from the stars behind this,
Ani 📚`,

  hufflepuffMessage: `Dear Ayushi Mishra ( Alt. Nymphadora Tonks ),

To the truest friend in all of Hogwarts — the one who shows up without being asked, the one who remembers every small thing that matters most, and the one whose kindness makes every room feel like home — happiest birthday to the one and all A.Y.U.S.H.I M.I.S.H.R.A.

There is no one like you in this whole world, you are one and only.

With so much kindness, it barely fits in this envelope,
Ani 🌻`,

  // ════════════════════════════════════════════
  // ✨ MAGICAL UI TEXT
  // ════════════════════════════════════════════

  openingCharm: "Tap to unseal — an owl delivered this just for you ✦",
  // ^ The hint text shown beneath the envelope.

  spellLabel: "🎵 Wingardium Leviosa",
  // ^ The label on the music button.

  scrollTitle: {
    Gryffindor: "A Letter from the Gryffindor Common Room",
    Slytherin: "A Letter from the Slytherin Dungeons",
    Ravenclaw: "A Letter from Ravenclaw Tower",
    Hufflepuff: "A Letter from the Hufflepuff Burrow",
  },
  // ^ The title shown at the top of the letter scroll, one per house.

  // ════════════════════════════════════════════
  // 🎵 MUSIC
  // ════════════════════════════════════════════

  musicFile: "public/assets/audio/birthday.mp3",
  // ^ The background music file. Place it in the same folder as index.html.
  //   Supports .mp3 and .ogg formats. Set to "" to hide the music button.

  musicLabel: "🎵 Wingardium Leviosa",

  accioImage: "public/assets/images/accio_card.png",
  // ^ The image that flies in from far away when you cast "Accio".
  //   Replace "accio_card.png" with any image filename in the same folder as index.html.
  // ^ Label on the music button (before music starts playing).

  eyesOnlyMessage: `Dear Ayushi,

This is a secret message just for you, hidden behind the Hogwarts letter. 

Well the birthday is already over and I don't know what to say. So if there is anything you want to say to me, you can say it.

Anyway, if you want the whole code of this, just say it, I have it all here 😊`,
};
