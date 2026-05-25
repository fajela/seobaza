import Image from "next/image";
import { TelegramWidget } from "@/components/telegram-widget";

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Sitewide WebSite + Organization JSON-LD — only on the homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebSite", "Organization"],
            "@id": "https://seobaza.com.ua/",
            name: "SEO BAZA",
            url: "https://seobaza.com.ua/",
            description:
              "Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом",
            logo: "https://seobaza.com.ua/seobaza.png",
            sameAs: [
              "https://www.youtube.com/c/SEOBAZA",
              "https://t.me/SEOBAZA",
            ],
            creator: {
              "@type": "Person",
              name: "Олеся Коробка",
              alternateName: "Olesia Korobka",
              url: "https://olesiakorobka.com",
            },
          }),
        }}
      />
      {/* Hero Section */}
      <section className="mb-16 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            property="name"
            className="text-4xl sm:text-5xl md:text-6xl font-display mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
          >
            SEO BAZA
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Українська SEO-спільнота з найкращими спеціалістами, навчальними
            матеріалами та підтримкою
          </p>
        </div>
      </section>

      {/* Telegram Section */}
      <section className="mb-16">
        <div className="bg-secondary/30 rounded-2xl p-8 border border-border transition-theme hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 duration-300">
          <h2 className="text-2xl sm:text-3xl font-display mb-6 text-center">
            Найбільша активність у SEO BAZA — в Телеграмі
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <TelegramWidget />
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="mb-16">
        <div className="bg-secondary/30 rounded-2xl p-8 border border-border transition-theme hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 duration-300">
          <h2 className="text-2xl sm:text-3xl font-display mb-4 text-center">
            SEO BAZA також є в YouTube
          </h2>
          <p className="text-center text-lg mb-6 text-muted-foreground">
            SEO 2025
          </p>
          <div className="aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/h42FByRSnSI?si=1fbkdZ2bz8rjOa0T"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-16">
        <div className="bg-secondary/30 rounded-2xl p-8 border border-border transition-theme">
          <div className="grid md:grid-cols-[1fr,auto] gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display mb-4">
                Що таке SEO Baza
              </h2>
              <p property="description" className="text-lg leading-relaxed">
                Це в першу чергу чудові люди, круті SEO-спеціалісти, українське
                ком'юніті. А формально це ресурс з SEO з новинами, учбовими
                матеріалами,{" "}
                <a
                  href="https://www.youtube.com/@SEOBAZA"
                  target="_blank"

                  className="text-primary hover:text-accent underline transition-colors"
                >
                  відео-каналом
                </a>{" "}
                і{" "}
                <a
                  href="https://t.me/SEOBAZA"
                  target="_blank"

                  className="text-primary hover:text-accent underline transition-colors"
                >
                  телеграм-каналом
                </a>
                .<br />
                <br />І найкращою в світі спільнотою! 💛
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
                <Image
                  property="logo"
                  src="https://seobaza.com.ua/seobaza.png"
                  alt="SEO Baza logo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 192px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Section */}
      <section id="charity" className="mb-16">
        <div className="bg-secondary/30 rounded-2xl p-8 border border-border transition-theme">
          <h2 className="text-2xl sm:text-3xl font-display mb-6">
            SEOшники-волонтери, яким можна задонатити
          </h2>
          <div className="mb-6">
            <p className="text-lg mb-4">
              <strong>Тетяна Поклад:</strong>
            </p>
            <blockquote className="pl-4 border-l-4 border-accent italic text-muted-foreground mb-6">
              Потрібна допомога на ремонт авто з 67 ОМБр!
            </blockquote>
            <div className="flex justify-center">
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpokladt%2Fposts%2Fpfbid0279zHuZGq3HxZosoY5QmS55LoaQ6U1cKd7VoYA8T8wHMvzYwME3E5aJ868F4hyUB2l&show_text=true&width=500"
                width="500"
                height="387"
                style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          </div>
          <div className="mt-8 p-6 bg-background rounded-xl border border-border">
            <h3 className="text-xl font-display mb-3">Додавайте свої</h3>
            <p className="text-muted-foreground">
              Пишіть мені в тг{" "}
              <a
                href="https://t.me/fajela"
                target="_blank"

                className="text-primary hover:text-accent underline transition-colors"
              >
                @fajela
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Creator microdata — homepage only. The WebSite/Organization in
          layout.tsx is the publisher; this declares the human creator. */}
      <span
        className="hidden"
        itemProp="creator"
        itemScope
        itemType="https://schema.org/Person"
      >
        <link itemProp="url" href="https://olesiakorobka.com" />
        <link itemProp="sameAs" href="https://seobaza.com.ua/authors/olesia-korobka" />
        <meta itemProp="name" content="Олеся Коробка" />
        <meta itemProp="alternateName" content="Olesia Korobka" />
        <meta itemProp="jobTitle" content="Засновниця SEO BAZA" />
      </span>
    </div>
  );
}
