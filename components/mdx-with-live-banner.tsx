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
  const splitAt = source.search(/^## /m);
  const intro = splitAt === -1 ? source : source.slice(0, splitAt);
  const rest = splitAt === -1 ? null : source.slice(splitAt);

  return (
    <>
      <MDXRemote source={intro} components={components} options={options} />
      {partner && <PartnerBanner className="my-10" />}
      {banner && <LiveBanner />}
      {rest !== null && (
        <MDXRemote source={rest} components={components} options={options} />
      )}
    </>
  );
}
