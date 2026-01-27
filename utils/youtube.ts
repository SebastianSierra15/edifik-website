const ensureProtocol = (url: string) =>
  url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;

export function extractYouTubeVideoId(input: string | null | undefined) {
  if (!input) return null;

  const raw = input.trim();
  if (!raw) return null;

  try {
    const url = new URL(ensureProtocol(raw));
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const idFromPath = url.pathname.split("/")[1];
      return idFromPath || null;
    }

    if (host !== "youtube.com" && host !== "m.youtube.com") {
      return null;
    }

    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2] || null;
    }

    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] || null;
    }

    return null;
  } catch {
    return null;
  }
}

export function isValidYouTubeUrl(input: string | null | undefined) {
  return extractYouTubeVideoId(input) !== null;
}

export function getYouTubeEmbedUrl(input: string | null | undefined) {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

