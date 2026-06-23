import type { NormalizedUrl } from "./types";

const INTERNAL_PROTOCOLS = new Set(["chrome:", "chrome-extension:", "about:", "edge:", "brave:"]);

export function normalizeUrl(input: string | undefined): NormalizedUrl {
  const url = input ?? "";

  if (!url) {
    return {
      url,
      domain: "",
      hostname: "",
      path: "",
      searchableUrl: "",
      isInternal: false
    };
  }

  try {
    const parsed = new URL(url);
    const isInternal = INTERNAL_PROTOCOLS.has(parsed.protocol);

    if (parsed.protocol === "file:") {
      return {
        url,
        domain: "local-files",
        hostname: "local-files",
        path: decodeURIComponent(parsed.pathname),
        searchableUrl: `local-files${decodeURIComponent(parsed.pathname)}`,
        isInternal: false
      };
    }

    if (isInternal) {
      const domain = parsed.protocol.replace(":", "");
      return {
        url,
        domain,
        hostname: domain,
        path: parsed.pathname,
        searchableUrl: url.replace(/^[a-z-]+:\/\//, ""),
        isInternal: true
      };
    }

    const hostname = parsed.hostname;
    const domain = hostname === "localhost"
      ? parsed.port
        ? `${hostname}:${parsed.port}`
        : hostname
      : hostname.replace(/^www\./, "");
    const path = parsed.pathname || "/";
    const searchAndHash = `${parsed.search}${parsed.hash}`;

    return {
      url,
      domain,
      hostname,
      path,
      searchableUrl: `${domain}${path}${searchAndHash}`,
      isInternal: false
    };
  } catch {
    return {
      url,
      domain: "",
      hostname: "",
      path: "",
      searchableUrl: url,
      isInternal: false
    };
  }
}

export function sameRegistrableDomain(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
