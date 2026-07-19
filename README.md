# Hogwarts Birthday Letter — Developer Edition

Welcome to the **Hogwarts Birthday Letter** project—a highly optimized, cinematic, clock-aware, and living interactive scrapbook themed after the wizarding world of Harry Potter. 

This repository has been fully refactored from a monolithic codebase into a clean, modern, zero-dependency **ES6 modular architecture**. It features advanced Web Audio API synthesis, procedural HTML5 canvas particle engines, 3D CSS rendering layers, PWA capabilities, and fully adaptive soundscapes.

---

## ⚡ Quick Start

1. **Clone the repository** to your local machine.
2. **Launch a local server**. Because this project uses native ES6 modules, the browser requires standard CORS headers. You cannot run it by opening `index.html` directly via `file://`.
   ```bash
   # Run with Python (built-in)
   python -m http.server 8000
   
   # Or run with Node.js (via serve)
   npx serve .
   ```
3. **Open the browser** and navigate to `http://localhost:8000`.

---

## 📂 Documentation Directory

To make it easy to extend, inspect, and contribute to this project, the developer documentation is divided into specialized manuals:

- 🏗️ **[ARCHITECTURE.md](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/ARCHITECTURE.md)**: Details the folder structure, module allocations, initialization sequence, and execution loops.
- 🪄 **[FEATURES.md](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/FEATURES.md)**: Explains the story timeline, animation pipeline, Web Audio synthesizers, environment controls, and accessibility implementations.
- 🎨 **[ASSETS.md](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/ASSETS.md)**: Lists media locations, formats, sizes, and requirements for sound/video streams.
- 🤝 **[CONTRIBUTING.md](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/CONTRIBUTING.md)**: Code guidelines and developer tutorials for adding new scenes, custom soundtracks, and magical creatures.
- 📜 **[CHANGELOG.md](file:///c:/Users/anian/Downloads/IMP_2/New_birthday/CHANGELOG.md)**: Traces history of updates, refactor targets, and optimizations from initial layout drafts to production releases.

---

## ✏️ Customizing the Birthday Content

All recipient parameters are isolated inside the global **`content.js`** file at the root. A non-technical user can edit this file safely without editing any application code.

### Configuration Fields
```javascript
const BIRTHDAY_CONTENT = {
  // SALUTATION DETAILS
  friendName: "Ayushi Mishra",
  friendAddressLine: "The Bedroom",
  birthdayDate: "2 June",
  senderName: "Ani",
  tagline: "An owl arrived at midnight — this letter is for you…",

  // THEME PARAMETERS
  defaultHouse: "Slytherin", // "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff"
  senderHouse: "Slytherin",

  // MEDIA ASSET STREAM PATHS
  gryffindorVideo: "videos/gryffindor.mp4",
  slytherinVideo: "videos/slytherin.mp4",
  ravenclawVideo: "videos/ravenclaw.mp4",
  hufflepuffVideo: "videos/hufflepuff.mp4",
  musicFile: "birthday.mp3",
  musicLabel: "Wingardium Leviosa", // Song button label

  // SCENE MESSAGES
  slytherinMessage: `Dear Ayushi...`,
  gryffindorMessage: `Dear Ayushi...`,
  ravenclawMessage: `Dear Ayushi...`,
  hufflepuffMessage: `Dear Ayushi...`,
  eyesOnlyMessage: `Confidential message...`
};
```

---

## 🚀 Deployment

The project is structured to deploy static files instantly to any provider (Vercel, Netlify, GitHub Pages) without a build step.

### Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy in production mode
vercel --prod
```
When using Vercel, paths inside `vercel.json` are pre-configured to handle cache control headers for media streams.
