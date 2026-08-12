import React from "react";

// Wraps each occurrence of the given word/phrase in an orange highlight span
// (.hl-ed). Matching is case-insensitive; the original casing is preserved.
export default function highlight(text?: string, words: string | string[] = []) {
  const list = (Array.isArray(words) ? words : [words]).filter(Boolean);
  if (!list.length || !text) return text;
  const escaped = list.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    list.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
      <span className="hl-ed" key={i}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
