export type DeviceKind = "mobile" | "tablet" | "desktop" | "unknown";

export function deviceFromUserAgent(ua: string): DeviceKind {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(s)) return "mobile";
  if (s) return "desktop";
  return "unknown";
}

export function collectClientContext() {
  if (typeof window === "undefined") {
    return { device: "unknown" as DeviceKind, referrer: "", viewport: "" };
  }
  return {
    device: deviceFromUserAgent(navigator.userAgent),
    referrer: document.referrer || "",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
}
