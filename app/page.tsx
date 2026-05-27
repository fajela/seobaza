import Image from "next/image";
import Link from "next/link";
import { TelegramWidget } from "@/components/telegram-widget";
import { getAllNews } from "@/lib/news";
import { getAllArticles } from "@/lib/articles";
import { getCategoryDisplayName } from "@/lib/taxonomy";

export default function Home() {
  // Newest content to surface on the homepage (both fetchers return date-desc).
  const latestNews = getAllNews().filter((n) => n.type === "news").slice(0, 6);
  // Exclude the scaffold/example article from the homepage feature.
  const latestArticles = getAllArticles()
    .filter((a) => a.slug !== "example-article")
    .slice(0, 3);

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

          {/* CTA buttons — immediate paths into the content */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/articles"
              className="px-5 py-2.5 rounded-lg bg-accent text-background font-medium hover:bg-accent/90 transition-colors"
            >
              Читати статті
            </Link>
            <Link
              href="/news"
              className="px-5 py-2.5 rounded-lg border border-border font-medium hover:border-accent/50 hover:text-accent transition-colors"
            >
              Останні новини
            </Link>
            <Link
              href="/category"
              className="px-5 py-2.5 rounded-lg border border-border font-medium hover:border-accent/50 hover:text-accent transition-colors"
            >
              Категорії
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Українське SEO-ком'юніті · 600+ матеріалів · новини, гайди та місячні дайджести
          </p>
        </div>
      </section>

      {/* Latest news */}
      {latestNews.length > 0 && (
        <section className="mb-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-display">Останні новини</h2>
            <Link href="/news" className="text-sm text-primary hover:text-accent transition-colors">
              Усі новини →
            </Link>
          </div>
          <div
            className="grid gap-3"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="numberOfItems" content={String(latestNews.length)} />
            {latestNews.map((item, i) => {
              const url = item.month
                ? `/news/${item.year}/${item.month}/${item.slug}`
                : `/news/${item.year}/${item.slug}`;
              return (
                <div
                  key={item.slug}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <meta itemProp="position" content={String(i + 1)} />
                  <link itemProp="url" href={`https://seobaza.com.ua${url}`} />
                  <Link href={url} className="block group">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all">
                      <div className="flex-1 min-w-0">
                        {item.category && (
                          <span className="inline-block mb-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            {getCategoryDisplayName(item.category)}
                          </span>
                        )}
                        <h3
                          itemProp="name"
                          className="font-medium group-hover:text-accent transition-colors line-clamp-2"
                        >
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <time dateTime={item.date}>
                            {new Date(item.date).toLocaleDateString("uk-UA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                          {item.readingTime && (
                            <>
                              <span>·</span>
                              <span>{item.readingTime} хв</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Latest articles */}
      {latestArticles.length > 0 && (
        <section className="mb-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-display">Свіжі статті</h2>
            <Link href="/articles" className="text-sm text-primary hover:text-accent transition-colors">
              Усі статті →
            </Link>
          </div>
          <div
            className="grid sm:grid-cols-3 gap-4"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="numberOfItems" content={String(latestArticles.length)} />
            {latestArticles.map((article, i) => (
              <div
                key={article.slug}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(i + 1)} />
                <link itemProp="url" href={`https://seobaza.com.ua/articles/${article.slug}`} />
                <Link href={`/articles/${article.slug}`} className="block group h-full">
                  <div className="h-full p-5 rounded-xl border border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40 transition-all">
                    {article.category && (
                      <span className="inline-block mb-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {getCategoryDisplayName(article.category)}
                      </span>
                    )}
                    <h3
                      itemProp="name"
                      className="font-display text-lg mb-2 group-hover:text-accent transition-colors line-clamp-3"
                    >
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.description}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

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
            Доповіді, розбори та інтерв'ю від спільноти
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
          <div className="text-center mt-6">
            <a
              href="https://www.youtube.com/@SEOBAZA"
              target="_blank"
              className="text-sm text-primary hover:text-accent underline transition-colors"
            >
              Переглянути всі відео на каналі →
            </a>
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
