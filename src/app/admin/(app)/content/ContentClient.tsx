"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, RotateCcw, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slotsForPage, type SiteImageSlot, type SitePage } from "@/data/siteImageSlots";
import type { StoredSiteImage } from "./page";

const BUCKET = "site-images";

const TABS: { key: SitePage; label: string; href: string }[] = [
  { key: "homepage", label: "Homepage", href: "/" },
  { key: "about", label: "About", href: "/about" },
];

const ASPECT: Record<SiteImageSlot["aspect"], string> = {
  wide: "aspect-video",
  portrait: "aspect-[4/5]",
  banner: "aspect-[16/8]",
};

export default function ContentClient({ stored }: { stored: StoredSiteImage[] }) {
  const [tab, setTab] = useState<SitePage>("homepage");
  const [rows, setRows] = useState(stored);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const supabase = createClient();
  const slots = useMemo(() => slotsForPage(tab), [tab]);

  const rowFor = (slot: SiteImageSlot) =>
    rows.find((r) => r.page === slot.page && r.key === slot.key);

  const currentUrl = (slot: SiteImageSlot) => rowFor(slot)?.url ?? slot.defaultUrl;
  const isCustom = (slot: SiteImageSlot) => Boolean(rowFor(slot)?.storage_path);

  /** Upload a replacement and point the slot at it. */
  const replace = async (slot: SiteImageSlot, file: File | undefined) => {
    if (!file) return;
    setBusyKey(slot.key);
    setMessage(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slot.page}/${slot.key}-${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (upErr) {
      setMessage({ kind: "err", text: upErr.message });
      setBusyKey(null);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const existing = rowFor(slot);
    const previousPath = existing?.storage_path ?? null;

    const { data, error } = await supabase
      .from("site_images")
      .upsert(
        {
          page: slot.page,
          key: slot.key,
          url: publicUrl,
          storage_path: path,
          alt: slot.label,
        },
        { onConflict: "page,key" }
      )
      .select()
      .single();

    if (error || !data) {
      // Do not leave the uploaded file orphaned if the row write failed.
      await supabase.storage.from(BUCKET).remove([path]);
      setMessage({ kind: "err", text: error?.message ?? "Could not save the image." });
      setBusyKey(null);
      return;
    }

    // The old upload is now unreferenced — clean it up.
    if (previousPath && previousPath !== path) {
      await supabase.storage.from(BUCKET).remove([previousPath]);
    }

    const next = data as StoredSiteImage;
    setRows((prev) => {
      const without = prev.filter((r) => !(r.page === slot.page && r.key === slot.key));
      return [...without, next];
    });
    setMessage({ kind: "ok", text: `Updated “${slot.label}”.` });
    setBusyKey(null);
    if (inputs.current[slot.key]) inputs.current[slot.key]!.value = "";
  };

  /** Point the slot back at the image the site ships with. */
  const revert = async (slot: SiteImageSlot) => {
    const existing = rowFor(slot);
    if (!existing || !existing.storage_path) return;
    setBusyKey(slot.key);

    const { data, error } = await supabase
      .from("site_images")
      .upsert(
        { page: slot.page, key: slot.key, url: slot.defaultUrl, storage_path: null, alt: slot.label },
        { onConflict: "page,key" }
      )
      .select()
      .single();

    if (error || !data) {
      setMessage({ kind: "err", text: error?.message ?? "Could not revert." });
      setBusyKey(null);
      return;
    }

    await supabase.storage.from(BUCKET).remove([existing.storage_path]);
    const next = data as StoredSiteImage;
    setRows((prev) => {
      const without = prev.filter((r) => !(r.page === slot.page && r.key === slot.key));
      return [...without, next];
    });
    setMessage({ kind: "ok", text: `Reverted “${slot.label}” to the original.` });
    setBusyKey(null);
  };

  const activeTab = TABS.find((t) => t.key === tab)!;

  return (
    <div className="mt-6">
      {/* tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                tab === t.key
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <a
          href={activeTab.href}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#00AC4E]"
        >
          View page <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {message && (
        <p
          className={`mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold ${
            message.kind === "ok"
              ? "border border-[#00AC4E]/20 bg-[#00AC4E]/10 text-[#007a37]"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* slots */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => {
          const url = currentUrl(slot);
          const custom = isCustom(slot);
          const busy = busyKey === slot.key;

          return (
            <article
              key={slot.key}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div className={`relative ${ASPECT[slot.aspect]} bg-stone-100`}>
                <Image
                  src={url}
                  alt={slot.label}
                  fill
                  sizes="(min-width:1024px) 300px, 45vw"
                  className="object-cover"
                  unoptimized={url.startsWith("http")}
                />
                {custom && (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-[#00AC4E] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                    Replaced
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {slot.section}
                </p>
                <h3 className="mt-0.5 text-sm font-black leading-snug text-stone-900">{slot.label}</h3>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => inputs.current[slot.key]?.click()}
                    disabled={busy}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-stone-900 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-stone-700 disabled:opacity-50 cursor-pointer"
                  >
                    {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    Replace
                  </button>
                  {custom && (
                    <button
                      onClick={() => revert(slot)}
                      disabled={busy}
                      title="Revert to the original image"
                      aria-label={`Revert ${slot.label}`}
                      className="rounded-full border border-stone-200 p-2 text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-800 disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <input
                  ref={(el) => {
                    inputs.current[slot.key] = el;
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  hidden
                  onChange={(e) => replace(slot, e.target.files?.[0])}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
