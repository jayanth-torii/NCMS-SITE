"use client";

import { useEffect, useState } from "react";

// Fetches live data from the backend on mount. Falls back to the provided
// static JSON immediately (renders instantly), then swaps in the live data
// when the backend responds — the same pattern NDC uses.
export function useLiveData<T>(fetcher: () => Promise<T | null>, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((live) => {
        if (cancelled) return;
        if (live !== null && live !== undefined) {
          setData(live);
          setIsLive(true);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
    // Intentionally run once on mount — callers pass a stable fetcher.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLive, error };
}
