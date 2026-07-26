# SEO BAZA - Українська SEO-спільнота 💛

Сучасний вебсайт української SEO-спільноти, побудований на Next.js 14 з TypeScript, Tailwind CSS та підтримкою markdown статей.

## 🚀 Особливості

- ⚡ **Next.js 14** з App Router для швидкості та SEO
- 🎨 **Tailwind CSS** для сучасного дизайну як у Cursor.com
- 📝 **Markdown підтримка** для статей через GitHub
- 🔍 **SEO оптимізація** з RDF, Dublin Core та Schema.org
- 📱 **Responsive дизайн** для всіх пристроїв
- 🎯 **TypeScript** для надійного коду
- 🌐 **Українська мова** як основна

## 📦 Встановлення

```bash
# Клонуйте репозиторій
git clone https://github.com/yourusername/seobaza-claude.git

# Перейдіть в директорію
cd seobaza-claude

# Встановіть залежності
npm install

# Запустіть dev сервер
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

## 📝 Як додати статтю

Додавання статей здійснюється через GitHub - просто створіть markdown файл!

### Крок 1: Створіть файл

Створіть новий `.md` файл у директорії `content/articles/`:

```bash
content/articles/my-new-article.md
```

### Крок 2: Додайте frontmatter

Кожна стаття повинна мати метадані на початку файлу:

```markdown
---
title: "Назва вашої статті"
date: "2025-01-15"
author: "Ваше Ім'я"
description: "Короткий опис статті для превью та SEO"
keywords: ["SEO", "ключові", "слова"]
---

## Ваш контент починається тут

Пишіть markdown як завжди...
```

### Крок 3: Напишіть контент

Використовуйте звичайний markdown:

```markdown
## Заголовок H2

### Заголовок H3

Це параграф з **жирним** і *курсивом*.

- Список
- Елементів

1. Нумерований
2. Список

[Посилання](https://example.com)

> Цитата

\`\`\`javascript
const code = "блок коду";
\`\`\`
```

### Крок 4: Надішліть Pull Request

1. Форкніть репозиторій
2. Створіть нову гілку: `git checkout -b article/my-article`
3. Додайте ваш файл: `git add content/articles/my-new-article.md`
4. Зробіть коміт: `git commit -m "Додав статтю про..."`
5. Пушніть: `git push origin article/my-article`
6. Створіть Pull Request на GitHub

### Приклад повної статті

```markdown
---
title: "10 порад з SEO для початківців"
date: "2025-01-20"
author: "Олена Петренко"
description: "Базові поради з SEO, які допоможуть вашому сайту з'явитися в топі Google"
keywords: ["SEO", "поради", "початківці", "Google", "оптимізація"]
---

## Вступ

SEO може здаватися складним, але ці 10 простих порад допоможуть вам почати...

## 1. Дослідження ключових слів

Перш ніж писати контент, дізнайтеся, що шукають ваші користувачі...

[Ваш контент...]
```

## 🏗️ Структура проєкту

```
seobaza-claude/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Головний layout з Header/Footer
│   ├── page.tsx             # Домашня сторінка
│   ├── contact/             # Сторінка контактів
│   └── articles/            # Статті
│       ├── page.tsx         # Список статей
│       └── [slug]/          # Окрема стаття
├── components/              # React компоненти
│   ├── Header.tsx
│   └── Footer.tsx
├── content/
│   └── articles/           # 📝 Markdown статті тут
│       └── example.md
├── lib/
│   └── markdown.ts         # Утиліти для markdown
├── public/                 # Статичні файли
└── tailwind.config.ts     # Tailwind конфігурація
```

## 🎨 Технології

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown (gray-matter, remark)
- **SEO**: Schema.org, RDF, Dublin Core
- **Fonts**: Open Sans, Proza Libre

## 🔧 Команди

```bash
npm run dev      # Запустити dev сервер
npm run build    # Збілдити для production
npm start        # Запустити production сервер
npm run lint     # Перевірити код
```

## 📱 Responsive Design

Сайт повністю адаптивний:
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (> 1024px)

## 🔍 SEO Features

- ✅ Schema.org structured data
- ✅ RDF markup (vocab, typeof, property)
- ✅ Dublin Core metadata
- ✅ Open Graph tags
- ✅ Semantic HTML5
- ✅ Sitemap (auto-generated)
- ✅ Meta tags optimization

## 🤝 Як зробити свій внесок

1. Напишіть статтю (див. інструкції вище)
2. Знайшли баг? Створіть Issue
3. Хочете покращити код? Pull Request вітається!
4. Маєте ідею? Напишіть @fajela в Telegram

## 📞 Контакти

- **Telegram**: [@fajela](https://t.me/fajela)
- **YouTube**: [SEO BAZA](https://www.youtube.com/c/SEOBAZA)
- **Telegram канал**: [SEOBAZA](https://t.me/SEOBAZA)
- **Website**: [seobaza.com.ua](https://seobaza.com.ua)

## 📄 Ліцензія

Created with ♥ for Ukrainian SEO community

---

**SEO BAZA** - найкраща українська SEO-спільнота! 💛💙
