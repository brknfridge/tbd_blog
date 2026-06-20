import { getStore } from "@netlify/blobs";

// GET  /api/views?slug=my-post  -> read the count (no increment)
// POST /api/views?slug=my-post  -> increment, then return the new count
export default async (req) => {
  const url = new URL(req.url);
  const slug = (url.searchParams.get("slug") || "").trim();

  // Only allow simple slugs so the key can't be abused.
  if (!/^[a-z0-9-]{1,128}$/i.test(slug)) {
    return new Response(JSON.stringify({ error: "invalid slug" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const store = getStore("post-views");
  let count = Number((await store.get(slug)) || 0);

  if (req.method === "POST") {
    count += 1;
    await store.set(slug, String(count));
  }

  return new Response(JSON.stringify({ slug, count }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
};

export const config = { path: "/api/views" };
