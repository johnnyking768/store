import fs from 'node:fs/promises';
import { site } from '../src/config/site.js';
import { launchIssues } from '../src/lib/launch.js';
import { policies } from '../src/data/support.js';
export function seoFiles(site, catalog, policies) {
 const ready = launchIssues({site,catalog,policies}).length === 0;
 const origin = (site.publicUrl || '').replace(/\/$/,'');
 const routes = ready ? ['','/shop','/brands','/accessories','/deals',...catalog.map(p=>'/product/'+p.slug)] : [];
 const xml = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 return {
  robots: ready ? 'User-agent: *\nAllow: /\nDisallow: /wishlist\nDisallow: /compare\nSitemap: '+origin+'/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n',
  sitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(route=>'<url><loc>'+xml(origin+route+'/'.repeat(route===''))+'</loc></url>').join('')+'</urlset>\n'
 };
}
const catalog=JSON.parse(await fs.readFile(new URL('../src/data/catalog.json',import.meta.url),'utf8'));
const generated=seoFiles(site,catalog,policies);
await fs.writeFile(new URL('../public/robots.txt',import.meta.url),generated.robots);
await fs.writeFile(new URL('../public/sitemap.xml',import.meta.url),generated.sitemap);
console.log('Generated robots.txt and sitemap.xml for '+(generated.robots.includes('Disallow: /\n')?'preview (indexing disabled)':'release')+'.');

