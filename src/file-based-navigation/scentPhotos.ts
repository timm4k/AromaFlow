const commonsApi = "https://commons.wikimedia.org/w/api.php";
const imageHosts = new Set(["upload.wikimedia.org", "thumb.wikimedia.org"]);
const sourceHosts = new Set(["commons.wikimedia.org"]);

export interface ScentPhoto {
  uri: string;
  sourceUrl: string;
  author: string;
  license: string;
}

interface CommonsImage {
  thumburl?: string;
  descriptionurl?: string;
  mime?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, { value?: string }>;
}

interface CommonsResponse {
  error?: { info?: string };
  query?: { pages?: { index?: number; imageinfo?: CommonsImage[] }[] };
}

function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trustedUrl(
  value: string | undefined,
  hosts: Set<string>,
): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.has(url.hostname);
  } catch {
    return false;
  }
}

export async function fetchScentPhoto(
  subject: string,
  signal?: AbortSignal,
): Promise<ScentPhoto | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${subject} filetype:bitmap -intitle:illustration -intitle:drawing -intitle:Köhler -intitle:Vanessa -intitle:Bombus`,
    gsrnamespace: "6",
    gsrlimit: "5",
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|dimensions",
    iiurlwidth: "640",
    format: "json",
    formatversion: "2",
    origin: "*",
  });
  const response = await fetch(`${commonsApi}?${params}`, { signal });
  if (!response.ok) throw new Error("Photo source is temporarily unavailable");
  const data: CommonsResponse | null = await response.json();
  if (!data || typeof data !== "object") return null;
  if (data.error) throw new Error("Photo search is temporarily unavailable");
  if (!Array.isArray(data.query?.pages)) return null;
  const pages = data.query.pages
    .filter((page) => page && typeof page === "object")
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  for (const page of pages) {
    const image = page.imageinfo?.[0];
    const license = image?.extmetadata?.LicenseShortName?.value;
    const author = image?.extmetadata?.Artist?.value;
    if (
      !image ||
      typeof license !== "string" ||
      typeof author !== "string" ||
      !/^(CC BY(?:-SA)? [\d.]+|CC0(?: [\d.]+)?|Public domain)$/i.test(license)
    )
      continue;
    if (
      !trustedUrl(image.thumburl, imageHosts) ||
      !trustedUrl(image.descriptionurl, sourceHosts)
    )
      continue;
    if (
      typeof image.mime !== "string" ||
      !image.mime.match(/^image\/(jpeg|png|webp)$/) ||
      (image.width ?? 0) < 300 ||
      (image.height ?? 0) < 200
    )
      continue;
    return {
      uri: image.thumburl,
      sourceUrl: image.descriptionurl,
      author: plainText(author),
      license: plainText(license),
    };
  }
  return null;
}
