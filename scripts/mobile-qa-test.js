// Mobile QA Test Script (Node.js)
// Run with: node scripts/mobile-qa-test.js

const puppeteer = require('puppeteer');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const LANGUAGES = ['cs', 'en', 'tr', 'uk', 'vi', 'ar'];
const PAGES = ['', '/request', '/track', '/courier/login', '/courier/register'];

// Mobile viewport presets
const VIEWPORTS = {
  'iPhone 14': { width: 390, height: 844, deviceScaleFactor: 3 },
  'Pixel 7': { width: 412, height: 915, deviceScaleFactor: 2.625 },
  'iPad': { width: 768, height: 1024, deviceScaleFactor: 2 }
};

async function testPage(browser, lang, pagePath, viewport) {
  const url = `${BASE_URL}/${lang}${pagePath}`;
  const page = await browser.newPage();
  
  await page.setViewport(viewport);
  
  try {
    console.log(`  Testing: ${url} (${viewport.width}x${viewport.height})`);
    
    // Navigate and wait for network idle
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Check for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`    ❌ Console error: ${msg.text()}`);
      }
    });
    
    // Check for layout issues
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (hasHorizontalScroll) {
      console.warn(`    ⚠️  Horizontal scroll detected`);
    }
    
    // Check for tiny text (< 12px)
    const hasTinyText = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let el of elements) {
        const fontSize = window.getComputedStyle(el).fontSize;
        if (parseFloat(fontSize) < 12 && el.textContent.trim()) {
          return true;
        }
      }
      return false;
    });
    
    if (hasTinyText) {
      console.warn(`    ⚠️  Text smaller than 12px detected`);
    }
    
    // Check touch targets
    const hasTinyTargets = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"]');
      for (let btn of buttons) {
        const rect = btn.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          return true;
        }
      }
      return false;
    });
    
    if (hasTinyTargets) {
      console.warn(`    ⚠️  Touch targets < 44px detected`);
    }
    
    // Take screenshot
    const screenshotPath = `./screenshots/${lang}${pagePath.replace(/\//g, '-') || '-home'}-${viewport.width}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    
    console.log(`    ✅ Passed (screenshot saved)`);
    
  } catch (error) {
    console.error(`    ❌ Failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testRTL(browser) {
  console.log('\n🌍 Testing RTL Layout (Arabic)...');
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS['iPhone 14']);
  
  try {
    await page.goto(`${BASE_URL}/ar`, { waitUntil: 'networkidle2' });
    
    // Check if html has dir="rtl"
    const isRTL = await page.evaluate(() => {
      return document.documentElement.getAttribute('dir') === 'rtl';
    });
    
    if (isRTL) {
      console.log('  ✅ RTL dir attribute is set');
    } else {
      console.error('  ❌ RTL dir attribute is missing');
    }
    
    // Check if layout actually mirrors
    const headerFlexDirection = await page.evaluate(() => {
      const header = document.querySelector('header nav');
      return header ? window.getComputedStyle(header).flexDirection : null;
    });
    
    console.log(`  ℹ️  Header flex direction: ${headerFlexDirection}`);
    
    // Take screenshot
    await page.screenshot({ path: './screenshots/rtl-test-ar.png', fullPage: true });
    console.log('  📸 Screenshot saved: screenshots/rtl-test-ar.png');
    
  } catch (error) {
    console.error(`  ❌ RTL test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testQuickFlags(browser) {
  console.log('\n🚩 Testing QuickFlags Component...');
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS['iPhone 14']);
  
  try {
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle2' });
    
    // Check if QuickFlags are present
    const quickFlagsExist = await page.evaluate(() => {
      const flags = document.querySelectorAll('[data-testid="quick-flag"], .quick-flags button');
      return flags.length > 0;
    });
    
    if (quickFlagsExist) {
      console.log('  ✅ QuickFlags component found');
      
      // Click a flag and check if it navigates
      await page.click('[data-testid="quick-flag-cs"], .quick-flags button:nth-child(1)');
      await page.waitForNavigation({ timeout: 5000 }).catch(() => {});
      
      const currentURL = page.url();
      if (currentURL.includes('/cs') || currentURL.includes('/uk') || currentURL.includes('/tr') || currentURL.includes('/vi')) {
        console.log(`  ✅ Flag navigation works (now at: ${currentURL})`);
      } else {
        console.warn(`  ⚠️  Flag navigation may not work (URL: ${currentURL})`);
      }
      
    } else {
      console.error('  ❌ QuickFlags component not found');
    }
    
  } catch (error) {
    console.error(`  ❌ QuickFlags test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function runTests() {
  console.log('🌍 Courier Connect - Mobile QA Test Suite');
  console.log('==========================================\n');
  
  // Check if dev server is running
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Server not responding');
    console.log('✅ Dev server is running\n');
  } catch (error) {
    console.error('❌ Dev server not running. Start with: npm run dev');
    process.exit(1);
  }
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Test each language at iPhone viewport only (quick test)
    console.log('📱 Testing Key Pages at Mobile Viewport...\n');
    
    for (const lang of LANGUAGES) {
      console.log(`🌐 Language: ${lang}`);
      
      // Test home and request pages only for speed
      for (const pagePath of ['', '/request']) {
        await testPage(browser, lang, pagePath, VIEWPORTS['iPhone 14']);
      }
      console.log('');
    }
    
    // Additional specialized tests
    await testRTL(browser);
    await testQuickFlags(browser);
    
    console.log('\n================================');
    console.log('📊 Mobile QA Test Complete');
    console.log('================================\n');
    console.log('📸 Screenshots saved to: ./screenshots/');
    console.log('📋 Review screenshots for visual issues\n');
    console.log('For full manual QA, see: docs/MOBILE_QA.md\n');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await browser.close();
  }
}

// Run tests
runTests().catch(console.error);
