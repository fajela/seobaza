# 🚀 Quick Start Guide - SEO BAZA

## ✅ Що вже працює

Ваш сайт **запущено** та доступний на: **http://localhost:3000**

## 🎯 Перші кроки (5 хвилин)

### 1. Додайте логотип

```bash
# Завантажте з сайту або знайдіть локальну копію
# Збережіть як: C:\seobaza\seobaza-new\public\seobaza.png
```

Інструкції: `public/LOGO-README.txt`

### 2. Перегляньте сайт

Відкрийте у браузері: http://localhost:3000

**Що перевірити:**
- ✅ Головна сторінка
- ✅ Темна/світла тема (кнопка вгорі справа)
- ✅ Мобільна версія (burger menu)
- ✅ Сторінка статей: http://localhost:3000/articles (5 статей перенесено!)
- ✅ Сторінка тестів: http://localhost:3000/test
- ✅ Сторінка подій: http://localhost:3000/events

### 3. Додайте свою першу статтю (опціонально)

Створіть файл: `content/articles/my-first-article.mdx`

```mdx
---
title: "Моя перша стаття про SEO"
description: "Короткий опис статті"
author: "Ваше ім'я"
date: "2025-12-27"
tags: ["SEO", "Tutorial"]
---

# Заголовок

Ваш контент тут...

## Підзаголовок

- Списки
- **Жирний текст**
- *Курсив*

\```javascript
// Code blocks з підсвічуванням
console.log('Hello SEO BAZA!');
\```
```

Збережіть та перезавантажте: http://localhost:3000/articles

## 🌐 Deploy (10 хвилин)

### Варіант 1: Vercel (рекомендовано)

```bash
# 1. Створіть GitHub репозиторій
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/seobaza.git
git push -u origin main

# 2. Зайдіть на vercel.com
# 3. Import Project → Виберіть репозиторій
# 4. Deploy (автоматично налаштується)
```

Детальніше: `DEPLOYMENT.md`

## 📝 Корисні команди

```bash
# Розробка
npm run dev          # Запустити dev server

# Production
npm run build        # Зібрати для production
npm start            # Запустити production server

# Якість коду
npm run lint         # Перевірити код
```

## 📂 Структура файлів

```
seobaza-new/
├── app/
│   ├── page.tsx              # 🏠 Головна сторінка
│   ├── layout.tsx            # Layout + метадані
│   ├── globals.css           # Стилі теми
│   └── articles/             # 📝 Система статей
├── components/
│   ├── navigation.tsx        # Меню
│   └── theme-toggle.tsx      # Перемикач теми
├── content/articles/         # 📄 Ваші MDX статті (тут додавати)
└── public/                   # Статичні файли (логотип сюди)
```

## 🎨 Налаштування кольорів

Редагуйте `app/globals.css`:

```css
:root {
  --primary: 212 100% 32%;    /* Синій */
  --accent: 85 65% 60%;       /* Зелений */
}

.dark {
  --primary: 212 100% 45%;    /* Світліший синій для dark mode */
}
```

## ❓ Потрібна допомога?

- 📚 Детальна документація: `README.md`
- 🚀 Deployment guide: `DEPLOYMENT.md`
- 📊 Порівняння версій: `IMPROVEMENTS.md`
- 💬 Telegram: [@fajela](https://telegram.me/fajela)
- 👥 Спільнота: [SEOBAZA](https://telegram.me/SEOBAZA)

## 🎉 Готово!

Ваш сайт готовий до використання. Наступні кроки:

1. [ ] Додати логотип
2. [ ] Перевірити всі сторінки
3. [ ] Додати реальні статті
4. [ ] Deploy на Vercel
5. [ ] Налаштувати домен seobaza.com.ua

**Успіхів! 💙💛**
