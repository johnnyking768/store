import test from 'node:test';
import assert from 'node:assert/strict';
import { productMessage, cartMessage, selection, lineKey } from '../src/lib/orders.js';
import { whatsappLink } from '../src/lib/whatsapp.js';
import { site } from '../src/config/site.js';
import { validateCatalog } from '../src/lib/catalog.js';
const p={id:'test',slug:'test-phone',name:'Test Phone',brand:'Test',condition:'New',isSample:true,price:100000,inStock:true,category:'smartphones',image:'/images/test.svg',variants:[{id:'128',storage:'128GB',ram:'8GB',price:100000},{id:'256',storage:'256GB',ram:'8GB',price:150000}],colors:['Black','Blue']};
test('orders preserve selected option price, colour, URL, quantities and delivery text',()=>{
 const message=productMessage(p,'256','Blue','https://store.test');
 assert.match(message,/256GB, Blue/);assert.match(message,/150,000/);assert.match(message,/https:\/\/store.test\/product\/test-phone/);
 const one={id:'test',variantId:'128',color:'Black',quantity:2},two={id:'test',variantId:'256',color:'Blue',quantity:1};
 assert.notEqual(lineKey(one),lineKey(two));
 const cart=cartMessage([one,two],()=>p,'Ikorodu & Lagos');
 assert.match(cart,/Total: ₦350,000/);assert.match(cart,/Delivery location: Ikorodu & Lagos/);
 assert.equal(selection(p,'removed','missing').variant.id,'128');
});
test('WhatsApp links encode the complete message and reject missing contacts',()=>{
 const old=site.WHATSAPP_NUMBER;
 try { site.WHATSAPP_NUMBER='';assert.equal(whatsappLink('hello'),null);site.WHATSAPP_NUMBER='2348012345678';const text='Hi & hello\nBlue + 256GB ₦150,000';const url=new URL(whatsappLink(text));assert.equal(url.hostname,'wa.me');assert.equal(url.searchParams.get('text'),text); } finally {site.WHATSAPP_NUMBER=old;}
});
test('catalogue rejects malformed options, discounts and ratings',()=>{
 assert.deepEqual(validateCatalog([p]),[]);
 for(const change of [{variants:[...p.variants,p.variants[0]]},{variants:[{...p.variants[0],price:0}]},{oldPrice:90000},{colors:['Blue','Blue']},{rating:6},{condition:'Unknown'}])assert(validateCatalog([{...p,...change}]).length>0);
});

