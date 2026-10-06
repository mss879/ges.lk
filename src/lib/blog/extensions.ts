import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import StarterKit from "@tiptap/starter-kit";
import { Callout } from "@/lib/blog/callout";

/** Links may only point to web pages, email, phone, somewhere on this site, or a heading on the page. */
export const ALLOWED_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

/**
 * The blog's document model, shared by the admin editor, the server-side check
 * on save and the public renderer, so all three agree on what an article may
 * contain: paragraphs, H2–H4, bold, italic, underline, strike, inline code,
 * links, lists, quotes, callouts, code blocks (used for diagrams), rules,
 * tables and images (with an optional caption, stored as the image title).
 */
export const blogExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https", "mailto", "tel"],
      isAllowedUri: (url) => ALLOWED_LINK.test(url),
    },
  }),
  Image.configure({ inline: false, allowBase64: false }),
  TableKit.configure({ table: { resizable: false } }),
  Callout,
];
