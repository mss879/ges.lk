"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }

    const next = params.get("next");
    router.push(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  };

  const field =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]";

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          className={field}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#00AC4E] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#019544] disabled:opacity-60 cursor-pointer"
      >
        {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {busy ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
