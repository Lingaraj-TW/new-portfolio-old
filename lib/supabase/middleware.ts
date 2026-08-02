import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  isAdminSessionCookie,
} from "@/lib/admin/session";
import { isSupabaseConfigured } from "./config";

function isAdminUser(user: {
  app_metadata?: Record<string, unknown>;
}): boolean {
  return user.app_metadata?.role === "admin";
}

function isCustomerUser(user: {
  app_metadata?: Record<string, unknown>;
}): boolean {
  return user.app_metadata?.role === "customer";
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const cookieAdmin = isAdminSessionCookie(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!isSupabaseConfigured()) {
    if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
      if (!cookieAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", path);
        return NextResponse.redirect(url);
      }
      return response;
    }
    if (path.startsWith("/portal") && !path.startsWith("/portal/login")) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal/login";
      url.searchParams.set("misconfigured", "1");
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/admin/login") && cookieAdmin) {
      const next = request.nextUrl.searchParams.get("next");
      const url = request.nextUrl.clone();
      url.pathname =
        next && next.startsWith("/") ? next : "/admin/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let user: {
    app_metadata?: Record<string, unknown>;
  } | null = null;
  try {
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u;
  } catch {
    user = null;
  }

  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (cookieAdmin) {
      return response;
    }
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (!isAdminUser(user)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "not_admin");
      return NextResponse.redirect(url);
    }
  }

  if (
    path.startsWith("/admin/login") &&
    (cookieAdmin || (user && isAdminUser(user)))
  ) {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith("/") ? next : "/admin/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/portal") && !path.startsWith("/portal/login")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (!isCustomerUser(user)) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal/login";
      url.searchParams.set("error", "not_customer");
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/portal/login") && user && isCustomerUser(user)) {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith("/portal") ? next : "/portal";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
