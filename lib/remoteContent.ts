// Reads the saved website content from Firestore with a plain HTTPS request,
// so visitors do not have to download the Firebase SDK.
// Used at build time (bakes the latest content into the HTML) and in the browser (shows edits instantly).
import { CONTENT_DOC } from "./content";
import { firebaseConfig, firebaseReady } from "./firebase";

export async function fetchSavedContent(): Promise<unknown | null> {
  if (!firebaseReady) return null;
  const url =
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/` +
    `${CONTENT_DOC.collection}/${CONTENT_DOC.id}?key=${firebaseConfig.apiKey}`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
    if (!res.ok) return null;
    const json = await res.json();
    const raw = json?.fields?.data?.stringValue;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
