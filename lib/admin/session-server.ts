import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  isAdminSessionCookie,
} from "./session";

export function isAdminSessionFromRequest(request: NextRequest): boolean {
  return isAdminSessionCookie(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );
}

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminSessionCookie(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
