import type { ReactNode } from "react";

/**
 * Акцентний абзац у MDX: зелений жирний рядок, яким сторінка відео веде на
 * статтю (або стаття на стрім). Заміна хаку <p style={{...}}>, який MDX
 * на сторінках відео рендерив без стилю.
 *   <Callout>Стрім розгорнутий у статтю: <a href="/articles/...">назва</a>.</Callout>
 */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <p className="my-6 font-bold text-accent [&_a]:underline [&_a]:decoration-accent/50 hover:[&_a]:decoration-accent">
      {children}
    </p>
  );
}
