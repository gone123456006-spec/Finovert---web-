import API_BASE from "../../config/api";

const TOKEN_KEY = "finovert_admin_token";
const SESSION_KEY = "finovert_admin_session";
const LEGACY_KEY = "finovert_admin_session";

export type AdminRole = "main_admin" | "sub_admin";

export type AdminUser = {
  name: string;
  username: string;
};

export type AdminSession = {
  role: AdminRole;
  user: AdminUser;
  loggedInAt: number;
};

export function getAdminToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveAdminSession(role: AdminRole, user: AdminUser, token: string) {
  const session: AdminSession = { role, user, loggedInAt: Date.now() };
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {}
}

export function readAdminSession(): AdminSession | null {
  try {
    if (!getAdminToken()) return null;
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session?.role || !session?.user) return null;
    return session;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {}
}

export async function adminFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAdminToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(input, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    clearAdminSession();
    window.dispatchEvent(new Event("finovert-admin-unauthorized"));
  }

  return res;
}

export async function restoreAdminSession(): Promise<AdminSession | null> {
  const local = readAdminSession();
  if (!local) {
    clearAdminSession();
    return null;
  }

  try {
    const res = await adminFetch(`${API_BASE}/api/auth/me`);
    if (!res.ok) {
      clearAdminSession();
      return null;
    }
    const data = await res.json();
    return { role: data.role, user: data.user, loggedInAt: local.loggedInAt };
  } catch {
    return local;
  }
}

export async function logoutAdmin() {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, { method: "POST" });
  } catch {}
  clearAdminSession();
}
