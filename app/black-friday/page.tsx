import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чорна п'ятниця 2025 - SEO BAZA",
  description: "Спеціальні пропозиції та знижки на SEO інструменти та сервіси в Чорну п'ятницю 2025",
};

export default function BlackFridayPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-text-primary">
          Чорна п'ятниця 2025
        </h1>
        <p className="text-xl text-gray-600">
          Найкращі знижки на SEO інструменти та сервіси
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg p-8 mb-8 shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-3xl font-bold mb-2">Black Friday 2025</h2>
          <p className="text-xl text-gray-300">
            Слідкуйте за оновленнями в нашому Telegram каналі
          </p>
          <a
            href="https://t.me/SEOBAZA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-accent text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-accent-light transition-colors"
          >
            Підписатись на канал
          </a>
        </div>
      </div>

      <div className="space-y-6">
        <article className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-heading text-2xl font-bold mb-4">
            Як не пропустити найкращі пропозиції?
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <strong>Telegram канал:</strong> Підпишіться на наш канал, щоб отримувати
                миттєві сповіщення про нові знижки
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <strong>Увімкніть сповіщення:</strong> Не пропустіте жодної пропозиції
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <strong>Діліться з друзями:</strong> Допоможіть іншим SEO-фахівцям
                зекономити
              </div>
            </div>
          </div>
        </article>

        <article className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-heading text-2xl font-bold mb-4">
            Про що буде інформація?
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-accent text-xl">✓</span>
              SEO інструменти та платформи
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent text-xl">✓</span>
              Аналітика та моніторинг
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent text-xl">✓</span>
              Навчальні курси та матеріали
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent text-xl">✓</span>
              Хостинг та домени
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent text-xl">✓</span>
              Інші корисні сервіси для SEO
            </li>
          </ul>
        </article>

        <div className="text-center p-8 bg-seo-gray rounded-lg">
          <p className="text-lg text-gray-700 mb-4">
            Маєте інформацію про знижки, якою хочете поділитись?
          </p>
          <a
            href="https://t.me/fajela"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Напишіть нам в Telegram
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
