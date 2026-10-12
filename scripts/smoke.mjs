import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
fs.mkdirSync('artifacts',{recursive:true});
for(const width of [360,768,1024,1440]){
 await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:5173');await page.getByRole('heading',{name:'Upgrade Your World.'}).waitFor();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
 await page.screenshot({path:`artifacts/home-${width}.png`,fullPage:true});
 if(width===360){await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation',{name:'Mobile navigation'}).waitFor();await page.keyboard.press('Escape');assert(await page.getByRole('dialog').count()===0,'Mobile menu closes');}
}
for(const name of ['Search','Account','Wishlist (0)','Cart (0)','Chat on WhatsApp']){await page.getByRole('button',{name,exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')),'Focus within dialog');await page.keyboard.press('Escape');assert(await page.getByRole('dialog').count()===0,`${name} closes`);}
await page.getByRole('button',{name:'Shop categories'}).click();await page.locator('.shop-dropdown').waitFor();await page.keyboard.press('Escape');
await page.getByRole('textbox',{name:'Email address'}).fill('preview@example.com');await page.getByRole('button',{name:'Subscribe to newsletter'}).click();await page.getByRole('status').filter({hasText:'You’re on the list'}).waitFor();
for(const route of ['about','contact','delivery','warranty','faq','trade-in','compare','terms','privacy']){await page.goto(`http://127.0.0.1:5173/${route}`);await page.locator('main h1').waitFor();}
await page.goto('http://127.0.0.1:5173/does-not-exist');await page.getByRole('heading',{name:'This page is out of range.'}).waitFor();
assert(!errors.length,errors.join('\n'));console.log('PASS: four viewport widths, no overflow, navigation, five dialogs, focus, newsletter, nine service routes, 404, no runtime errors.');await browser.close();
