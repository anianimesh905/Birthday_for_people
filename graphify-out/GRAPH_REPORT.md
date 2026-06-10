# Graph Report - .  (2026-06-07)

## Corpus Check
- Corpus is ~12,665 words - fits in a single context window. You may not need a graph.

## Summary
- 77 nodes · 108 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Bootstrap & Core Systems|App Bootstrap & Core Systems]]
- [[_COMMUNITY_State Helpers & Visual Ambience|State Helpers & Visual Ambience]]
- [[_COMMUNITY_Interactive Spellcast Engine & Audio|Interactive Spellcast Engine & Audio]]
- [[_COMMUNITY_Core Architectural Map & Synthesis|Core Architectural Map & Synthesis]]
- [[_COMMUNITY_Subsystem Initializers|Subsystem Initializers]]
- [[_COMMUNITY_Hogwarts House Selection System|Hogwarts House Selection System]]
- [[_COMMUNITY_Birthday Content Configuration|Birthday Content Configuration]]
- [[_COMMUNITY_Background Video Controller|Background Video Controller]]
- [[_COMMUNITY_Letter Rendering & Presentation|Letter Rendering & Presentation]]

## God Nodes (most connected - your core abstractions)
1. `initializeMainApp` - 11 edges
2. `initializeMainApp()` - 10 edges
3. `castSpellText()` - 8 edges
4. `toggleLumosSpell()` - 5 edges
5. `BIRTHDAY_CONTENT` - 5 edges
6. `initEnvelope` - 5 edges
7. `getAudioCtx()` - 4 edges
8. `selectHouse()` - 4 edges
9. `startPreloader` - 4 edges
10. `castSpellText` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Interactive 3D Scroll Modal` --rationale_for--> `initEnvelope`  [EXTRACTED]
  CODEBASE_GUIDE.md → script.js
- `Parallel Preloader & Blob URL Caching Subsystem` --rationale_for--> `startPreloader`  [EXTRACTED]
  CODEBASE_GUIDE.md → script.js
- `Time-Aware Cross-fading Themes` --rationale_for--> `loadHouseVideo`  [EXTRACTED]
  CODEBASE_GUIDE.md → script.js
- `Sparkle Particle Trail` --rationale_for--> `initMagicParticles`  [EXTRACTED]
  CODEBASE_GUIDE.md → script.js
- `Web Audio Procedural Synthesizers` --rationale_for--> `playCrackSound`  [EXTRACTED]
  CODEBASE_GUIDE.md → script.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Procedural Web Audio System** — new_birthday_script_playcracksound, new_birthday_script_playscrollsound, new_birthday_script_startambientwaves [EXTRACTED 1.00]
- **Application Bootstrap Flow** — new_birthday_script_startpreloader, new_birthday_script_initializemainapp, new_birthday_script_initmagicparticles, new_birthday_script_initenvelope, new_birthday_script_initparallax [EXTRACTED 1.00]
- **Magical Spells Engine** — new_birthday_script_castspelltext, new_birthday_script_togglelumosspell, new_birthday_script_triggerpatronusflight, new_birthday_script_triggerreveliosweep, new_birthday_script_inittreasurebox [EXTRACTED 1.00]

## Communities (11 total, 3 thin omitted)

### Community 0 - "App Bootstrap & Core Systems"
Cohesion: 0.15
Nodes (16): Time-Aware Cross-fading Themes, Parallax & Device Orientation Math, Parallel Preloader & Blob URL Caching Subsystem, Sparkle Particle Trail, BIRTHDAY_CONTENT, initHouseSelector, initializeMainApp, initMagicParticles (+8 more)

### Community 1 - "State Helpers & Visual Ambience"
Cohesion: 0.12
Nodes (3): DEFAULT_SIZES, HOUSES, PRELOADED_ASSETS

### Community 2 - "Interactive Spellcast Engine & Audio"
Cohesion: 0.18
Nodes (13): activateTouchBlocker(), cacheSpellTargets(), castSpellText(), getAudioCtx(), handleLumosMove(), playCrackSound(), playScrollSound(), playSpellSound() (+5 more)

### Community 3 - "Core Architectural Map & Synthesis"
Cohesion: 0.25
Nodes (11): Interactive 3D Scroll Modal, Web Audio Procedural Synthesizers, castSpellText, initEnvelope, playCrackSound, playScrollSound, revealHogwartsLetter, startAmbientWaves (+3 more)

### Community 4 - "Subsystem Initializers"
Cohesion: 0.25
Nodes (8): initEnvelope(), initializeMainApp(), initMagicParticles(), initParallax(), initScrollReveal(), initSwipeDismiss(), initTreasureBox(), setupMusic()

### Community 5 - "Hogwarts House Selection System"
Cohesion: 0.50
Nodes (4): initHouseSelector(), selectHouse(), showHouseToast(), updateSealForHouse()

## Knowledge Gaps
- **11 isolated node(s):** `BIRTHDAY_CONTENT`, `PRELOADED_ASSETS`, `DEFAULT_SIZES`, `HOUSES`, `setupMusic` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `initializeMainApp` connect `App Bootstrap & Core Systems` to `Core Architectural Map & Synthesis`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `initEnvelope` connect `Core Architectural Map & Synthesis` to `App Bootstrap & Core Systems`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `BIRTHDAY_CONTENT`, `PRELOADED_ASSETS`, `DEFAULT_SIZES` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Bootstrap & Core Systems` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Should `State Helpers & Visual Ambience` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._