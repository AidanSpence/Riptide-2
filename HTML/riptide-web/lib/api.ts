const API = process.env.NEXT_PUBLIC_API_URL!;

export async function signup(body: { email: string; username: string; password: string }) {
  const r = await fetch(`${API}/api/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function login(email: string, password: string) {
  const r = await fetch(`${API}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw await r.json();
  const { access, refresh } = await r.json();
  sessionStorage.setItem("access", access);
  sessionStorage.setItem("refresh", refresh);
}

export function logout() {
  sessionStorage.removeItem("access");
  sessionStorage.removeItem("refresh");
}

async function refreshAccess() {
  const r = await fetch(`${API}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: sessionStorage.getItem("refresh") }),
  });
  if (!r.ok) {
    logout();
    throw new Error("Session expired");
  }
  sessionStorage.setItem("access", (await r.json()).access);
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const go = () =>
    fetch(`${API}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${sessionStorage.getItem("access")}` },
    });
  let r = await go();
  if (r.status === 401) {
    await refreshAccess();
    r = await go();
  }
  return r;
}