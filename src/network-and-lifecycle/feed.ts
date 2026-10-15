import { z } from "zod";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  sourceUrl: string;
}

const jsonHeaders = { Accept: "application/json" };

export const feedConfig = {
  apiUrl:
    "https://en.wikipedia.org/w/rest.php/v1/search/page?q=incategory%3APerfumery&limit=15",
  sourceName: "Wikipedia",
  requestOptions: {
    web: { headers: jsonHeaders },
    native: {
      headers: {
        ...jsonHeaders,
        "User-Agent": "AromaFlow/1.0 (educational fragrance reader)",
      },
    },
  },
};

const feedSchema = z.object({
  pages: z.array(
    z.object({
      id: z.number().int(),
      key: z.string(),
      title: z.string(),
      excerpt: z.string(),
      description: z.string().nullable().optional(),
    }),
  ),
});
export type FeedResponse = z.infer<typeof feedSchema>;

function plainText(text: string) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export async function readPosts(data: unknown): Promise<Post[]> {
  const response = await feedSchema.safeParseAsync(data);
  if (!response.success)
    throw new Error("The article source returned an unexpected response");
  const posts = response.data.pages.map((page) => ({
    id: page.id,
    userId: 0,
    title: page.title,
    body: plainText(page.excerpt || page.description || ""),
    sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.key)}`,
  }));
  return [...new Map(posts.map((post) => [post.id, post])).values()];
}
