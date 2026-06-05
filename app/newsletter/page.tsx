import { pageMeta } from "@/lib/page-metadata";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata = pageMeta({
  title: "Розсилка SEO BAZA",
  description:
    "Підпишіться на email-розсилку SEO BAZA: новини SEO, розбори оновлень Google і AI-пошуку та навчальні матеріали українською.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Розсилка SEO BAZA
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Найважливіше зі світу SEO, прямо на вашу пошту. Те саме, що ми пишемо
          в Telegram, тільки в зручному форматі листа і без поспіху.
        </p>

        <ul className="mb-10 space-y-2 text-foreground">
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>Розбори оновлень Google, AI-пошуку та LLM без води і паніки</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>Практичні матеріали і кейси від української SEO-спільноти</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent">→</span>
            <span>Чесний скептичний погляд, а не переказ офіційних заяв Google</span>
          </li>
        </ul>

        <NewsletterForm
          title="Підписатися на розсилку"
          description="Без спаму. Відписатися можна будь-коли одним кліком."
        />
      </div>
    </div>
  );
}
