// Blog image resilience helpers.
//
// The static blog images live under /public and are verified to exist, but if a
// doc ever carries a missing/renamed path we swap to a guaranteed-present hero
// image instead of showing a broken-image icon.

export const BLOG_IMG_FALLBACK = "/images/blogs_banner_a494e12d91.png";

/** Attach to <img>/<Image onError> so a failed blog image swaps to the hero. */
export const handleBlogImgError = (
  e: React.SyntheticEvent<HTMLImageElement>
) => {
  const img = e.currentTarget;
  if (!img || img.src.endsWith(BLOG_IMG_FALLBACK)) return;
  img.onerror = null; // prevent fallback-loop if the fallback itself fails
  img.src = BLOG_IMG_FALLBACK;
};
