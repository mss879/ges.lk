"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * Client boundary for the chat widget, rendered by the root layout.
 *
 * `ssr: false` can't be used from a Server Component in Next 16, so the dynamic
 * import lives here. The widget is a separate chunk fetched after the page has
 * painted, and its Markdown renderer only loads once a reply is shown — a page
 * nobody chats on pays almost nothing for it. Never shown in the admin area.
 */
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatMount() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <ChatWidget />;
}
