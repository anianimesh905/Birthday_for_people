const { test, expect } = require('@playwright/test');

test.describe('Hogwarts Birthday Scrapbook - Accessibility Zoom & Responsiveness Verification', () => {

  test.beforeEach(async ({}, testInfo) => {
    testInfo.setTimeout(60000);
  });

  const targetDevices = [
    { name: 'Older Phone (360x640)', width: 360, height: 640 },
    { name: 'Samsung S21 (393x851)', width: 393, height: 851 },
    { name: 'Google Pixel (412x915)', width: 412, height: 915 },
    { name: 'Large Phone (430x932)', width: 430, height: 932 },
    { name: 'Tablet (800x1280)', width: 800, height: 1280 }
  ];

  test('Verify viewport zoom options enabled', async ({ page }) => {
    await page.goto('http://localhost:8000', { waitUntil: 'load' });
    const metaViewport = await page.getAttribute('meta[name="viewport"]', 'content');
    console.log('Viewport content:', metaViewport);
    
    // Accessibility check: must not block user scale
    expect(metaViewport).not.toContain('user-scalable=no');
    expect(metaViewport).not.toContain('maximum-scale');
    expect(metaViewport).toContain('width=device-width');
    expect(metaViewport).toContain('initial-scale=1.0');
  });

  for (const device of targetDevices) {
    test(`Responsiveness verification - ${device.name}`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('http://localhost:8000', { waitUntil: 'load' });

      // Wait for loading screen to hide
      await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 30000 });

      // Verify envelope wrapper and main layout fit horizontally
      const containerWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(containerWidth).toBeLessThanOrEqual(device.width + 5);

      // Skip intro cinematic
      const skipBtn = page.locator('#skip-cinematic-btn');
      if (await skipBtn.isVisible()) {
        await skipBtn.click({ force: true });
      }
      await page.waitForTimeout(2000);

      // Verify envelope is centered and visible
      const envArea = page.locator('#envelope-area');
      await expect(envArea).toBeVisible();

      // Open the letter
      await page.evaluate(() => {
        const el = document.getElementById('envelope-wrapper');
        if (el) el.click();
      });
      
      // Wait for castle awakening sequence to finish
      await page.waitForTimeout(13500);

      // Verify close button styled target sizes
      const closeLayout = await page.evaluate(() => {
        const el = document.getElementById('scroll-close');
        return el ? { width: el.offsetWidth, height: el.offsetHeight } : { width: 0, height: 0 };
      });
      console.log(`[${device.name}] Close button styled size: ${closeLayout.width}x${closeLayout.height}`);
      expect(closeLayout.width).toBeGreaterThanOrEqual(47);
      expect(closeLayout.height).toBeGreaterThanOrEqual(47);

      // Verify bottom dock buttons
      const dockButtonsCount = await page.locator('.bottom-control-dock button').count();
      for (let idx = 0; idx < dockButtonsCount; idx++) {
        const buttonLayout = await page.evaluate((index) => {
          const btns = document.querySelectorAll('.bottom-control-dock button');
          const btn = btns[index];
          return btn ? { width: btn.offsetWidth, height: btn.offsetHeight } : { width: 0, height: 0 };
        }, idx);
        console.log(`[${device.name}] Bottom Button ${idx} styled size: ${buttonLayout.width}x${buttonLayout.height}`);
        expect(buttonLayout.width).toBeGreaterThanOrEqual(47);
        expect(buttonLayout.height).toBeGreaterThanOrEqual(47);
      }
    });
  }

});
