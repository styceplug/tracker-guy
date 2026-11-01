"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { defaultContent, mergeContent, type Content } from "./content";
import { fetchSavedContent } from "./remoteContent";

const Ctx = createContext<Content>(defaultContent);

export function ContentProvider({ initial, children }: { initial: Content; children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(initial);

  useEffect(() => {
    let alive = true;
    fetchSavedContent().then((saved) => {
      if (!alive || !saved) return;
      const next = mergeContent(defaultContent, saved);
      if (JSON.stringify(next) === JSON.stringify(initial)) return;
      setContent(next);
      document.title = next.seo.title;
      document.querySelector('meta[name="description"]')?.setAttribute("content", next.seo.description);
    });
    return () => { alive = false; };
  }, [initial]);

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
