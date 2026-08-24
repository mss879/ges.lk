import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Next 16 renamed the `middleware` convention to `proxy`.
 *
 * Two jobs here:
 *  1. Refresh the Supabase session cookie on every matched request, so Server
 *     Components always see a valid token.
 *  2. Bounce anonymous visitors away from /admin before any admin page renders.
 *     The real authorisation still lives in RLS — this is just the front door.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Without a backend configured there is no session to refresh. Send anyone
  // hitting /admin to the login screen, which explains the setup steps.
  if (!isSupabaseConfigured()) {
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
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

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already signed in? Skip the login screen.
  if (pathname === "/admin/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals and static assets, so the session cookie
     * is refreshed on normal page loads without burning work on images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|ico)$).*)",
  ],
};
