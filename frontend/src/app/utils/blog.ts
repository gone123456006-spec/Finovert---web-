import API_BASE from "../../config/api";

/** Shape shared by mock posts and API posts (Mongo returns `_id`, not `id`). */
export type BlogLike = {
  id?: string;
  _id?: string;
  slug?: string;
  title?: string;
  image?: string;
  date?: string;
  createdAt?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400";

/** Resolves relative upload paths returned by the API against the API origin. */
export function blogImageSrc(image?: string) {
  if (!image) return FALLBACK_IMAGE;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `${API_BASE}${image.startsWith("/") ? image : `/${image}`}`;
}

export function blogId(post: BlogLike) {
  return post.slug || post._id || post.id || "";
}

export function blogHref(post: BlogLike) {
  return `/blog/${blogId(post)}`;
}

export function blogKey(post: BlogLike, index: number) {
  return blogId(post) || `${post.title ?? "post"}-${index}`;
}

export function formatBlogDate(post: BlogLike) {
  if (post.date) return post.date;
  if (!post.createdAt) return "Recently";
  const parsed = new Date(post.createdAt);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
