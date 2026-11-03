#!/usr/bin/env node
// Google Indexing API для сторінок вакансій (/jobs/<компанія>/<slug>). Google дозволяє цей API
// тільки для сторінок з JobPosting, тому інші розділи сюди не відправляти: для них IndexNow.
// Запускати ПІСЛЯ пушу, коли деплой уже віддає сторінку, разом з indexnow.
//
//   npm run google-indexing -- /jobs/boosta/tl-seo-2026-11      конкретні вакансії (URL_UPDATED)
//   npm run google-indexing -- --git HEAD~1                     усі вакансії, змінені після HEAD~1
//   npm run google-indexing -- --all                            усі вакансії з content/jobs
//   npm run google-indexing -- --delete /jobs/x/y               сторінку видалено з сайту (URL_DELETED)
//   npm run google-indexing -- --dry --all                      тільки перевірити, нічого не відправляти
//
// Закрита вакансія лишається на сайті без розмітки JobPosting, тому для неї теж URL_UPDATED:
// Google перескановує сторінку і прибирає вакансію з пошуку. URL_DELETED тільки для сторінок, яких більше немає (404).
//
// Ключ: сервісний акаунт fajela-indexing-api@fajela.iam.gserviceaccount.com (власник seobaza.com.ua у Search Console).
// Файл ключа лежить поза репо: C:\Fajela\GoogleCloud\client_secrets.json або шлях у GOOGLE_INDEXING_KEY.
// Ліміт Google за замовчуванням: 200 запитів на добу.

import { execSync } from 'node:child_process';
import { createSign } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE = 'https://seobaza.com.ua';
const ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SCOPE = 'https://www.googleapis.com/auth/indexing';
const KEY_PATH = process.env.GOOGLE_INDEXING_KEY || 'C:\\Fajela\\GoogleCloud\\client_secrets.json';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const all = args.includes('--all');
const del = args.includes('--delete');
const gitIdx = args.indexOf('--git');

// Git Bash на Windows перетворює /jobs/... на C:/Program Files/Git/jobs/..., повертаємо шлях сайту.
const demangle = (a) => a.replace(/^[A-Za-z]:[\\/].*?(?=\/jobs\/)/, '').replace(/\\/g, '/');

const paths = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (['--dry', '--all', '--delete'].includes(a)) continue;
  if (a === '--git') { i++; continue; }
  const p = demangle(a);
  paths.push(p.startsWith('http') ? p : SITE + (p.startsWith('/') ? p : '/' + p));
}

// Файл вакансії -> адреса на сайті. company.md і все інше пропускаємо.
function jobFileToUrl(file) {
  const m = file.replace(/\\/g, '/').replace(/^seobaza-new\//, '').match(/^content\/jobs\/([^/]+)\/([^/]+)\.mdx$/);
  return m ? `${SITE}/jobs/${m[1]}/${m[2]}` : null;
}

if (all) {
  const dir = join(root, 'content', 'jobs');
  for (const company of readdirSync(dir)) {
    if (!statSync(join(dir, company)).isDirectory()) continue;
    for (const f of readdirSync(join(dir, company))) {
      const u = jobFileToUrl(`content/jobs/${company}/${f}`);
      if (u) paths.push(u);
    }
  }
}

if (gitIdx !== -1) {
  const rev = args[gitIdx + 1];
  if (!rev) {
    console.error('Після --git вкажи коміт, наприклад --git HEAD~1');
    process.exit(2);
  }
  const out = execSync(`git diff --name-only --diff-filter=AM ${rev} HEAD -- content/jobs`, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  for (const line of out.split('\n').filter(Boolean)) {
    const u = jobFileToUrl(line);
    if (u) paths.push(u);
  }
}

const urls = [...new Set(paths)].filter((u) => u.startsWith(`${SITE}/jobs/`));
if (!urls.length) {
  console.error('Немає адрес вакансій. Приклад: npm run google-indexing -- /jobs/boosta/tl-seo-2026-11');
  process.exit(2);
}

if (!existsSync(KEY_PATH)) {
  console.error(`Немає файлу ключа ${KEY_PATH} (або вкажи GOOGLE_INDEXING_KEY).`);
  process.exit(2);
}
const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));

const b64 = (s) => Buffer.from(s).toString('base64url');
async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const head = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: key.token_uri, iat: now, exp: now + 3600 }));
  const sig = createSign('RSA-SHA256').update(`${head}.${claim}`).sign(key.private_key, 'base64url');
  const r = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }),
  });
  const j = await r.json();
  if (!j.access_token) {
    console.error(`Не вдалося отримати токен: ${JSON.stringify(j)}`);
    process.exit(1);
  }
  return j.access_token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function status(u) {
  try {
    return (await fetch(u, { method: 'GET', redirect: 'manual' })).status;
  } catch {
    return 0;
  }
}

// URL_UPDATED тільки для сторінок з HTTP 200 (чекаємо деплой до 5 хвилин); URL_DELETED тільки для 404/410.
const ready = [];
const failed = [];
for (const u of urls) {
  let s = await status(u);
  if (del) {
    if (s === 404 || s === 410) ready.push(u);
    else failed.push(`${u} (HTTP ${s}, сторінка ще існує)`);
    continue;
  }
  for (let t = 0; s !== 200 && t < 10; t++) {
    console.log(`… ${u} віддає ${s}, чекаю деплой (${t + 1}/10)`);
    await sleep(30000);
    s = await status(u);
  }
  if (s === 200) ready.push(u);
  else failed.push(`${u} (HTTP ${s})`);
}

for (const u of failed) console.log(`❌ не відправляю: ${u}`);
if (!ready.length) process.exit(1);
if (dry) {
  for (const u of ready) console.log(`✅ ${u}`);
  console.log(`\n--dry: нічого не відправлено (${ready.length} готові).`);
  process.exit(failed.length ? 1 : 0);
}

const token = await accessToken();
const type = del ? 'URL_DELETED' : 'URL_UPDATED';
let ok = 0;
for (const u of ready) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ url: u, type }),
  });
  if (r.ok) {
    ok++;
    console.log(`✅ ${type} ${u}`);
  } else {
    failed.push(u);
    console.log(`❌ ${u}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  }
}
console.log(`\nGoogle Indexing API прийняв ${ok} з ${ready.length} адрес (${type}).`);
process.exit(failed.length ? 1 : 0);
