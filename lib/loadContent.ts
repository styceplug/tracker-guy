import { defaultContent, mergeContent, type Content } from "./content";
import { fetchSavedContent } from "./remoteContent";

/** Defaults with any saved edits laid on top. Runs at build time on the server. */
export async function loadContent(): Promise<Content> {
  return mergeContent(defaultContent, await fetchSavedContent());
}
