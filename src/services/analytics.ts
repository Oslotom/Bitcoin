declare global {
  interface Window { plausible?: ((name: string, options?: { props: Record<string, string> }) => void) & { q?: unknown[]; init?: (options?: Record<string, unknown>) => void; o?: Record<string, unknown> }; }
}

// No personal information, form fields or exact amounts. Tracking is off until configured.
export function trackEvent(name: string, props: Record<string, string> = {}) {
  if (typeof window === 'undefined' || navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
  window.dispatchEvent(new CustomEvent('bitcoin:analytics', { detail: { name, props } }));
  window.plausible?.(name, { props });
}

export function initializeAnalytics() {
  const scriptUrl = import.meta.env.VITE_PLAUSIBLE_SCRIPT_URL;
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (!scriptUrl || !domain || document.querySelector('script[data-bitcoin-analytics]') || navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
  try {
    const url = new URL(scriptUrl);
    if (url.protocol !== 'https:') return;
    const script = document.createElement('script');
    script.defer = true; script.src = url.href; script.dataset.domain = domain; script.dataset.bitcoinAnalytics = 'true';
    window.plausible = window.plausible || Object.assign(function (...args: unknown[]) { window.plausible!.q!.push(args); }, { q: [] });
    window.plausible.init = window.plausible.init || ((options) => { window.plausible!.o = options || {}; });
    window.plausible.init();
    document.head.appendChild(script);
  } catch { /* Optional analytics must never affect the page. */ }
}
