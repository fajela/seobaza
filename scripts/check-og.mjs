#!/usr/bin/env node
// Перевіряє, що сторінка готова до шеру в соцмережах, і друкує готові лінки на дебагери.
// Запуск: node scripts/check-og.mjs /news/2026/08/slug
// Або:    npm run check:og -- /news/2026/08/slug

const SITE = 'https://seobaza.com.ua';
const FB_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

// Дефолти сайту. Якщо сторінка віддає їх, значить краулер бачить 404 або головну.
const DEFAULT_TITLE = 'SEO BAZA - українська SEO-спільнота';
const DEFAULT_IMAGE = '/og-image.png';

const REQUIRED_W = 1200;
const REQUIRED_H = 630;

const arg = process.argv[2];
if (!arg) {
  console.error('Вкажи шлях або повний URL: node scripts/check-og.mjs /news/2026/08/slug');
  process.exit(2);
}
// Git Bash на Windows перетворює аргумент /news/... на C:/Program Files/Git/news/...
// Витягуємо назад справжній шлях сайту.
const demangled = arg.replace(/^[A-Za-z]:[\\/].*?(?=\/(news|articles|events|knowledge-base|kg|authors)\/)/, '');
const path = demangled.replace(/\\/g, '/');
const url = path.startsWith('http') ? path : SITE + (path.startsWith('/') ? path : '/' + path);

const problems = [];
const ok = [];

function meta(html, prop) {
  const re = new RegExp(`<meta[^>]+property="${prop}"[^>]+content="([^"]*)"`, 'i');
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<meta[^>]+content="([^"]*)"[^>]+property="${prop}"`, 'i');
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}

const res = await fetch(url, { headers: { 'user-agent': FB_UA } });
if (res.status !== 200) {
  problems.push(`сторінка віддає HTTP ${res.status}, краулер соцмережі закешує 404 і покаже логотип сайту`);
}
const html = await res.text();

const title = meta(html, 'og:title');
const description = meta(html, 'og:description');
const image = meta(html, 'og:image');
const w = meta(html, 'og:image:width');
const h = meta(html, 'og:image:height');

if (!title) problems.push('немає og:title');
else if (title === DEFAULT_TITLE) problems.push(`og:title дефолтний (${DEFAULT_TITLE}), сторінки для краулера не існує`);
else ok.push(`og:title: ${title}`);

if (!description) problems.push('немає og:description');
else ok.push(`og:description: ${description.slice(0, 70)}...`);

if (!image) {
  problems.push('немає og:image, у стрічці буде порожня картка');
} else if (image.endsWith(DEFAULT_IMAGE)) {
  problems.push('og:image дефолтний логотип сайту, а не зображення матеріалу');
} else {
  const img = await fetch(image, { method: 'GET', headers: { 'user-agent': FB_UA } });
  if (img.status !== 200) {
    problems.push(`og:image віддає HTTP ${img.status}: ${image}`);
  } else {
    const bytes = (await img.arrayBuffer()).byteLength;
    ok.push(`og:image: ${image} (${Math.round(bytes / 1024)} КБ)`);
    if (!image.endsWith('.jpg') && !image.endsWith('.jpeg')) {
      problems.push('og:image не .jpg, у нас всі зображення jpg');
    }
  }
  if (Number(w) !== REQUIRED_W || Number(h) !== REQUIRED_H) {
    problems.push(`og:image ${w}x${h}, а треба ${REQUIRED_W}x${REQUIRED_H}, інакше Facebook обріже картку`);
  } else {
    ok.push(`розмір ${w}x${h}`);
  }
}

for (const line of ok) console.log('  OK  ' + line);
for (const line of problems) console.log('  ЩЕ  ' + line);

const enc = encodeURIComponent(url);
console.log('\nПеред тим як постити, прогріти кеш (потрібен логін):');
console.log('Facebook: https://developers.facebook.com/tools/debug/?q=' + enc);
console.log('LinkedIn: https://www.linkedin.com/post-inspector/inspect/' + enc);

if (problems.length) {
  console.log('\nСоцпости не віддавати, поки це не полагоджено.');
  process.exit(1);
}
console.log('\nСторінка готова до шеру.');
