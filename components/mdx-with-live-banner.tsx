import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { ComponentProps } from "react";
import { LiveBanner } from "./live-banner";
import { PartnerBanner } from "./partner-banner";
import { PARTNER } from "@/lib/partner";

type MdxComponents = ComponentProps<typeof MDXRemote>["components"];

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
};

/**
 * Рендерить MDX-тіло з банерами після вступу (перед першим H2):
 * банер партнера місяця або LiveBanner (поки є партнер, LiveBanner не показуємо).
 * Якщо H2 немає, банери стають після всього тексту.
 * Банер партнера показується вдруге ближче до кінця (правило Олесі 16.10).
 */
export function MdxWithLiveBanner({
  source,
  components,
  banner = true,
  partner = false,
}: {
  source: string;
  components?: MdxComponents;
  /** false = рендерити MDX без банера лайву (сторінки зі спонсором тощо). */
  banner?: boolean;
  /** true = банер партнера місяця після вступу. */
  partner?: boolean;
}) {
  // Поки є партнер місяця, анонс стріму не показуємо (правило Олесі 15.10).
  banner = banner && !PARTNER;
  partner = partner && !!PARTNER;
  if (!banner && !partner) {
    return <MDXRemote source={source} components={components} options={options} />;
  }
  let splitAt = source.search(/^## /m);
  // Без H2 банер партнера йде після першого абзацу (якщо це звичайний текст
  // і далі є ще текст), щоб другий банер у кінці не стояв поруч з першим.
  if (splitAt === -1 && partner) {
    const lead = source.match(/^\s*[^\r\n<!|>\-*#][^\r\n]*(?:\r?\n(?!\r?\n)[^\r\n]*)*\r?\n\r?\n(?=\S)/);
    if (lead) splitAt = lead[0].length;
  }
  const intro = splitAt === -1 ? source : source.slice(0, splitAt);
  const rest = splitAt === -1 ? null : source.slice(splitAt);

  // Другий банер партнера ближче до кінця: перед останнім H2, якщо після
  // першого їх ще щонайменше два; інакше після всього тексту.
  let middle = rest;
  let tail: string | null = null;
  if (partner && rest !== null) {
    const heads = [...rest.matchAll(/^## /gm)].map((m) => m.index ?? 0);
    if (heads.length >= 3) {
      const at = heads[heads.length - 1];
      middle = rest.slice(0, at);
      tail = rest.slice(at);
    }
  }

  return (
    <>
      <MDXRemote source={intro} components={components} options={options} />
      {partner && <PartnerBanner className="my-10" />}
      {banner && <LiveBanner />}
      {middle !== null && (
        <MDXRemote source={middle} components={components} options={options} />
      )}
      {partner && rest !== null && <PartnerBanner className="my-10" />}
      {tail !== null && (
        <MDXRemote source={tail} components={components} options={options} />
      )}
    </>
  );
}
