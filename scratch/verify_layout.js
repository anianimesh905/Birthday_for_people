const fs = require('fs');
const path = require('path');
const http = require('http');

// Simple static file server
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
  
  // Clean query strings/hashes
  filePath = filePath.split('?')[0].split('#')[0];

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 8181;
server.listen(PORT, async () => {
  console.log(`Local test server running at http://localhost:${PORT}`);
  
  try {
    const { chromium } = require('playwright');
    console.log('Playwright found, launching chromium...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const viewports = [
      { width: 360, height: 740, name: 'mobile_360' },
      { width: 768, height: 1024, name: 'tablet_768' },
      { width: 1440, height: 900, name: 'desktop_1440' }
    ];

    // Create scratch directory if it doesn't exist
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    for (const vp of viewports) {
      console.log(`Capturing screenshot for viewport: ${vp.width}x${vp.height} (${vp.name})`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${PORT}`);
      
      // Wait for preloader to fade and main UI to initialize (approx 2s)
      await page.waitForTimeout(3000);
      
      const screenshotPath = path.join(screenshotDir, `${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Screenshot saved to ${screenshotPath}`);
    }

    await browser.close();
    console.log('Playwright run completed successfully.');
  } catch (err) {
    console.log('Playwright module not found or failed to load. Skipping screenshot automation.');
    console.log('You can run manual verification on index.html locally.');
    console.log('Details:', err.message);
  } finally {
    server.close(() => {
      console.log('Test server shut down.');
      process.exit(0);
    });
  }
});
