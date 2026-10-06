import type { JSONContent } from "@tiptap/core";

/** "Operations & Maintenance on Water" → "operations-and-maintenance-on-water". */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** All the text of a node, in reading order. */
export function plainText(node: JSONContent | null | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  const inner = (node.content ?? []).map(plainText);
  const block = ["paragraph", "heading", "blockquote", "listItem", "codeBlock", "tableCell", "tableHeader"].includes(
    node.type ?? "",
  );
  return inner.join(block ? "" : " ") + (block ? "\n" : "");
}

export function wordCount(doc: JSONContent | null | undefined) {
  return plainText(doc).split(/\s+/).filter(Boolean).length;
}

/** At about 200 words a minute, never less than one minute. */
export function readingMinutes(doc: JSONContent | null | undefined) {
  return Math.max(1, Math.round(wordCount(doc) / 200));
}

/**
 * Gives every heading a unique id, in document order. Shared by the renderer
 * and anything that links to headings, so `#anchor` links always resolve.
 */
export function createHeadingIdFactory() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text.trim()) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };
}

/** The first couple of sentences, for listings when no excerpt was written. */
export function autoExcerpt(doc: JSONContent | null | undefined, max = 180) {
  const text = plainText(doc).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
