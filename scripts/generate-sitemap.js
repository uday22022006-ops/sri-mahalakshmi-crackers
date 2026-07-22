import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://smlcrackers.in';

// Load products
const productsRaw = fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf-8');
const products = JSON.parse(productsRaw);

const staticRoutes = [
  '/',
  '/offers',
  '/categories',
  '/products',
];

const categories = [
  'Ground Chakkars',
  'Flower Pots',
  'Rockets',
  'Gift Boxes',
  'Fancy Items',
  'Atom Bomb',
  'Sparklers',
  'Sky Shots'
];

// Generate URLs for categories
const categoryRoutes = categories.map(cat => `/categories/${encodeURIComponent(cat.toLowerCase().replace(/ /g, '-'))}`);

// Generate URLs for products
const productRoutes = products.map(product => `/product/${product.id}`);

const allRoutes = [...staticRoutes, ...categoryRoutes, ...productRoutes];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemapXml);
console.log('✅ Generated sitemap.xml in public folder');

const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robotsTxt);
console.log('✅ Generated robots.txt in public folder');
