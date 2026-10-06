"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * An assistant reply rendered as light Markdown (bold, lists, links). Split
 * out of the widget so react-markdown only downloads when a reply is shown.
 * Internal links use next/link; outside links open in a new tab.
 */
export default function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="chat-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href} className="font-bold text-[#007a37] underline">
                {children}
              </Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer" className="font-bold text-[#007a37] underline">
                {children}
              </a>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
