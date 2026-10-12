import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser = await chromium.launch({ headless: true, executablePath: process.env.LOCALAPPDATA + '/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
const page = await browser.newPage();
const base = 'http://127.0.0.1:5173';
const errors = [];
page.on('pageerror', error => errors.push(error.message));
fs.mkdirSync('artifacts', { recursive: true });
try {
  await page.goto(base + '/shop');
  await page.getByRole('button', { name: 'Compare Apple iPhone 15 Pro Max', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Compare Apple iPhone 15 Pro Max', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Compare Samsung Galaxy S24 Ultra', exact: true }).click();
  await page.getByRole('button', { name: 'Compare Tecno Camon 30 Pro 5G', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Compare Infinix Note 40 Pro 4G', exact: true })).toBeDisabled();
  await page.getByRole('link', { name: 'Compare products →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Compare products', exact: true })).toBeVisible();
  await expect(page.locator('.comparison-table thead th')).toHaveCount(4);
  await page.getByRole('checkbox', { name: 'Show differences only' }).check();
  assert(await page.locator('.comparison-table tbody tr').count() > 2);
  await page.reload();
  await expect(page.locator('.comparison-table thead th')).toHaveCount(4);
  await page.getByRole('button', { name: 'Remove Tecno Camon 30 Pro 5G from comparison' }).click();
  await expect(page.getByLabel('Add a product')).toBeEnabled();
  await page.getByLabel('Add a product').selectOption('tecno-phantom-v-fold');
  await expect(page.getByRole('button', { name: 'Add Tecno Phantom V Fold to cart' })).toBeDisabled();
  await page.getByRole('button', { name: 'Add Apple iPhone 15 Pro Max to cart' }).click();
  await expect(page.locator('.toast')).toContainText('added to cart');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Clear comparison', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your shortlist starts here.' })).toBeVisible();
  await page.goto(base + '/product/apple-iphone-15-pro-max');
  await page.getByRole('button', { name: 'Compare Apple iPhone 15 Pro Max', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Compare Apple iPhone 15 Pro Max', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto(base + '/faq');
  await page.getByLabel('Search questions').fill('newsletter');
  await expect(page.locator('.faq-list details')).toHaveCount(1);
  await page.getByText('Does the newsletter form send my email anywhere?', { exact: true }).click();
  await expect(page.locator('.faq-list details')).toHaveAttribute('open', '');
  await page.getByLabel('Search questions').fill('zzzzzzzz');
  await expect(page.getByRole('heading', { name: 'No matching questions.' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset questions' }).click();
  await expect(page.locator('.faq-list details')).toHaveCount(9);
  await page.getByLabel('Question category').selectOption('Shopping');
  await expect(page.locator('.faq-list details')).toHaveCount(2);
  await page.goto(base + '/contact');
  await expect(page.getByRole('complementary', {name:'Your comparison shortlist'})).toHaveCount(0);
  await page.getByRole('button', { name: 'Review enquiry' }).click();
  await expect(page.getByRole('region', { name: 'Enquiry preview' })).toHaveCount(0);
  await page.getByLabel('Your message').fill('   ');
  await page.getByRole('button', { name: 'Review enquiry' }).click();
  assert.equal(await page.getByLabel('Your message').evaluate(el => el.validity.customError), true);
  await page.getByLabel('Your name (optional)').fill('Preview Customer');
  await page.getByLabel('Your message').fill('Can you confirm availability?');
  await page.getByRole('button', { name: 'Review enquiry' }).click();
  await expect(page.getByRole('region', { name: 'Enquiry preview' })).toContainText('Can you confirm availability?');
  await expect(page.getByRole('region', { name: 'Enquiry preview' })).toContainText('WhatsApp is unavailable');
  assert.equal(await page.getByRole('region', { name: 'Enquiry preview' }).evaluate(el => el === document.activeElement), true);
  await page.getByLabel('Your message').fill('A revised enquiry');
  await expect(page.getByRole('region', { name: 'Enquiry preview' })).toHaveCount(0);
  await page.goto(base + '/trade-in');
  await page.getByLabel('Device model').fill('Sample phone, 128 GB');
  await page.getByLabel('Device storage').fill('128GB');
  await page.getByLabel('Device condition').selectOption('Working, visible wear or damage');
  await page.getByLabel('Town or city').fill('Lagos');
  await page.getByLabel('Device details and known issues').fill('Cracked rear glass. Please explain assessment.');
  await page.getByRole('button', { name: 'Review enquiry' }).click();
  await expect(page.getByRole('region', { name: 'Enquiry preview' })).toContainText('Device: Sample phone, 128 GB');
  await expect(page.getByRole('region', { name: 'Enquiry preview' })).toContainText('no value has been agreed');
  // Ensure the privacy control clears only store data and updates live state.
  await page.evaluate(() => {
    localStorage.setItem('mobistore.wishlist', JSON.stringify(['apple-iphone-15-pro-max']));
    localStorage.setItem('mobistore.newsletter', JSON.stringify({email:'test@example.com'}));
    localStorage.setItem('unrelated-setting', 'keep');
  });
  await page.goto(base + '/privacy');
  await page.getByRole('button', { name: 'Clear saved store data', exact: true }).click();
  await expect(page.getByRole('status').filter({hasText:'Saved store data cleared'})).toBeVisible();
  await expect(page.getByRole('button', {name:'Cart (0)',exact:true})).toBeVisible();
  await expect(page.getByRole('button', {name:'Wishlist (0)',exact:true})).toBeVisible();
  assert.equal(await page.evaluate(() => localStorage.getItem('mobistore.newsletter')), null);
  assert.equal(await page.evaluate(() => localStorage.getItem('unrelated-setting')), 'keep');
  assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('mobistore.recent'))) || [],[]);
  await page.evaluate(() => localStorage.setItem('mobistore.compare', JSON.stringify([null, {}, 'bad-id', 'apple-iphone-15-pro-max', 'apple-iphone-15-pro-max', 'samsung-galaxy-s24-ultra', 'tecno-camon-30-pro-5g', 'infinix-note-40-pro-4g'])));
  await page.goto(base + '/compare');
  await expect(page.locator('.comparison-table thead th')).toHaveCount(4);
  const routes = {about:'About MobiStore',contact:'Contact us',delivery:'Delivery & returns',warranty:'Warranty & product support',faq:'Frequently asked questions','trade-in':'Trade-in enquiries',compare:'Compare products',terms:'Terms & conditions',privacy:'Privacy & saved data'};
  for (const [route,title] of Object.entries(routes)) {
    await page.goto(base+'/'+route);
    await expect(page.getByRole('heading',{name:title,exact:true,level:1})).toBeVisible();
    if (['delivery','warranty','terms'].includes(route)) await expect(page.locator('main .catalog-notice')).toContainText('awaiting confirmation');
  }
  for (const width of [360,768,1024,1440]) {
    await page.setViewportSize({width,height:1000});
    for (const route of ['contact','trade-in','faq','compare']) {
      await page.goto(base+'/'+route);await page.locator('h1').waitFor();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),`Overflow ${width} ${route}`);
      if (['contact','compare'].includes(route)) await page.screenshot({path:`artifacts/complete-support-${route}-${width}.png`,fullPage:true});
    }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: comparison selection/limit/persistence/differences/cart, FAQ search/categories, enquiry validation/preview/editing, trade-in, scoped storage clearing, malformed saved comparisons, all service routes and four responsive widths.');
} finally { await browser.close(); }
