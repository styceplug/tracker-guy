"use client";
// Shared admin state: the data from Firestore, which screen is open, toasts and unsaved-change guards.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import { CONTENT_DOC, defaultContent, mergeContent, type Content } from "@/lib/content";
import {
  defaultSettings, listCustomers, listInvoices, listSubmissions, loadSettings,
  type Customer, type Invoice, type InvoiceSettings, type Submission,
} from "@/lib/invoice";
import { firebaseError } from "./ui";

export type Tab = "home" | "submissions" | "invoices" | "customers" | "content" | "settings";
/** view: "order" | "edit" | "new" | "detail"; id: the record id */
export type Route = { tab: Tab; view?: string; id?: string };

type ToastT = { id: number; text: string; type: "ok" | "err" };

type Store = {
  invoices: Invoice[];
  customers: Customer[];
  submissions: Submission[];
  settings: InvoiceSettings;
  tiers: Content["plans"]["tiers"];
  loaded: boolean;
  reload: () => Promise<void>;
  route: Route;
  nav: (r: Route) => void;
  draft: Invoice | null;
  startInvoice: (inv: Invoice) => void;
  toast: (text: string, type?: "ok" | "err") => void;
  fail: (e: unknown) => void;
  setGuard: (fn: (() => boolean) | null) => void;
};

const Ctx = createContext<Store | null>(null);
export const useAdmin = () => useContext(Ctx)!;

const tabs: Tab[] = ["home", "submissions", "invoices", "customers", "content", "settings"];

function parseHash(): Route {
  const [tab, view, id] = window.location.hash.replace(/^#\/?/, "").split("/");
  return tabs.includes(tab as Tab) ? { tab: tab as Tab, view, id } : { tab: "home" };
}
const toHash = (r: Route) => "#/" + [r.tab, r.view, r.id].filter(Boolean).join("/");

async function loadTiers(): Promise<Content["plans"]["tiers"]> {
  const snap = await getDoc(doc(getFirestore(firebaseApp()), CONTENT_DOC.collection, CONTENT_DOC.id));
  const raw = snap.exists() ? snap.data().data : null;
  return mergeContent(defaultContent, raw ? JSON.parse(raw) : null).plans.tiers;
}

export function AdminStore({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [settings, setSettings] = useState<InvoiceSettings>(defaultSettings);
  const [tiers, setTiers] = useState(defaultContent.plans.tiers);
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState<Route>({ tab: "home" });
  const [draft, setDraft] = useState<Invoice | null>(null);
  const [toasts, setToasts] = useState<ToastT[]>([]);
  const guard = useRef<(() => boolean) | null>(null);

  const toast = useCallback((text: string, type: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), type === "err" ? 7000 : 3500);
  }, []);
  const fail = useCallback((e: unknown) => toast(firebaseError(e), "err"), [toast]);

  const reload = useCallback(async () => {
    const [inv, cus, sub, set, tr] = await Promise.allSettled([listInvoices(), listCustomers(), listSubmissions(), loadSettings(), loadTiers()]);
    if (inv.status === "fulfilled") setInvoices(inv.value);
    if (cus.status === "fulfilled") setCustomers(cus.value);
    if (sub.status === "fulfilled") setSubmissions(sub.value);
    if (set.status === "fulfilled") setSettings(set.value);
    if (tr.status === "fulfilled") setTiers(tr.value);
    const firstErr = [inv, cus, sub, set].find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
    if (firstErr) fail(firstErr.reason);
    setLoaded(true);
  }, [fail]);

  useEffect(() => { reload(); }, [reload]);

  // Keep the screen in the address bar so Back/Refresh work.
  useEffect(() => {
    const sync = () => setRoute(parseHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const nav = useCallback((r: Route) => {
    if (guard.current?.() && !confirm("You have unsaved changes. Leave this page anyway?")) return;
    guard.current = null;
    const h = toHash(r);
    if (window.location.hash !== h) window.location.hash = h;
    else setRoute(r);
    window.scrollTo({ top: 0 });
  }, []);

  const startInvoice = useCallback((inv: Invoice) => {
    setDraft(inv);
    nav({ tab: "invoices", view: "new" });
  }, [nav]);

  const setGuard = useCallback((fn: (() => boolean) | null) => { guard.current = fn; }, []);

  return (
    <Ctx.Provider value={{ invoices, customers, submissions, settings, tiers, loaded, reload, route, nav, draft, startInvoice, toast, fail, setGuard }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-[84px] z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:px-6" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-[420px] items-center gap-2.5 rounded-[12px] px-4 py-3 text-[14px] font-medium shadow-[0_14px_40px_rgba(25,26,21,.18)] animate-rise ${t.type === "ok" ? "bg-night text-white" : "bg-red-600 text-white"}`}
          >
            <span className={`grid size-5 shrink-0 place-items-center rounded-full ${t.type === "ok" ? "bg-brand" : "bg-white/25"}`}>{t.type === "ok" ? "✓" : "!"}</span>
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
