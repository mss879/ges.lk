import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex justify-center mb-8">
          <Image src="/logo.webp" alt="GES" width={160} height={44} className="h-10 w-auto object-contain" />
        </Link>

        <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <h1 className="font-display text-xl font-black tracking-tight text-stone-900">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-stone-500 font-medium">
            Manage inquiries, the CRM pipeline and projects.
          </p>

          {configured ? (
            // LoginForm reads ?next= via useSearchParams, which needs a boundary
            // because this page is prerendered.
            <Suspense fallback={<div className="mt-6 h-52 animate-pulse rounded-xl bg-stone-100" />}>
              <LoginForm />
            </Suspense>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-900">Backend not connected yet</p>
              <ol className="mt-2.5 list-decimal space-y-1.5 pl-4 text-xs font-medium leading-relaxed text-amber-800">
                <li>
                  Run the files in <code className="rounded bg-amber-100 px-1">supabase/migrations/</code> against
                  your Supabase project, in order.
                </li>
                <li>
                  Copy <code className="rounded bg-amber-100 px-1">.env.local.example</code> to{" "}
                  <code className="rounded bg-amber-100 px-1">.env.local</code> and fill in your project URL
                  and anon key.
                </li>
                <li>Restart the dev server.</li>
              </ol>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs font-semibold text-stone-400">
          <Link href="/" className="hover:text-stone-600 transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
