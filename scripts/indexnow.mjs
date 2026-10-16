#!/usr/bin/env node
// Повідомляє пошуковики через IndexNow (Bing і решта учасників протоколу), що сторінки нові або змінені.
// Запускати ПІСЛЯ пушу, коли деплой уже віддає сторінку, разом із check:og.
//
//   npm run indexnow -- /news/2026/10/slug /articles/slug   конкретні сторінки
//   npm run indexnow -- --git HEAD~1                        усе з content/, що змінилось після HEAD~1
//   npm run indexnow -- --dry /news/2026/10/slug            тільки перевірити, нічого не відправляти
//
// Відправляємо тільки адреси, які зараз віддають HTTP 200. Якщо деплой ще не доїхав,
// скрипт чекає до 5 хвилин, а 404 не відправляє взагалі.

import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE = 'https://seobaza.com.ua';
const HOST = 'seobaza.com.ua';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const keyFile = readdirSync(join(root, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('Немає файлу ключа public/<32 hex>.txt');
  process.exit(2);
}
const KEY = keyFile.replace('.txt', '');

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const gitIdx = args.indexOf('--git');
const paths = [];

// Git Bash на Windows перетворює /news/... на C:/Program Files/Git/news/..., повертаємо шлях сайту.
const demangle = (a) =>
  a.replace(/^[A-Za-z]:[\\/].*?(?=\/(news|articles|events|knowledge-base|kg|authors|videos)\/)/, '').replace(/\\/g, '/');

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--dry') continue;
  if (a === '--git') { i++; continue; }
  const p = demangle(a);
  paths.push(p.startsWith('http') ? p : SITE + (p.startsWith('/') ? p : '/' + p));
}

// Файл контенту -> адреса на сайті.
function contentToUrl(file) {
  const f = file.replace(/\\/g, '/').replace(/^seobaza-new\//, '');
  let m;
  if ((m = f.match(/^content\/news\/(\d{4})\/(\d{2})\/([^/]+)\.mdx$/))) return `${SITE}/news/${m[1]}/${m[2]}/${m[3]}`;
  if ((m = f.match(/^content\/events\/(\d{4})\/([^/]+)\.mdx$/))) return `${SITE}/events/${m[1]}/${m[2]}`;
  if ((m = f.match(/^content\/(articles|knowledge-base|videos)\/([^/]+)\.mdx$/))) return `${SITE}/${m[1]}/${m[2]}`;
  return null;
}

if (gitIdx !== -1) {
  const rev = args[gitIdx + 1];
  if (!rev) {
    console.error('Після --git вкажи коміт, наприклад --git HEAD~1');
    process.exit(2);
  }
  // Тільки закомічене (rev..HEAD): незакомічені чернетки на сайті ще не живуть.
  const out = execSync(`git diff --name-only --diff-filter=AM ${rev} HEAD -- content`, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  for (const line of out.split('\n').filter(Boolean)) {
    const u = contentToUrl(line);
    if (u) paths.push(u);
  }
}

const urls = [...new Set(paths)];
if (!urls.length) {
  console.error('Немає адрес. Приклад: npm run indexnow -- /news/2026/10/slug');
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function status(u) {
  try {
    const r = await fetch(u, { method: 'GET', redirect: 'manual' });
    return r.status;
  } catch {
    return 0;
  }
}

// Ключ має віддаватися з сайту, інакше IndexNow відхилить запит.
const keyStatus = await status(`${SITE}/${KEY}.txt`);
if (keyStatus !== 200) {
  console.error(`❌ ${SITE}/${KEY}.txt віддає ${keyStatus}. Файл ключа ще не задеплоєний.`);
  if (!dry) process.exit(1);
}

const ready = [];
const failed = [];
for (const u of urls) {
  let s = await status(u);
  for (let t = 0; s !== 200 && t < 10; t++) {
    console.log(`… ${u} віддає ${s}, чекаю деплой (${t + 1}/10)`);
    await sleep(30000);
    s = await status(u);
  }
  if (s === 200) ready.push(u);
  else failed.push(`${u} (HTTP ${s})`);
}

for (const u of ready) console.log(`✅ ${u}`);
for (const u of failed) console.log(`❌ не відправляю: ${u}`);

if (!ready.length) process.exit(1);
if (dry) {
  console.log(`\n--dry: нічого не відправлено (${ready.length} готові).`);
  process.exit(failed.length ? 1 : 0);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: ready }),
});
// 200 = прийнято, 202 = прийнято, ключ ще перевіряється.
if (res.status === 200 || res.status === 202) {
  console.log(`\nIndexNow прийняв ${ready.length} адрес (HTTP ${res.status}).`);
} else {
  console.error(`\nIndexNow відповів HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}
process.exit(failed.length ? 1 : 0);
