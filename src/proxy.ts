import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Next 16 renamed the `middleware` convention to `proxy`.
 *
 * Runs on /admin only. Public pages read Supabase through a cookie-less client
 * and need no session, so they are served straight from the CDN without
 * invoking this (or Supabase) at all.
 *
 * Three jobs here:
 *  1. Refresh the Supabase session cookie, so admin Server Components and
 *     Server Actions (which POST to their own /admin page) see a valid token.
 *  2. Bounce anonymous visitors away from /admin before any admin page renders.
 *     The real authorisation still lives in RLS — this is just the front door.
 *  3. Mark every admin response noindex for search engines. /admin is never
 *     listed in robots.txt or the sitemap, so it isn't advertised anywhere.
 */
const NOINDEX = "noindex, nofollow, noarchive";

function noindex<T extends NextResponse>(response: T): T {
  response.headers.set("X-Robots-Tag", NOINDEX);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Without a backend configured there is no session to refresh. Send anyone
  // hitting /admin to the login screen, which explains the setup steps.
  if (!isSupabaseConfigured()) {
    if (pathname !== "/admin/login") {
      return noindex(NextResponse.redirect(new URL("/admin/login", request.url)));
    }
    return noindex(NextResponse.next());
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Refreshes the auth token as a side effect — do not remove.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname !== "/admin/login" && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return noindex(NextResponse.redirect(loginUrl));
  }

  // Already signed in? Skip the login screen.
  if (pathname === "/admin/login" && user) {
    return noindex(NextResponse.redirect(new URL("/admin", request.url)));
  }

  return noindex(response);
}

export const config = {
  // `/admin/:path*` also matches `/admin` itself.
  matcher: ["/admin/:path*"],
};
