import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless:true, executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
const base = 'http://127.0.0.1:5173';
const errors = [];
const page = await browser.newPage();
page.on('pageerror', e => errors.push(e.message));
try {
  // A separate context serves test-only inventory. The actual catalogue is never rewritten.
  const context = await browser.newContext();
  const fixture = [
    {id:'sku-one',slug:'fixture-one',name:'Fixture One',brand:'Fixture',category:'smartphones',price:123000,inStock:true,isSample:false,image:'/images/fixture-one.svg',images:['/images/fixture-two.svg','/images/missing-fixture.svg'],description:'Inventory rendering test only.',specifications:{Storage:'128 GB',Colour:'Purple'}},
    {id:'sku-two',slug:'fixture-two',name:'Fixture Two',brand:'Fixture',category:'smartphones',price:234000,inStock:true,isSample:false,image:'/images/fixture-two.svg',description:'Second inventory rendering test.',specifications:{Storage:'256 GB',Colour:'Purple',Display:'Test display'}},
  ];
  await context.route('**/src/data/catalog.json*', route => route.fulfill({contentType:'application/javascript',body:`export default ${JSON.stringify(fixture)};`}));
  await context.route('**/images/fixture-*.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" rx="20" fill="#6348cd"/></svg>'}));
  await context.route('**/images/missing-fixture.svg',route=>route.fulfill({status:404,body:'Missing image fixture'}));
  const fixturePage = await context.newPage();
  fixturePage.on('pageerror', e=>errors.push(e.message));
  await fixturePage.goto(base+'/product/fixture-one');
  await expect(fixturePage.getByRole('heading',{name:'Fixture One',exact:true})).toBeVisible();
  await fixturePage.getByRole('button',{name:'Enlarge Fixture One image'}).click();
  await expect(fixturePage.getByRole('dialog',{name:'Fixture One'})).toBeVisible();
  await fixturePage.keyboard.press('Escape');
  await expect(fixturePage.getByRole('button',{name:'Enlarge Fixture One image'})).toBeFocused();
  await expect(fixturePage.locator('.product-specifications')).toContainText('128 GB');
  await expect(fixturePage.locator('.product-specifications')).toContainText('Purple');
  await fixturePage.getByRole('button',{name:'View image 2',exact:true}).click();
  await expect(fixturePage.locator('.gallery-main img')).toHaveAttribute('src','/images/fixture-two.svg');
  await fixturePage.getByRole('button',{name:'View image 3',exact:true}).click();
  await expect(fixturePage.locator('.gallery-main img')).toHaveAttribute('src','/images/phones/placeholder.svg');
  await fixturePage.getByRole('button',{name:'Compare Fixture One',exact:true}).click();
  await fixturePage.getByRole('button',{name:'Compare Fixture Two',exact:true}).click();
  await fixturePage.getByRole('link',{name:'Compare products →',exact:true}).click();
  await expect(fixturePage.getByRole('row',{name:'Specification: Storage 128 GB 256 GB'})).toBeVisible();
  await expect(fixturePage.getByRole('row',{name:'Specification: Display Not supplied Test display'})).toBeVisible();
  await fixturePage.getByRole('checkbox',{name:'Show differences only'}).check();
  await expect(fixturePage.getByRole('row',{name:'Specification: Colour Purple Purple'})).toHaveCount(0);
  await fixturePage.getByRole('button',{name:'Add Fixture One to cart'}).click();
  await fixturePage.getByRole('button',{name:'Cart (1)',exact:true}).click();
  await expect(fixturePage.getByRole('dialog')).toContainText('Fixture One');
  await expect(fixturePage.locator('.basket-summary')).toContainText('123,000');
  await expect(fixturePage.locator('.basket-summary')).not.toContainText('Sample subtotal');
  await fixturePage.keyboard.press('Escape');
  await fixturePage.goto(base+'/shop?q=256');
  await expect(fixturePage.locator('.catalog-layout .product-card')).toHaveCount(1);
  await expect(fixturePage.locator('.catalog-layout .product-card')).toContainText('Fixture Two');
  await context.close();
  assert.deepEqual(errors,[]);
  console.log('PASS: isolated inventory fixture verifies zoom/focus, distinct ID/slug, gallery changes, broken-image fallback, specification comparison, specification search and cart labels.');
} finally { await browser.close(); }
