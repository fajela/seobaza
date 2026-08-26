/**
 * Внутрішньоконтентний банер поточного лайву. Один на сторінку, вставляється
 * після вступу перед першим H2 через MdxWithLiveBanner. Після стріму зняти
 * або перемкнути текст на запис.
 */
/**
 * Велика версія для головної: обкладинка стріму на всю ширину, як картки
 * новин, з плашкою наживо і підписом.
 */
export function LiveBannerLarge() {
  return (
    <a
      href="/videos/rag-dlia-seo"
      aria-label="Запис стріму RAG для SEO, дивитися"
      className="group relative block mb-8 max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-xl hover:border-accent/50 transition-all duration-300"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/videos/rag-dlia-seo.jpg"
        alt="Обкладинка живого стріму RAG для SEO від SEO Baza"
        className="w-full h-auto object-cover"
        width={1200}
        height={630}
      />
      <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 text-white text-sm font-semibold px-3 py-1.5">
        ▶ Запис стріму
      </span>
      <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-10 pb-4 text-white">
        <span className="block font-bold text-lg sm:text-xl">
          RAG для SEO. Що працює насправді?
        </span>
        <span className="block text-sm text-white/85">
          Саша Хілова, Віра Сєчкіна і Олеся Коробка. Розіграш квитка на SERP Conf. Дивитися →
        </span>
      </span>
    </a>
  );
}

export function LiveBanner() {
  return (
    <aside
      aria-label="Анонс стріму"
      className="not-prose my-10 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4"
    >
      <a href="/videos/rag-dlia-seo" className="shrink-0 block w-44 sm:w-52">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/videos/rag-dlia-seo.jpg"
          alt="Обкладинка живого стріму RAG для SEO від SEO Baza"
          className="w-full h-auto rounded-lg border border-border"
          width={1200}
          height={630}
        />
      </a>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          ▶ Запис стріму
        </p>
        <p className="font-bold text-lg leading-snug m-0">
          RAG для SEO. Що працює насправді?
        </p>
        <p className="text-sm text-muted-foreground m-0">
          Саша Хілова, Віра Сєчкіна і Олеся Коробка. Розіграш квитка на SERP Conf.
        </p>
      </div>
      <a
        href="/videos/rag-dlia-seo"
        className="shrink-0 self-start sm:self-center px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Дивитися →
      </a>
    </aside>
  );
}
