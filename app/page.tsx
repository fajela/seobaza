export default function Home() {
  return (
    <div vocab="https://schema.org/" typeof="WebSite Organization" className="space-y-12">
      {/* RDF & Schema.org metadata */}
      <link property="url" href="https://seobaza.com.ua/" />
      <meta property="name" content="SEO BAZA" />
      <meta property="description" content="Ресурс з SEO з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом. І найкращою в світі спільнотою!" />

      {/* Dublin Core metadata */}
      <div style={{ display: 'none' }}>
        <meta property="dc:title" content="SEO BAZA - українська SEO-спільнота" />
        <meta property="dc:creator" typeof="Person" resource="https://olesiakorobka.com" content="Olesia Korobka" />
        <meta property="dc:subject" content="SEO, маркетинг, оптимізація" />
        <meta property="dc:language" content="uk" />
        <link property="dc:publisher" href="https://seobaza.com.ua" />
      </div>

      {/* Structured data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SEO BAZA',
            url: 'https://seobaza.com.ua',
            logo: 'https://seobaza.com.ua/seobaza.png',
            description: 'Українська SEO-спільнота з новинами, учбовими матеріалами, відео-каналом і телеграм-каналом',
            sameAs: [
              'https://www.youtube.com/c/SEOBAZA',
              'https://t.me/SEOBAZA',
            ],
            founder: {
              '@type': 'Person',
              name: 'Olesia Korobka',
              url: 'https://olesiakorobka.com',
            },
          }),
        }}
      />

      {/* Hero Section - Cursor style */}
      <section className="text-center px-4 py-32 md:py-48">
        <h1 className="text-6xl md:text-8xl font-semibold mb-8 text-black dark:text-white tracking-tight leading-none">
          SEO BAZA
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Українська SEO-спільнота з новинами, навчальними матеріалами та найкращими людьми
        </p>
      </section>

      {/* Main Content - Single Column */}
      <div className="max-w-4xl mx-auto px-4 space-y-20">
        {/* About Section */}
        <article className="text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black dark:text-white">
            Що таке SEO Baza
          </h2>
          <div className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto space-y-4 leading-relaxed">
            <p>
              Це в першу чергу чудові люди, круті SEO-спеціалісти, українське ком'юніті.
            </p>
            <p>
              А формально це ресурс з SEO з новинами, учбовими матеріалами,{" "}
              <a
                href="https://www.youtube.com/@SEOBAZA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white underline"
              >
                відео-каналом
              </a>{" "}
              і{" "}
              <a
                href="https://t.me/SEOBAZA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white underline"
              >
                телеграм-каналом
              </a>.
            </p>
            <p className="text-xl font-medium text-black dark:text-white">
              І найкращою в світі спільнотою! 💛
            </p>
          </div>
        </article>

        {/* Telegram Section */}
        <article>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black dark:text-white text-center">
            Найбільша активність у SEO BAZA — в Телеграмі
          </h2>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black">
            <script
              async
              src="https://telegram.org/js/telegram-widget.js?22"
              data-telegram-post="SEOBAZA/1256"
              data-width="100%"
            />
          </div>
        </article>

        {/* YouTube Section */}
        <article>
          <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-black dark:text-white text-center">
            SEO BAZA також є в YouTube
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">SEO 2025</p>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-black aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/h42FByRSnSI?si=1fbkdZ2bz8rjOa0T"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </article>

        {/* Charity Section */}
        <article id="charity" className="border border-gray-200 dark:border-gray-800 rounded-lg p-8 md:p-12 bg-white dark:bg-black">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black dark:text-white">
            SEOшники-волонтери, яким можна задонатити
          </h2>
          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
            <span className="font-medium text-black dark:text-white">Тетяна Поклад:</span>{" "}
            <span>Потрібна допомога на ремонт авто з 67 ОМБр!</span>
          </p>
          <div className="mb-8">
            <iframe
              src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpokladt%2Fposts%2Fpfbid0279zHuZGq3HxZosoY5QmS55LoaQ6U1cKd7VoYA8T8wHMvzYwME3E5aJ868F4hyUB2l&show_text=true&width=500"
              width="100%"
              height="387"
              style={{ border: "none", overflow: "hidden", maxWidth: "500px" }}
              scrolling="no"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Додавайте свої</h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Пишіть мені в тг{" "}
              <a
                href="https://t.me/fajela"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white underline"
              >
                @fajela
              </a>
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
