interface Props {
  /** Telegram channel username (e.g. "SEOBAZA") */
  channel: string;
  /** Channel post ID (the Telegram message id) */
  postId: number;
}

/**
 * Placeholder until the MTProto-based comment fetcher is in place.
 *
 * The official Telegram widget does NOT support comments-only embedding —
 * it always shows the post body above the comments. Since the post body is
 * already on this page, we don't want that duplication. Until we build a
 * proper server-side fetcher that hits messages.getDiscussionMessage +
 * messages.getReplies and stores comments locally, just link out to Telegram.
 */
export function TelegramComments({ channel, postId }: Props) {
  // Always link to the real Telegram post. Do NOT use the post's `sourceUrl`
  // frontmatter — that was rewritten to an internal /news/... path during the
  // cross-reference pass and would loop back to this page.
  const url = `https://t.me/${channel}/${postId}`;
  return (
    <section className="mt-12 pt-8 border-t border-border">
      <a
        href={url}
        target="_blank"

        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
        </svg>
        Коментарі в Telegram
      </a>
    </section>
  );
}
