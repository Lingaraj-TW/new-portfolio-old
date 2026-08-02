export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_VALUE = "true";
export const ADMIN_SESSION_MAX_AGE = 86_400;

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "profeed2024";

export function credentialsMatch(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function isAdminSessionCookie(value: string | undefined): boolean {
  return value === ADMIN_SESSION_VALUE;
}
