import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { absoluteUrl } from "@/lib/site";

/**
 * The branded 1200×630 social card behind every opengraph-image.tsx.
 *
 * Deep-forest background, the white GES logo, an eyebrow, the page title and
 * www.ges.lk — over a photo when one is available (the default rooftop shot,
 * or a blog post's JPEG/PNG cover), otherwise over the brand ribbon.
 *
 * Assets live in src/assets/og (next/og can't decode WebP, so these are
 * PNG/JPEG/WOFF) and are listed in next.config.ts outputFileTracingIncludes so
 * images rendered on demand (new blog posts) can still read them on Netlify.
 */

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * next/og only renders PNG, and a photo card as PNG is ~1.2 MB — too heavy for
 * WhatsApp previews (which skip images over roughly 300 KB). Re-encode it as a
 * JPEG with sharp; if sharp isn't available, serve the PNG rather than fail.
 */
// Cards can change when a post is edited (same URL), so cache for a day, not forever.
const CACHE =
  process.env.NODE_ENV === "development"
    ? "no-cache, no-store"
    : "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

async function asJpeg(image: ImageResponse): Promise<Response> {
  const png = Buffer.from(await image.arrayBuffer());
  try {
    const { default: sharp } = await import("sharp");
    const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
    return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg", "Cache-Control": CACHE } });
  } catch (error) {
    console.error("[og] JPEG conversion failed, serving PNG", error);
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": CACHE } });
  }
}

const ASSET_DIR = join(process.cwd(), "src/assets/og");

const assetsPromise = Promise.all([
  readFile(join(ASSET_DIR, "outfit-latin-800-normal.woff")),
  readFile(join(ASSET_DIR, "outfit-latin-600-normal.woff")),
  readFile(join(ASSET_DIR, "plus-jakarta-sans-latin-600-normal.woff")),
  readFile(join(ASSET_DIR, "ges-logo-white.png"), "base64"),
  readFile(join(ASSET_DIR, "og-photo.jpg"), "base64"),
  readFile(join(ASSET_DIR, "ges-symbol.png"), "base64"),
]).then(([outfit800, outfit600, jakarta600, logo, photo, symbol]) => ({
  outfit800,
  outfit600,
  jakarta600,
  logo: `data:image/png;base64,${logo}`,
  photo: `data:image/jpeg;base64,${photo}`,
  symbol: `data:image/png;base64,${symbol}`,
}));

/** The default rooftop photo, for pages that want a photo card. */
export const DEFAULT_PHOTO = "default";

/**
 * Loads a photo for the card as a data URI. Accepts a site path (/blogs/…) or an
 * absolute URL; WebP/AVIF are skipped (unsupported by next/og). Never throws —
 * a card without a photo is better than a failed image.
 */
export async function loadOgPhoto(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  if (/\.(webp|avif)(\?|$)/i.test(src)) return null;
  const type = /\.png(\?|$)/i.test(src) ? "image/png" : "image/jpeg";
  try {
    if (src.startsWith("/")) {
      // At build time the file is on disk; after deploy, public files are only
      // on the CDN, so fall back to fetching it from the live site.
      try {
        const file = await readFile(join(process.cwd(), "public", decodeURIComponent(src)));
        return `data:${type};base64,${file.toString("base64")}`;
      } catch {
        src = absoluteUrl(src);
      }
    }
    const res = await fetch(src, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? type;
    if (!/image\/(jpeg|png)/.test(contentType)) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function titleSize(title: string) {
  if (title.length > 90) return 46;
  if (title.length > 60) return 54;
  if (title.length > 36) return 62;
  return 72;
}

export async function ogImage({
  title,
  eyebrow,
  photo = DEFAULT_PHOTO,
  footnote = "Solar · Battery storage · EV charging · Maintenance",
}: {
  title: string;
  eyebrow?: string;
  /** DEFAULT_PHOTO, a data URI from loadOgPhoto(), or null for the ribbon card. */
  photo?: string | null;
  footnote?: string;
}) {
  const assets = await assetsPromise;
  const background = photo === DEFAULT_PHOTO ? assets.photo : photo;
  const safeTitle = title.length > 120 ? `${title.slice(0, 117).trimEnd()}…` : title;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#04140B",
          backgroundImage: "linear-gradient(135deg, #04140B 0%, #012716 55%, #01401F 100%)",
          fontFamily: "Jakarta",
          color: "white",
        }}
      >
        {background ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={background}
              alt=""
              width={1200}
              height={630}
              style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 1200,
                height: 630,
                display: "flex",
                backgroundImage:
                  "linear-gradient(90deg, rgba(4,20,11,0.97) 0%, rgba(4,20,11,0.9) 42%, rgba(4,20,11,0.45) 75%, rgba(4,20,11,0.25) 100%)",
              }}
            />
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: -140,
                left: 680,
                width: 640,
                height: 640,
                display: "flex",
                borderRadius: 9999,
                backgroundImage: "radial-gradient(circle, rgba(0,172,78,0.35) 0%, rgba(0,172,78,0) 70%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.symbol}
              alt=""
              width={430}
              height={430}
              style={{ position: "absolute", left: 700, top: 100, width: 430, height: 430, opacity: 0.95 }}
            />
          </>
        )}

        {/* Bottom accent bar in the two brand colours */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 10,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, #00AC4E 0%, #00AC4E 55%, #085EAC 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: background ? 820 : 700,
            height: "100%",
            padding: "56px 0 60px 72px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assets.logo} alt="" width={260} height={86} style={{ width: 260, height: 86, objectFit: "contain", objectPosition: "left" }} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {eyebrow ? (
              <div style={{ display: "flex", marginBottom: 22 }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Outfit",
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "#E2FF3A",
                    border: "2px solid rgba(226,255,58,0.45)",
                    borderRadius: 999,
                    padding: "8px 20px",
                  }}
                >
                  {eyebrow}
                </div>
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontFamily: "Outfit",
                fontWeight: 800,
                fontSize: titleSize(safeTitle),
                lineHeight: 1.06,
                letterSpacing: -1,
              }}
            >
              {safeTitle}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#FFFFFF" }}>www.ges.lk</div>
            <div style={{ display: "flex", fontSize: 19, fontWeight: 600, color: "rgba(255,255,255,0.72)" }}>{footnote}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Outfit", data: assets.outfit800, weight: 800, style: "normal" },
        { name: "Outfit", data: assets.outfit600, weight: 600, style: "normal" },
        { name: "Jakarta", data: assets.jakarta600, weight: 600, style: "normal" },
      ],
    },
  );
  return asJpeg(image);
}
