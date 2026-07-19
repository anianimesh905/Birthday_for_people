# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\accessibility_zoom.spec.js >> Hogwarts Birthday Scrapbook - Accessibility Zoom & Responsiveness Verification >> Responsiveness verification - Tablet (800x1280)
- Location: tests\accessibility_zoom.spec.js:30:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic:
    - generic:
      - img
    - generic:
      - generic:
        - img
    - generic:
      - generic:
        - img
    - generic:
      - generic:
        - img
    - generic:
      - img
  - main [ref=e3]:
    - generic [ref=e4]:
      - paragraph [ref=e5]: ⚡ Happy Birthday ⚡
      - heading "Ayushi Mishra" [level=1] [ref=e6]
      - paragraph [ref=e7]: 2 June
    - paragraph [ref=e8]: An owl arrived at midnight — this letter is for you…
    - generic [ref=e10]:
      - button "Open birthday letter" [ref=e11] [cursor=pointer]:
        - generic:
          - img
        - generic:
          - img
        - generic:
          - img
        - generic:
          - img
        - generic [ref=e12]:
          - generic [ref=e20]: ⚡
          - generic: ⚡
          - generic "Addressed to Ayushi Mishra":
            - generic: "To:"
            - generic: Ayushi Mishra
            - generic: The Bedroom
          - generic [ref=e28]: G
      - paragraph [ref=e29]: Tap to unseal — an owl delivered this just for you ✦
  - dialog "Birthday letter from Hogwarts" [ref=e30]:
    - generic [ref=e32]:
      - button "Close letter" [ref=e36] [cursor=pointer]: ✕
      - generic [ref=e37]:
        - banner "Hogwarts letterhead" [ref=e38]:
          - paragraph [ref=e39]: Hogwarts School of Witchcraft and Wizardry
          - paragraph [ref=e40]:
            - emphasis [ref=e41]: "Headmistress: Prof. Minerva McGonagall"
          - generic [ref=e42]: · · · ⚡ · · ·
          - paragraph [ref=e43]:
            - emphasis [ref=e44]: Draco Dormiens Nunquam Titillandus
        - generic [ref=e45]:
          - text: Dear
          - text: ","
      - text: Draco Dormiens Nunquam Titillandus
  - toolbar "Hogwarts Control Dock" [ref=e47]:
    - button "Re-sort Hogwarts House" [ref=e48] [cursor=pointer]:
      - generic [ref=e49]: 🧙‍♂️
      - generic [ref=e50]: Sorting Hat
    - button "Cast Spell" [ref=e51] [cursor=pointer]:
      - generic [ref=e52]: 🪄
      - generic [ref=e53]: Cast Spell
    - button "Toggle background music" [ref=e54] [cursor=pointer]:
      - generic [ref=e55]: 🎵
      - generic [ref=e56]: Play Song
  - dialog "Choose Your House" [ref=e62]:
    - generic [ref=e63]:
      - heading "Choose Your House" [level=2] [ref=e64]
      - radiogroup "Choose Hogwarts House" [ref=e65]:
        - radio "Select Gryffindor" [ref=e66] [cursor=pointer]:
          - generic:
            - img "Gryffindor Crest"
            - generic: Gryffindor
        - radio "Select Slytherin" [ref=e67] [cursor=pointer]:
          - generic:
            - img "Slytherin Crest"
            - generic: Slytherin
        - radio "Select Ravenclaw" [ref=e68] [cursor=pointer]:
          - generic:
            - img "Ravenclaw Crest"
            - generic: Ravenclaw
        - radio "Select Hufflepuff" [ref=e69] [cursor=pointer]:
          - generic:
            - img "Hufflepuff Crest"
            - generic: Hufflepuff
  - generic:
    - generic:
      - button "Close treasure chest": ✕
      - generic:
        - generic:
          - banner: For Your Eyes Only
          - generic: ✦ ❤️ ✦
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Hogwarts Birthday Scrapbook - Accessibility Zoom & Responsiveness Verification', () => {
  4  | 
  5  |   test.beforeEach(async ({}, testInfo) => {
  6  |     testInfo.setTimeout(60000);
  7  |   });
  8  | 
  9  |   const targetDevices = [
  10 |     { name: 'Older Phone (360x640)', width: 360, height: 640 },
  11 |     { name: 'Samsung S21 (393x851)', width: 393, height: 851 },
  12 |     { name: 'Google Pixel (412x915)', width: 412, height: 915 },
  13 |     { name: 'Large Phone (430x932)', width: 430, height: 932 },
  14 |     { name: 'Tablet (800x1280)', width: 800, height: 1280 }
  15 |   ];
  16 | 
  17 |   test('Verify viewport zoom options enabled', async ({ page }) => {
  18 |     await page.goto('http://localhost:8000', { waitUntil: 'load' });
  19 |     const metaViewport = await page.getAttribute('meta[name="viewport"]', 'content');
  20 |     console.log('Viewport content:', metaViewport);
  21 |     
  22 |     // Accessibility check: must not block user scale
  23 |     expect(metaViewport).not.toContain('user-scalable=no');
  24 |     expect(metaViewport).not.toContain('maximum-scale');
  25 |     expect(metaViewport).toContain('width=device-width');
  26 |     expect(metaViewport).toContain('initial-scale=1.0');
  27 |   });
  28 | 
  29 |   for (const device of targetDevices) {
  30 |     test(`Responsiveness verification - ${device.name}`, async ({ page }) => {
  31 |       await page.setViewportSize({ width: device.width, height: device.height });
> 32 |       await page.goto('http://localhost:8000', { waitUntil: 'load' });
     |                  ^ Error: page.goto: Test timeout of 60000ms exceeded.
  33 | 
  34 |       // Wait for loading screen to hide
  35 |       await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 30000 });
  36 | 
  37 |       // Verify envelope wrapper and main layout fit horizontally
  38 |       const containerWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  39 |       expect(containerWidth).toBeLessThanOrEqual(device.width + 5);
  40 | 
  41 |       // Skip intro cinematic
  42 |       const skipBtn = page.locator('#skip-cinematic-btn');
  43 |       if (await skipBtn.isVisible()) {
  44 |         await skipBtn.click({ force: true });
  45 |       }
  46 |       await page.waitForTimeout(2000);
  47 | 
  48 |       // Verify envelope is centered and visible
  49 |       const envArea = page.locator('#envelope-area');
  50 |       await expect(envArea).toBeVisible();
  51 | 
  52 |       // Open the letter
  53 |       await page.evaluate(() => {
  54 |         const el = document.getElementById('envelope-wrapper');
  55 |         if (el) el.click();
  56 |       });
  57 |       
  58 |       // Wait for castle awakening sequence to finish
  59 |       await page.waitForTimeout(13500);
  60 | 
  61 |       // Verify close button styled target sizes
  62 |       const closeLayout = await page.evaluate(() => {
  63 |         const el = document.getElementById('scroll-close');
  64 |         return el ? { width: el.offsetWidth, height: el.offsetHeight } : { width: 0, height: 0 };
  65 |       });
  66 |       console.log(`[${device.name}] Close button styled size: ${closeLayout.width}x${closeLayout.height}`);
  67 |       expect(closeLayout.width).toBeGreaterThanOrEqual(47);
  68 |       expect(closeLayout.height).toBeGreaterThanOrEqual(47);
  69 | 
  70 |       // Verify bottom dock buttons
  71 |       const dockButtonsCount = await page.locator('.bottom-control-dock button').count();
  72 |       for (let idx = 0; idx < dockButtonsCount; idx++) {
  73 |         const buttonLayout = await page.evaluate((index) => {
  74 |           const btns = document.querySelectorAll('.bottom-control-dock button');
  75 |           const btn = btns[index];
  76 |           return btn ? { width: btn.offsetWidth, height: btn.offsetHeight } : { width: 0, height: 0 };
  77 |         }, idx);
  78 |         console.log(`[${device.name}] Bottom Button ${idx} styled size: ${buttonLayout.width}x${buttonLayout.height}`);
  79 |         expect(buttonLayout.width).toBeGreaterThanOrEqual(47);
  80 |         expect(buttonLayout.height).toBeGreaterThanOrEqual(47);
  81 |       }
  82 |     });
  83 |   }
  84 | 
  85 | });
  86 | 
```