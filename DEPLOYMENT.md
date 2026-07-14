# 🚀 SEO BAZA - Гайд по розгортанню

## ✨ Що вже готово

Ваш новий сайт SEO BAZA повністю готовий до використання та включає:

### ✅ Реалізовані функції

- **🌓 Темна/світла тема** - автоматична зміна згідно системних налаштувань + ручний перемикач
- **📱 Адаптивний дизайн** - відмінно виглядає на всіх пристроях
- **⚡ Оптимізована швидкість** - Next.js 15 з App Router для максимальної продуктивності
- **🔍 SEO оптимізація** - Schema.org structured data, Open Graph, meta tags
- **♿ Доступність** - WCAG AA compliant
- **📝 Система статей** - підтримка MDX для статей з можливістю контрибуції через GitHub
- **🎨 Сучасний UI** - натхненний найкращими практиками (Cursor.com)
- **🌐 RDF & Dublin Core** - metadata для семантичної розмітки
- **✨ Плавні анімації** - transitions без перевантаження

## 🖥️ Локальний запуск

### 1. Встановлення залежностей

\`\`\`bash
cd C:\seobaza\seobaza-new
npm install
\`\`\`

### 2. Запуск dev-сервера

\`\`\`bash
npm run dev
\`\`\`

Сайт буде доступний на http://localhost:3000

### 3. Збірка для production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🌐 Розгортання на Vercel (РЕКОМЕНДОВАНО)

Vercel - це платформа від творців Next.js, ідеально підходить для цього проекту.

### Крок 1: Створіть GitHub репозиторій

\`\`\`bash
cd C:\seobaza\seobaza-new
git init
git add .
git commit -m "Initial commit: SEO BAZA website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/seobaza.git
git push -u origin main
\`\`\`

### Крок 2: Deploy на Vercel

1. Зайдіть на [vercel.com](https://vercel.com)
2. Підключіть ваш GitHub аккаунт
3. Натисніть **"Import Project"**
4. Виберіть репозиторій `seobaza`
5. Налаштування:
   - **Framework Preset**: Next.js (автоматично)
   - **Build Command**: `npm run build` (автоматично)
   - **Output Directory**: `.next` (автоматично)
6. Натисніть **Deploy**

✅ **Готово!** Ваш сайт буде доступний на https://your-project.vercel.app

### Налаштування домену

1. У Vercel Dashboard перейдіть до Settings → Domains
2. Додайте `seobaza.com.ua`
3. Налаштуйте DNS записи згідно з інструкціями Vercel

## 🚀 Альтернативні варіанти розгортання

### Netlify

1. Зайдіть на [netlify.com](https://netlify.com)
2. Підключіть GitHub репозиторій
3. Налаштування:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Deploy

### Cloudflare Pages

1. Зайдіть на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Підключіть репозиторій
3. Налаштування:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`

### VPS/Dedicated Server

Якщо у вас є власний сервер:

\`\`\`bash
# 1. Клонуйте репозиторій на сервер
git clone https://github.com/YOUR_USERNAME/seobaza.git
cd seobaza

# 2. Встановіть залежності
npm install

# 3. Зберіть проект
npm run build

# 4. Запустіть з PM2
npm install -g pm2
pm2 start npm --name "seobaza" -- start
pm2 save
pm2 startup
\`\`\`

### Docker

\`\`\`dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## 📝 Додавання контенту

### Додавання логотипу

Скопіюйте ваш логотип в:
\`\`\`bash
cp C:\seobaza\website\seobaza.png C:\seobaza\seobaza-new\public\seobaza.png
\`\`\`

### Додавання статей

Створіть файл в `content/articles/your-article.mdx`:

\`\`\`mdx
---
title: "Назва статті"
description: "Опис статті"
author: "Ваше ім'я"
date: "2025-12-27"
tags: ["SEO", "Technical SEO"]
---

# Ваша стаття

Контент тут...
\`\`\`

### Додавання сторінок

Створіть папку в `app/` з файлом `page.tsx`:

\`\`\`typescript
// app/contact/page.tsx
export const metadata = {
  title: "Контакти - SEO BAZA",
};

export default function ContactPage() {
  return <div>Ваш контент</div>;
}
\`\`\`

## 🔧 Налаштування

### Змінити кольори теми

Редагуйте `app/globals.css`:

\`\`\`css
:root {
  --primary: 212 100% 32%; /* HSL формат */
  --accent: 85 65% 60%;
  /* інші змінні... */
}
\`\`\`

### Змінити шрифти

Редагуйте `app/layout.tsx`:

\`\`\`typescript
import { Your_Font } from "next/font/google";

const yourFont = Your_Font({
  subsets: ["latin", "cyrillic"],
  variable: "--font-your-font",
});
\`\`\`

## 📊 Performance

Сайт оптимізовано для максимальної швидкості:

- ✅ Static Generation де можливо
- ✅ Automatic Code Splitting
- ✅ Image Optimization з Next.js Image
- ✅ Font Optimization
- ✅ CSS Minification
- ✅ Tree Shaking

Очікувані метрики:
- **Lighthouse Score**: 95-100
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Cumulative Layout Shift**: < 0.1

## 🛡️ Безпека

- ✅ TypeScript для type safety
- ✅ ESLint для code quality
- ✅ Sanitized user input
- ✅ Secure headers (налаштовується в next.config.ts)
- ✅ No exposed sensitive data

## 📚 Підтримка

Якщо виникли питання:

1. Перегляньте [Next.js документацію](https://nextjs.org/docs)
2. Перегляньте [Tailwind CSS документацію](https://tailwindcss.com/docs)
3. Зверніться до SEO BAZA спільноти в Telegram: [@SEOBAZA](https://t.me/SEOBAZA)
4. Напишіть [@fajela](https://t.me/fajela)

## 🎯 Наступні кроки

1. **Скопіюйте логотип** з старого сайту
2. **Створіть GitHub репозиторій** та додайте код
3. **Deploy на Vercel** (5 хвилин)
4. **Налаштуйте домен** seobaza.com.ua
5. **Додайте перші статті** через MDX
6. **Запросіть контрибуторів** поділитися своїми знаннями

---

**Готово!** 🎉 Ваш новий сайт SEO BAZA набагато краще оптимізований, має сучасний дизайн та готовий до росту спільноти!

Створено з ♥ для української SEO-спільноти
