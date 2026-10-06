import type { JSONContent } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { ElementType, ReactNode } from "react";
import { CALLOUT_VARIANTS, type CalloutVariant } from "@/lib/blog/callout";
import { ALLOWED_LINK, blogExtensions } from "@/lib/blog/extensions";
import { isBlogImage } from "@/lib/blog/images";
import { createHeadingIdFactory } from "@/lib/blog/text";
import { SITE_URL } from "@/lib/site";

/**
 * An article body, rendered on the server from the editor's JSON: only the
 * node types the editor allows exist, so no raw HTML ever reaches the page.
 *
 * Headings get ids (so "#anchor" links and tables of contents work), links are
 * checked again and outside links open in a new tab, images must come from the
 * blog's own storage (or the migrated /blogs/ folder), and tables are wrapped
 * so they scroll sideways on phones. Styling lives in `.blog-prose`
 * (globals.css), shared with the admin editor.
 */
export function renderArticle(content: JSONContent) {
  const headingId = createHeadingIdFactory();

  return renderToReactElement({
    content,
    extensions: blogExtensions,
    options: {
      nodeMapping: {
        heading: ({ node, children }: { node: PMNode; children?: ReactNode }) => {
          const level = Math.min(4, Math.max(2, Number(node.attrs.level) || 2));
          const Tag = `h${level}` as ElementType;
          return <Tag id={headingId(node.textContent)}>{children}</Tag>;
        },
        image: ({ node }: { node: PMNode }) => {
          const { src, alt, title, width, height } = node.attrs as Record<string, string | number | null>;
          if (!isBlogImage(src)) return null;
          return (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={typeof alt === "string" ? alt : ""}
                width={typeof width === "number" ? width : undefined}
                height={typeof height === "number" ? height : undefined}
                loading="lazy"
                decoding="async"
              />
              {typeof title === "string" && title && <figcaption>{title}</figcaption>}
            </figure>
          );
        },
        table: ({ children }: { children?: ReactNode }) => (
          <div className="blog-table">
            <table>
              <tbody>{children}</tbody>
            </table>
          </div>
        ),
        callout: ({ node, children }: { node: PMNode; children?: ReactNode }) => {
          const variant = (CALLOUT_VARIANTS as readonly string[]).includes(node.attrs.variant)
            ? (node.attrs.variant as CalloutVariant)
            : "tip";
          return <div data-callout={variant}>{children}</div>;
        },
      },
      markMapping: {
        link: ({ mark, children }: { mark: { attrs: Record<string, unknown> }; children?: ReactNode }) => {
          const href = typeof mark.attrs.href === "string" ? mark.attrs.href : "";
          if (!ALLOWED_LINK.test(href)) return <>{children}</>;
          const external = /^https?:\/\//i.test(href) && !href.startsWith(SITE_URL);
          return (
            <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {children}
            </a>
          );
        },
      },
    },
  });
}
