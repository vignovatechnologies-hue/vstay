const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'hostly-preview-assets');

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({ channel: 'chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080, deviceScaleFactor: 2 });

  const capturePage = async (roleEmail, urlPath, filename) => {
    console.log(`Capturing ${filename}...`);
    // 1. Login via mock URL
    await page.goto(`http://localhost:4173/login?inviteEmail=${roleEmail}`, { waitUntil: 'networkidle0' });
    
    // Wait a bit for the auto-login redirect
    await new Promise(r => setTimeout(r, 2000));
    
    // 2. Navigate to target url
    await page.goto(`http://localhost:4173${urlPath}`, { waitUntil: 'networkidle0' });
    
    // Wait for Recharts animations
    await new Promise(r => setTimeout(r, 2000));

    // Full page screenshot
    await page.screenshot({ path: path.join(OUTPUT_DIR, filename), fullPage: true });

    // 3. Clear session
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  };

  try {
    await capturePage('owner@hostly.app', '/owner/dashboard', 'owner-dashboard.png');
    await capturePage('super@hostly.app', '/super-admin/dashboard', 'super-admin-dashboard.png');
    await capturePage('tenant@hostly.app', '/tenant/dashboard', 'tenant-dashboard.png');
    await capturePage('manager@hostly.app', '/staff/dashboard', 'staff-dashboard.png');
    
    // For pricing, log in as owner first
    await page.goto(`http://localhost:4173/login?inviteEmail=owner@hostly.app`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.goto(`http://localhost:4173/pricing`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'pricing.png'), fullPage: true });
    console.log('Capturing pricing.png...');

    console.log('All screenshots captured successfully.');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    await browser.close();
  }
}

capture();
