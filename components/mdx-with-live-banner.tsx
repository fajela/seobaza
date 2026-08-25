import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { ComponentProps } from "react";
import { LiveBanner } from "./live-banner";

type MdxComponents = ComponentProps<typeof MDXRemote>["components"];

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
};

/**
 * Рендерить MDX-тіло з одним LiveBanner після вступу (перед першим H2).
 * Якщо H2 немає, банер стає після всього тексту.
 */
export function MdxWithLiveBanner({
  source,
  components,
}: {
  source: string;
  components?: MdxComponents;
}) {
  const splitAt = source.search(/^## /m);
  const intro = splitAt === -1 ? source : source.slice(0, splitAt);
  const rest = splitAt === -1 ? null : source.slice(splitAt);

  return (
    <>
      <MDXRemote source={intro} components={components} options={options} />
      <LiveBanner />
      {rest !== null && (
        <MDXRemote source={rest} components={components} options={options} />
      )}
    </>
  );
}
