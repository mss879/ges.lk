"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, CircleCheck, MessageCircle, RotateCcw, X } from "lucide-react";
import EstimateCard from "./EstimateCard";
import type { ChatPublicConfig, ChatTurn } from "@/lib/chat/types";

const AssistantMessage = dynamic(() => import("./AssistantMessage"), {
  ssr: false,
  loading: () => <span className="opacity-60">…</span>,
});

/**
 * The GES Solar Assistant — a floating chat panel on every public page
 * (ported from the Makro build, restyled for GES).
 *
 * State and why it lives where it does:
 *  - `sessionId` + `token` in localStorage, so a visitor who navigates or comes
 *    back later continues the same conversation. The token is the credential;
 *    see src/lib/chat/store.ts.
 *  - The transcript in React, restored from the server the first time the
 *    panel opens (so a reload doesn't lose the conversation).
 *  - Nothing in cookies, so the widget adds no weight to page requests.
 */

const STORAGE_KEY = "ges-chat";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type Stored = { sessionId: string; token: string; savedAt: number };

function readStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (!parsed.sessionId || !parsed.token) return null;
    if (parsed.savedAt && Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
    return { sessionId: parsed.sessionId, token: parsed.token, savedAt: parsed.savedAt ?? Date.now() };
  } catch {
    // Private mode, disabled storage or a corrupted value: just start fresh.
    return null;
  }
}

function writeStored(value: Stored | null) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* see readStored */
  }
}

