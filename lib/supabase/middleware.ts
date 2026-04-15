import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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

  if (!isSupabaseConfigured()) {
    const path = request.nextUrl.pathname;
    if (
      (path.startsWith("/admin") && !path.startsWith("/admin/login")) ||
      (path.startsWith("/portal") && !path.startsWith("/portal/login"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = path.startsWith("/portal") ? "/portal/login" : "/admin/login";
      url.searchParams.set("misconfigured", "1");
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
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

  if (path.startsWith("/admin/login") && user && isAdminUser(user)) {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith("/admin") ? next : "/admin";
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
