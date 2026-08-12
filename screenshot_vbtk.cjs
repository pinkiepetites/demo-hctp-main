const { chromium } = require('playwright');
const path = require('path');

const OUT = 'C:/Users/PHC/AppData/Local/Temp/claude/e--New-Mockup-demo-hctp-main/4d401386-6a5b-4807-98a8-6c8140155a49/scratchpad';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1600 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(String(err)));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Trang chủ', { timeout: 15000 });
  await page.locator('span:text-is("Trang chủ")').first().click();
  await page.waitForTimeout(300);
  await page.waitForSelector('text=Văn bản trình ký', { timeout: 15000 });

  await page.screenshot({ path: path.join(OUT, 'canbo_full.png'), fullPage: true });
  const panel = page.locator('text=Văn bản trình ký').locator('xpath=ancestor::div[contains(@class,"rounded-[8px]")][1]');
  await panel.screenshot({ path: path.join(OUT, 'canbo_vbtk_panel.png') });

  // Switch to Trưởng phòng
  await page.locator('div.cursor-pointer:has(> div.leading-tight)').first().click();
  await page.waitForTimeout(300);
  await page.locator('text=Chuyển vai trò >> visible=true').first().click();
  await page.waitForTimeout(300);
  await page.locator('text=Trưởng phòng >> visible=true').first().click();
  await page.waitForTimeout(800);
  await page.waitForSelector('text=Hình thức tiếp nhận đơn', { timeout: 15000 });
  await page.screenshot({ path: path.join(OUT, 'truongphong_full.png'), fullPage: true });

  console.log('CONSOLE ERRORS:', JSON.stringify(errors));
  await browser.close();
})();
