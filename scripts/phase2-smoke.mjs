import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:5173';
try {
 await page.goto(base+'/shop');await page.getByRole('heading',{name:'Explore the collection'}).waitFor();
 await expect(page.locator('.product-card')).toHaveCount(9);
 await page.getByLabel('Category',{exact:true}).selectOption('smartphones');await expect(page.locator('.product-card')).toHaveCount(5);
 await page.getByLabel('Brand',{exact:true}).selectOption('Apple');await expect(page.locator('.product-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('.product-card')).toHaveCount(9);
 await page.getByLabel('Sort by').selectOption('price-asc');await expect(page.locator('.product-card').first()).toContainText('USB-C cable');
 await page.getByRole('textbox',{name:'Search',exact:true}).fill('no-such-product');await page.getByRole('heading',{name:'No products found.'}).waitFor();
 await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('.product-card')).toHaveCount(9);
 await page.getByRole('button',{name:'Save Apple smartphone to wishlist'}).click();
 await page.getByRole('button',{name:'Add Apple smartphone to cart'}).click();
 await page.getByRole('dialog').waitFor();
 await page.getByRole('button',{name:'Increase Apple smartphone quantity'}).click();
 await expect(page.locator('.basket-summary')).toContainText('1,700,000');
 await page.getByText('Review enquiry text').click();assert.match(await page.locator('.basket-summary pre').innerText(),/Apple smartphone . 2/);
 assert.equal(await page.getByRole('button',{name:'WhatsApp checkout unavailable'}).isDisabled(),true);
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'Cart (2)',exact:true}).click();await expect(page.locator('.basket-summary')).toContainText('1,700,000');
 await page.getByRole('button',{name:'Remove Apple smartphone from cart'}).click();await page.getByRole('heading',{name:'Your next upgrade starts here.'}).waitFor();await page.keyboard.press('Escape');
 await page.goto(base+'/wishlist');await expect(page.locator('.product-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Save Apple smartphone to wishlist'}).click();await page.getByRole('heading',{name:'No products found.'}).waitFor();
 await page.getByRole('button',{name:'Search',exact:true}).click();await page.getByLabel('Search phones, brands and accessories').fill('Samsung');
 await page.locator('.live-results').getByRole('link').click();await page.getByRole('heading',{name:'Samsung smartphone',exact:true}).waitFor();
 await page.goto(base+'/product/xiaomi-phone');assert.equal(await page.locator('.detail-actions').getByRole('button',{name:'Add to cart',exact:true}).isDisabled(),true);
 await page.goto(base+'/product/not-a-product');await page.getByRole('heading',{name:'This page is out of range.'}).waitFor();
 for(const [route,count] of [['accessories',3],['deals',3],['brands',9]]){await page.goto(base+'/'+route);await page.locator('.product-card').first().waitFor();await expect(page.locator('.product-card')).toHaveCount(count);}
 await page.goto(base);await page.getByRole('button',{name:'Next slide'}).click();await page.getByRole('heading',{name:'Find Your Everyday Extras.'}).waitFor();await page.getByRole('button',{name:'Previous slide'}).click();
 for(const width of [360,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/','/shop','/product/apple-phone']) {await page.goto(base+route);await page.locator('h1').waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width} ${route}`);}
  await page.goto(base);await page.locator('.product-card').first().waitFor();await page.screenshot({path:`artifacts/phase2-home-${width}.png`,fullPage:true});
 }
 // Invalid persisted rows must not crash the store or inflate the cart.
 await page.evaluate(()=>{localStorage.setItem('mobistore.cart',JSON.stringify([null,{id:'unknown',quantity:2},{id:'apple-phone',quantity:-5},{id:'samsung-phone',quantity:2}]));localStorage.setItem('mobistore.wishlist',JSON.stringify([null,'unknown','apple-phone','apple-phone']));});
 await page.reload();await page.getByRole('button',{name:'Cart (2)',exact:true}).waitFor();await page.getByRole('button',{name:'Wishlist (1)',exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: catalogue filters, sorting, empty search, live search, product routes, unavailable items, cart totals/quantity/removal/persistence, wishlist, malformed storage, carousel and four responsive widths.');
} finally {await browser.close();}

