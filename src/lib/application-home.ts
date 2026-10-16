/** The return address for this open page's client-side navigation; no browser storage or cookies. */
type ApplicationWindow = Window & { __portfolioApplicationHome?: string };
const HOME_CHANGED = "portfolio:application-home";

export function applicationHome(pathname: string, search: string): string | null {
  const company = pathname.match(/^\/for\/([a-z0-9-]+)\/?$/)?.[1];
  if (!company) return null;
  const params = new URLSearchParams(search);
  const ref = params.get("ref") ?? params.get("utm_source");
  const query = ref === null ? "" : `?${new URLSearchParams({ ref: ref.trim().slice(0, 60) })}`;
  return `/for/${company}${query}`;
}

export function rememberApplicationHome(pathname: string, search: string): void {
  const home = applicationHome(pathname, search);
  const w = window as ApplicationWindow;
  if (!home || w.__portfolioApplicationHome === home) return;
  w.__portfolioApplicationHome = home;
  window.dispatchEvent(new Event(HOME_CHANGED));
}

export function currentApplicationHome(): string {
  return applicationHome(window.location.pathname, window.location.search)
    ?? (window as ApplicationWindow).__portfolioApplicationHome
    ?? "/";
}

export function subscribeApplicationHome(callback: () => void): () => void {
  window.addEventListener(HOME_CHANGED, callback);
  return () => window.removeEventListener(HOME_CHANGED, callback);
}
