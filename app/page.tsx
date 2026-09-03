import Link from "next/link";
import type { Metadata } from "next";
import { TelegramWidget } from "@/components/telegram-widget";
import { PostCover } from "@/components/post-cover";
import { AuthorByline, type BylineAuthor } from "@/components/author-byline";
import { getAllNews } from "@/lib/news";
import path from "path";
import { getAllArticles, getArticleSlugs, getArticleBySlug, type Article } from "@/lib/articles";
import { getAllAuthors, altNames } from "@/lib/authors";
import { seoBazaOrganization, seoBazaWebSite } from "@/lib/organization";
import { getCategoryDisplayName } from "@/lib/taxonomy";

// Everything else (title, OG, …) is inherited from app/layout.tsx; this only
// adds the hreflang pair with the English homepage at /en.
export const metadata: Metadata = {
  alternates: {
    canonical: "https://seobaza.com.ua/",
    languages: {
      uk: "https://seobaza.com.ua/",
      en: "https://seobaza.com.ua/en",
      "x-default": "https://seobaza.com.ua/",
    },
  },
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const newsUrl = (item: { year: string; month?: string; slug: string }) =>
  item.month
    ? `/news/${item.year}/${item.month}/${item.slug}`
    : `/news/${item.year}/${item.slug}`;

export default function Home() {
  // Map author display names → on-site page + avatar so cards can show a byline.
  const authorIndex = new Map<string, { slug: string; image?: string }>();
  for (const a of getAllAuthors()) {
    authorIndex.set(a.name.toLowerCase(), { slug: a.slug, image: a.image });
    for (const alt of altNames(a.alternateName)) {
      authorIndex.set(alt.toLowerCase(), { slug: a.slug, image: a.image });
    }
  }
  const resolveAuthor = (name?: string): BylineAuthor => {
    const display = name?.trim() || "SEO BAZA";
    const match = authorIndex.get(display.toLowerCase());
    return { name: display, slug: match?.slug, image: match?.image };
  };

  // Newest content to surface on the homepage (both fetchers return date-desc).
  const latestNews = getAllNews().filter((n) => n.type === "news").slice(0, 7);
  const leadStory = latestNews[0];
  const secondaryStories = latestNews.slice(1, 5);
  const moreNews = latestNews.slice(5, 7);
  // Exclude the scaffold/example article from the homepage feature.
  const latestArticles = getAllArticles()
    .filter((a) => a.slug !== "example-article")
    .slice(0, 3);

  // 3 latest knowledge-base guides (same card treatment as articles).
  const kbDir = path.join(process.cwd(), "content/knowledge-base");
  const latestKnowledgeBase = getArticleSlugs(kbDir)
    .map((slug) => {
      try {
        return getArticleBySlug(slug, kbDir);
      } catch {
        return null;
      }
    })
    .filter((a): a is Article => a !== null && a.status !== "draft")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Sitewide WebSite + Organization JSON-LD — only on the homepage.
          Two nodes with their own @ids; the Organization is the shared
          definition from lib/organization.ts (also used on /about, /en, /en/about). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [seoBazaWebSite(), seoBazaOrganization("uk")],
          }),
        }}
      />
      {/* Hero Section — present in the page but visually hidden (display:none).
          Kept in the DOM so the h1 and brand copy stay for crawlers. */}
      <section className="hidden mb-10 animate-fade-in" aria-hidden="true">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            property="name"
            className="text-4xl sm:text-5xl md:text-6xl font-display mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
          >
            SEO BAZA
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Українське SEO-ком'юніті · 600+ матеріалів · новини, гайди та місячні дайджести
          </p>

          {/* CTA buttons — immediate paths into the content */}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
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
          </div>
        </div>
      </section>

      {/* Featured news — magazine layout: one lead story + secondary list */}
      {leadStory && (
        <section className="mb-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-display">Останні новини</h2>
            <Link href="/news" className="text-sm text-primary hover:text-accent transition-colors">
              Усі новини →
            </Link>
          </div>

          <div
            className="grid gap-6 lg:grid-cols-2"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta
              itemProp="numberOfItems"
              content={String(1 + secondaryStories.length)}
            />

            {/* Lead story — large cover */}
            <div
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="1" />
              <link itemProp="url" href={`https://seobaza.com.ua${newsUrl(leadStory)}`} />
              <Link href={newsUrl(leadStory)} className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-secondary/20 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <PostCover
                      src={leadStory.image}
                      alt={leadStory.title}
                      label={leadStory.category ? getCategoryDisplayName(leadStory.category) : undefined}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {leadStory.category && (
                      <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {getCategoryDisplayName(leadStory.category)}
                      </span>
                    )}
                    <h3
                      itemProp="name"
                      className="font-display text-xl sm:text-2xl leading-snug transition-colors group-hover:text-accent line-clamp-3"
                    >
                      {leadStory.title}
                    </h3>
                    {leadStory.description && (
                      <p className="mt-3 text-muted-foreground line-clamp-2">
                        {leadStory.description}
                      </p>
                    )}
                    <div className="mt-4">
                      <AuthorByline
                        author={resolveAuthor(leadStory.author)}
                        date={leadStory.date}
                        readingTime={leadStory.readingTime}
                        linkAuthor={false}
                      />
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Secondary stories — compact rows with thumbnail */}
            <div className="grid content-start gap-3">
              {secondaryStories.map((item, i) => (
                <div
                  key={item.slug}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <meta itemProp="position" content={String(i + 2)} />
                  <link itemProp="url" href={`https://seobaza.com.ua${newsUrl(item)}`} />
                  <Link href={newsUrl(item)} className="group block">
                    <article className="flex items-stretch gap-4 overflow-hidden rounded-xl border border-border bg-secondary/20 p-3 transition-all hover:border-accent/50 hover:bg-secondary/40">
                      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg sm:w-28">
                        <PostCover
                          src={item.image}
                          alt={item.title}
                          label={item.category ? getCategoryDisplayName(item.category) : undefined}
                          sizes="120px"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        {item.category && (
                          <span className="mb-1 text-xs font-medium text-primary">
                            {getCategoryDisplayName(item.category)}
                          </span>
                        )}
                        <h3
                          itemProp="name"
                          className="font-medium leading-snug transition-colors group-hover:text-accent line-clamp-2"
                        >
                          {item.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <time dateTime={item.date}>{formatDate(item.date)}</time>
                          {item.readingTime && (
                            <>
                              <span>·</span>
                              <span>{item.readingTime} хв</span>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Extra headlines — text strip under the featured grid */}
          {moreNews.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {moreNews.map((item) => (
                <Link
                  key={item.slug}
                  href={newsUrl(item)}
                  className="group flex items-baseline gap-2 rounded-lg border border-border/60 bg-secondary/10 px-4 py-3 transition-all hover:border-accent/50 hover:bg-secondary/30"
                >
                  <span className="mt-0.5 text-accent">›</span>
                  <span className="font-medium leading-snug transition-colors group-hover:text-accent line-clamp-2">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
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
                <Link href={`/articles/${article.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-secondary/20 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <PostCover
                        src={article.image}
                        alt={article.title}
                        label={article.category ? getCategoryDisplayName(article.category) : undefined}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {article.category && (
                        <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {getCategoryDisplayName(article.category)}
                        </span>
                      )}
                      <h3
                        itemProp="name"
                        className="mb-2 font-display text-lg leading-snug transition-colors group-hover:text-accent line-clamp-3"
                      >
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {article.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4">
                        <AuthorByline
                          author={resolveAuthor(article.author)}
                          date={article.date}
                          readingTime={article.readingTime}
                          linkAuthor={false}
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {latestKnowledgeBase.length > 0 && (
        <section className="mb-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-display">База знань</h2>
            <Link href="/knowledge-base" className="text-sm text-primary hover:text-accent transition-colors">
              Уся база знань →
            </Link>
          </div>
          <div
            className="grid sm:grid-cols-3 gap-4"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="numberOfItems" content={String(latestKnowledgeBase.length)} />
            {latestKnowledgeBase.map((item, i) => (
              <div
                key={item.slug}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(i + 1)} />
                <link itemProp="url" href={`https://seobaza.com.ua/knowledge-base/${item.slug}`} />
                <Link href={`/knowledge-base/${item.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-secondary/20 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <PostCover
                        src={item.image}
                        alt={item.title}
                        label="Гайд"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Гайд
                      </span>
                      <h3
                        itemProp="name"
                        className="mb-2 font-display text-lg leading-snug transition-colors group-hover:text-accent line-clamp-3"
                      >
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-auto pt-4">
                        <AuthorByline
                          author={resolveAuthor(item.author)}
                          date={item.date}
                          readingTime={item.readingTime}
                          linkAuthor={false}
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Community band — Telegram + YouTube side by side */}
      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-display mb-6 text-center">
          Спільнота SEO BAZA
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* Telegram */}
          <div className="flex h-full min-w-0 flex-col rounded-2xl p-6 border border-border bg-secondary/30 transition-theme hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 duration-300">
            <h3 className="text-xl font-display mb-1">
              Найактивніше — в Телеграмі
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Щоденні новини, обговорення та анонси спільноти
            </p>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-xl">
                <TelegramWidget />
              </div>
            </div>
            <div className="mt-4 text-center">
              <a
                href="https://t.me/SEOBAZA"
                target="_blank"
                className="text-sm text-primary hover:text-accent underline transition-colors"
              >
                Підписатися в Telegram →
              </a>
            </div>
          </div>

          {/* YouTube */}
          <div className="flex h-full min-w-0 flex-col rounded-2xl p-6 border border-border bg-secondary/30 transition-theme hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 duration-300">
            <h3 className="text-xl font-display mb-1">
              SEO BAZA на YouTube
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Доповіді, розбори та інтерв&apos;ю від спільноти
            </p>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/SWM1Cgd0QpE"
                title="RAG для SEO. Що працює насправді? Запис стріму SEO Baza"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-auto pt-4 text-center">
              <a
                href="https://www.youtube.com/@SEOBAZA"
                target="_blank"
                className="text-sm text-primary hover:text-accent underline transition-colors"
              >
                Переглянути всі відео на каналі →
              </a>
            </div>
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/seobaza.png"
                  srcSet="/_next/image?url=%2Fseobaza.png&w=256&q=75 1x, /_next/image?url=%2Fseobaza.png&w=384&q=75 2x"
                  alt="SEO Baza logo"
                  width={192}
                  height={192}
                  fetchPriority="high"
                  className="w-full h-full object-cover"
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
              <strong>Богдан Красніцький:</strong>
            </p>
            <blockquote className="pl-4 border-l-4 border-accent italic text-muted-foreground mb-6">
              Сьогодні в мене День народження. ЗБІР! Майстерня, R&amp;D, щось
              наше буде літати ще краще, а спати нам всім від цього стане трохи
              спокійніше.
            </blockquote>
            <div className="flex justify-center mb-4">
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fbogdan.krasnitskiy%2Fposts%2Fpfbid0W8C5A4SCEr693U7AUhKaQDuRr53k479iMc3esXQPmD8N1vJSZQVQmdvQXbtjw1Ael&show_text=true&width=500"
                width="500"
                height="640"
                style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
            <p className="text-center text-muted-foreground mb-6">
              Банка збору:{" "}
              <a
                href="https://send.monobank.ua/jar/4CcgPhKY6N"
                target="_blank"
                className="text-primary hover:text-accent underline transition-colors"
              >
                send.monobank.ua/jar/4CcgPhKY6N
              </a>
            </p>
          </div>
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