export default function ChatWidget() {
  const [config, setConfig] = useState<ChatPublicConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const session = useRef<Stored | null>(null);
  const hydrated = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Is the agent switched on? (CDN-cached, so this is cheap.)
  useEffect(() => {
    session.current = readStored();
    let cancelled = false;
    fetch("/api/chat/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ChatPublicConfig | null) => {
        if (!cancelled && data) setConfig(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Step aside while the mobile navigation drawer is open (SiteNav flags it on <html>).
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setNavOpen(root.dataset.navOpen === "true");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-nav-open"] });
    return () => observer.disconnect();
  }, []);

  const scrollToEnd = useCallback(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (open) scrollToEnd();
  }, [messages, open, sending, scrollToEnd]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Phones: the panel is full-screen, so stop the page scrolling behind it.
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 640px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Restore the transcript the first time the panel opens.
  useEffect(() => {
    if (!open || hydrated.current || !session.current) return;
    hydrated.current = true;
    const s = session.current;
    setRestoring(true);
    void (async () => {
      try {
        const params = new URLSearchParams({ sessionId: s.sessionId, token: s.token });
        const res = await fetch(`/api/chat?${params}`);
        if (res.status === 404) {
          session.current = null;
          writeStored(null);
          return;
        }
        if (!res.ok) return;
        const data = (await res.json()) as { messages?: ChatTurn[] };
        if (data.messages?.length) setMessages(data.messages);
      } catch {
        /* a failed restore just shows a fresh greeting — the chat still works */
      } finally {
        setRestoring(false);
      }
    })();
  }, [open]);

  const send = useCallback(
    async (preset?: string) => {
      const text = (preset ?? input).trim();
      if (!text || sending) return;

      setInput("");
      setError(null);
      setSending(true);
      setMessages((prev) => [...prev, { role: "user", content: text }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            sessionId: session.current?.sessionId,
            token: session.current?.token,
            path: window.location.pathname,
          }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.status === 404) {
          // The stored conversation is gone (deleted in the admin panel). Drop
          // it so the next message starts a new one.
          session.current = null;
          writeStored(null);
          setError("That conversation has ended. Send your message again to start a new one.");
          return;
        }
        if (!res.ok) {
          setError(data.error ?? "Something went wrong. Please try again.");
          return;
        }
        if (data.sessionId && data.token) {
          session.current = { sessionId: data.sessionId, token: data.token, savedAt: Date.now() };
          writeStored(session.current);
          hydrated.current = true;
        }
        const replies: ChatTurn[] = data.messages ?? [];
        if (replies.length) setMessages((prev) => [...prev, ...replies]);
      } catch {
        setError("We couldn't reach the assistant. Please check your connection.");
      } finally {
        setSending(false);
        inputRef.current?.focus({ preventScroll: true });
      }
    },
    [input, sending],
  );

  const startOver = () => {
    if (messages.length > 0 && !confirm("Start a new conversation? This one stays saved with GES.")) return;
    session.current = null;
    writeStored(null);
    hydrated.current = true;
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  if (!config?.enabled) return null;

  const hasUserMessages = messages.some((m) => m.role === "user");
  const launcherHidden = navOpen && !open;

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ges-chat-panel"
        aria-label={open ? `Close the ${config.agentName}` : `Chat with the ${config.agentName}`}
        aria-hidden={launcherHidden}
        tabIndex={launcherHidden ? -1 : undefined}
        className={`group fixed bottom-5 right-5 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-[#00AC4E] text-white shadow-[0_18px_40px_-12px_rgba(0,64,31,0.7)] transition-all duration-300 hover:bg-[#019544] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00AC4E]/30 sm:bottom-6 sm:right-6 cursor-pointer ${
          launcherHidden ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        } ${open ? "max-sm:hidden" : ""}`}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-full bg-stone-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 max-sm:hidden">
            Ask about solar
          </span>
        )}
      </button>

      {/* Panel */}
      <div
        id="ges-chat-panel"
        role="dialog"
        aria-label={config.agentName}
        aria-modal="false"
        hidden={!open}
        className="fixed z-[10001] flex flex-col overflow-hidden bg-white shadow-[0_30px_70px_-20px_rgba(4,20,11,0.55)] max-sm:inset-0 sm:bottom-24 sm:right-6 sm:h-[min(38rem,calc(100svh-8rem))] sm:w-[24rem] sm:rounded-3xl sm:border sm:border-stone-200"
      >
        <header className="flex items-center gap-3 bg-gradient-to-r from-[#04140B] to-[#01401F] px-4 py-3.5 text-white">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
            <Image src="/icon.png" alt="" width={28} height={28} className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold">{config.agentName}</p>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E2FF3A]" /> Usually replies instantly
            </p>
          </div>
          <button
            type="button"
            onClick={startOver}
            title="New conversation"
            aria-label="Start a new conversation"
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#f8f9fa] px-4 py-4" aria-live="polite">
          {/* Greeting (from the admin settings) */}
          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm leading-relaxed text-stone-700 shadow-sm ring-1 ring-stone-200/70">
              {config.greeting}
            </div>
          </div>

          {!hasUserMessages && !restoring && config.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {config.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  disabled={sending}
                  className="rounded-full border border-[#00AC4E]/30 bg-white px-3 py-1.5 text-left text-xs font-bold text-[#007a37] transition-colors hover:bg-[#00AC4E]/5 disabled:opacity-50 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={`${i}-${m.created_at ?? ""}`} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={m.role === "user" ? "max-w-[85%]" : "w-full max-w-[92%]"}>
                <div
                  className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-2xl rounded-tr-md bg-[#00AC4E] text-white whitespace-pre-wrap break-words"
                      : "rounded-2xl rounded-tl-md bg-white text-stone-700 shadow-sm ring-1 ring-stone-200/70"
                  }`}
                >
                  {m.role === "user" ? m.content : <AssistantMessage content={m.content} />}
                </div>
                {m.role === "assistant" && m.estimate && <EstimateCard estimate={m.estimate} compact />}
                {m.role === "assistant" && m.leadSaved && (
                  <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#00AC4E]/10 px-2.5 py-1 text-[11px] font-bold text-[#007a37]">
                    <CircleCheck className="h-3.5 w-3.5" /> Sent to the GES team
                  </p>
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="flex gap-1.5 rounded-2xl rounded-tl-md bg-white px-3.5 py-3 shadow-sm ring-1 ring-stone-200/70">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00AC4E]"
                    style={{ animationDelay: `${i * 160}ms` }}
                  />
                ))}
                <span className="sr-only">The assistant is typing.</span>
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="border-t border-stone-200 bg-white p-3 max-sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends, Shift+Enter adds a line.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder="Ask about solar, or give your roof size…"
              aria-label="Your message"
              className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-[#00AC4E] focus:bg-white"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00AC4E] text-white transition-colors hover:bg-[#019544] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 px-1 text-[10px] leading-snug text-stone-400">
            AI assistant — it can make mistakes. Chats are saved so our team can follow up.{" "}
            <Link href="/privacy-policy" className="underline hover:text-stone-600">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
