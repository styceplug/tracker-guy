"use client";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { CONTENT_DOC, defaultContent, mergeContent, type Content } from "@/lib/content";
import { Icon } from "@/lib/icons";
import { btnGhost, card, inputCls, PageHeader, SaveBar } from "./ui";
import { useAdmin } from "./store";

const iconNames = ["car", "bike", "keke", "truck", "bus", "boat", "fleet", "pin", "bell", "route", "shield", "wrench", "phone", "power", "play", "arrow", "check", "x"];

// Section names shown in the sidebar, in page order.
const sections: { key: keyof Content; label: string; note?: string }[] = [
  { key: "business", label: "Business & contact", note: "Used across the whole site: WhatsApp links, phone, email and footer." },
  { key: "nav", label: "Top menu" },
  { key: "hero", label: "Hero (top of page)" },
  { key: "vehicles", label: "Vehicle types strip" },
  { key: "how", label: "How we protect" },
  { key: "services", label: "Services" },
  { key: "features", label: "Features" },
  { key: "meet", label: "Meet Fawas & coverage" },
  { key: "benefits", label: "Why choose a tracker" },
  { key: "plans", label: "Pricing" },
  { key: "faq", label: "FAQ" },
  { key: "quote", label: "Quote form" },
  { key: "footer", label: "Footer" },
  { key: "socials", label: "Social links" },
  { key: "installForm", label: "Installation form page", note: "The page at /form that you share with clients. It is not in the website menu." },
  { key: "seo", label: "Google / SEO", note: "The browser tab title updates straight away. Google sees the new title and description after the next deploy." },
];

// Friendlier names for some fields. Anything not listed is turned from camelCase into words.
const labels: Record<string, string> = {
  q: "Question", a: "Answer", href: "Link", cta: "Button text", ctaPrimary: "Main button", ctaSecondary: "Second button",
  whatsapp: "WhatsApp number", url: "Website address", sub: "Sub text", on: "Shows as online", warn: "Warning colour",
  chipTitle: "Card title", chipSub: "Card sub text", plan: "Text added to quote message", fee: "Renewal line",
  missing: "Feature not included (shown with an X)", points: "Included points", badge: "Badge", tag: "Price note",
  blurb: "Short description", otherDays: "Install time in other states", sameDay: "Same day states/cities",
  otherStates: "Other states", photoAlt: "Photo description (for screen readers)", planMessage: "Message when a plan button is clicked",
  whatsappIntro: "First line of the WhatsApp message", vehicleOptions: "Vehicle choices", links: "Menu links",
  items: "Items", rows: "Mockup rows", listTitle: "Mockup title", listTag: "Mockup tag", support: "Support cards",
  features: "Feature list", requiredNote: "Required note", requiredError: "Message when a required field is empty",
  emailError: "Message when the email is invalid", successText: "Message after sending", anotherLink: "Send-another link",
  errorText: "Message if sending fails", sendingText: "Button text while sending", submitButton: "Submit button", clearButton: "Clear button",
  title: "Title", description: "Description", text: "Text", label: "Label", name: "Name", price: "Price", eyebrow: "Small heading above title", simNote: "SIM note", tiers: "Trackers", fits: "Vehicle chips",
};

const hints: Record<string, string> = {
  "business.whatsapp": "Digits only, with country code. Example: 2347049381183",
  "business.url": "Used for Google and link previews. Changes apply after the next deploy.",
  "quote.planMessage": "{plan} is replaced with the tracker's \"Text added to quote message\".",
  "plans.tiers.id": "Fixed. \"advanced\" gets the highlighted card style.",
  "nav.links.href": "Fixed. Points to a section of the page.",
};

const readOnly = (path: string) => path === "nav.links.href" || path === "plans.tiers.id";

const nice = (k: string) => labels[k] ?? k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const isLong = (key: string, sample: string) =>
  sample.length > 70 || /^(text|a|note|promise|blurb|description)$/.test(key);

type Val = unknown;

function StringField({ k, path, value, sample, onChange }: { k: string; path: string; value: string; sample: string; onChange: (v: string) => void }) {
  if (k === "icon") {
    return (
      <div className="flex items-center gap-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-brand-l text-brand-d"><Icon name={value} className="size-5" /></span>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          {iconNames.map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>
    );
  }
  if (readOnly(path)) return <input value={value} readOnly className={`${inputCls} bg-lav text-mute`} />;
  return isLong(k, sample || value) ? (
    <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y`} />
  ) : (
    <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
  );
}

function move<T>(arr: T[], i: number, j: number) {
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

function blankLike(t: Val): Val {
  if (typeof t === "string") return "";
  if (typeof t === "boolean") return false;
  if (typeof t === "number") return 0;
  if (Array.isArray(t)) return [];
  if (t && typeof t === "object") return Object.fromEntries(Object.entries(t).map(([k, v]) => [k, k === "icon" ? v : blankLike(v)]));
  return "";
}

function Field({ k, path, value, template, onChange }: { k: string; path: string; value: Val; template: Val; onChange: (v: Val) => void }) {
  const hint = hints[path];

  if (Array.isArray(value)) {
    const tpl = Array.isArray(template) ? template[0] : undefined;
    const objects = tpl !== undefined ? typeof tpl === "object" : typeof value[0] === "object";
    const fixed = path === "nav.links" || path === "plans.tiers"; // these lists keep their length
    return (
      <div className="grid gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold">{nice(k)}</span>
          <span className="text-[12px] text-mute">{value.length} item{value.length === 1 ? "" : "s"}</span>
        </div>
        {value.map((item, i) => (
          <div key={i} className={objects ? "" : "flex items-start gap-2"}>
            {objects ? (
              <details open={isBlank(item)} className="group rounded-[12px] border border-[#eef1f8] bg-lav/50 open:bg-white open:shadow-[0_8px_24px_rgba(25,26,21,.05)]">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-3.5 py-3 [&::-webkit-details-marker]:hidden">
                  <Icon name="chevron" className="size-4 shrink-0 text-mute transition group-open:rotate-90" />
                  {typeof (item as Record<string, unknown>).icon === "string" && (
                    <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-brand-l text-brand-d"><Icon name={String((item as Record<string, unknown>).icon)} className="size-4" /></span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{summaryOf(item) || <span className="text-mute">New item</span>}</span>
                  <span onClick={(e) => e.preventDefault()}>
                    <ItemButtons i={i} n={value.length} fixed={fixed} onMove={(j) => onChange(move(value, i, j))} onRemove={() => onChange(value.filter((_, x) => x !== i))} />
                  </span>
                </summary>
                <div className="border-t border-[#eef1f8] p-3.5">
                  <Field k="" path={path} value={item} template={Array.isArray(template) ? template[i] ?? tpl : tpl} onChange={(v) => onChange(value.map((x, y) => (y === i ? v : x)))} />
                </div>
              </details>
            ) : (
              <>
                <div className="flex-1">
                  <StringField k={k} path={path} value={String(item)} sample={String(tpl ?? "")} onChange={(v) => onChange(value.map((x, y) => (y === i ? v : x)))} />
                </div>
                <ItemButtons i={i} n={value.length} fixed={fixed} onMove={(j) => onChange(move(value, i, j))} onRemove={() => onChange(value.filter((_, x) => x !== i))} />
              </>
            )}
          </div>
        ))}
        {!fixed && (
          <button type="button" onClick={() => onChange([...value, blankLike(tpl ?? "")])} className={`${btnGhost} justify-self-start !py-2`}>
            + Add {objects ? "item" : "line"}
          </button>
        )}
        {hint && <span className="text-[12px] text-mute">{hint}</span>}
      </div>
    );
  }

  if (value && typeof value === "object") {
    const tplObj = (template && typeof template === "object" ? template : {}) as Record<string, Val>;
    return (
      <div className="grid gap-4">
        {Object.entries(value as Record<string, Val>).map(([ck, cv]) => {
          const cpath = path ? `${path}.${ck}` : ck;
          const nested = !!cv && typeof cv === "object" && !Array.isArray(cv);
          return (
            <div key={ck} className={nested ? "rounded-[12px] border border-[#eef1f8] p-4" : ""}>
              {nested && <p className="mb-3 text-[14px] font-semibold">{nice(ck)}</p>}
              <Field k={ck} path={cpath} value={cv} template={tplObj[ck]} onChange={(v) => onChange({ ...(value as object), [ck]: v })} />
            </div>
          );
        })}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2.5 text-[14px] font-medium">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[#54bd95]" />
        {nice(k)}
      </label>
    );
  }

  const fieldPath = path.replace(/\.\d+/g, "");
  return (
    <label className="grid gap-1.5 text-[14px] font-medium">
      {k && <span>{nice(k)}</span>}
      <StringField k={k} path={fieldPath} value={String(value ?? "")} sample={typeof template === "string" ? template : ""} onChange={onChange} />
      {hints[fieldPath] && <span className="text-[12px] font-normal text-mute">{hints[fieldPath]}</span>}
    </label>
  );
}

function summaryOf(item: unknown): string {
  const o = item as Record<string, unknown>;
  for (const k of ["name", "title", "label", "q", "description"]) if (typeof o?.[k] === "string" && o[k]) return String(o[k]);
  const first = Object.entries(o || {}).find(([k, v]) => k !== "icon" && k !== "id" && typeof v === "string" && v);
  return first ? String(first[1]) : "";
}
const isBlank = (item: unknown) => !summaryOf(item);

function ItemButtons({ i, n, fixed, onMove, onRemove }: { i: number; n: number; fixed: boolean; onMove: (j: number) => void; onRemove: () => void }) {
  const b = "grid size-8 place-items-center rounded-lg border border-[#e3e7ef] bg-white text-[13px] text-mute hover:text-ink disabled:opacity-40";
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" title="Move up" className={b} disabled={i === 0} onClick={() => onMove(i - 1)}>↑</button>
      <button type="button" title="Move down" className={b} disabled={i === n - 1} onClick={() => onMove(i + 1)}>↓</button>
      {!fixed && <button type="button" title="Remove" className={`${b} hover:!text-red-600`} onClick={onRemove}>✕</button>}
    </div>
  );
}

export default function ContentEditor() {
  const { reload, toast, fail, setGuard } = useAdmin();
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [section, setSection] = useState<keyof Content>("business");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const db = getFirestore(firebaseApp());
    getDoc(doc(db, CONTENT_DOC.collection, CONTENT_DOC.id))
      .then((snap) => {
        const raw = snap.exists() ? snap.data().data : null;
        const c = mergeContent(defaultContent, raw ? JSON.parse(raw) : null);
        setContent(c);
        setSaved(JSON.stringify(c));
      })
      .catch((e) => {
        fail(e);
        setContent(defaultContent);
        setSaved(JSON.stringify(defaultContent));
      });
  }, [fail]);

  const dirty = useMemo(() => !!content && JSON.stringify(content) !== saved, [content, saved]);

  useEffect(() => {
    setGuard(() => dirty);
    const h = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => { window.removeEventListener("beforeunload", h); setGuard(null); };
  }, [dirty, setGuard]);

  async function save() {
    if (!content) return;
    setBusy(true);
    try {
      const db = getFirestore(firebaseApp());
      await setDoc(doc(db, CONTENT_DOC.collection, CONTENT_DOC.id), {
        data: JSON.stringify(content),
        updatedAt: serverTimestamp(),
        updatedBy: getAuth(firebaseApp()).currentUser?.email || "",
      });
      setSaved(JSON.stringify(content));
      toast("Saved. The website shows the changes on the next page load.");
      reload();
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  if (!content) return <p className="text-mute">Loading content...</p>;
  const meta = sections.find((s) => s.key === section)!;
  const changed = (k: keyof Content) => JSON.stringify(content[k]) !== JSON.stringify((JSON.parse(saved) as Content)[k]);
  const viewHref = section === "installForm" ? "/form" : "/";

  return (
    <div className="grid gap-5">
      <PageHeader title="Website content" sub="Edit any text on the website. Pick a section, make changes, then save." />
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <select value={section} onChange={(e) => setSection(e.target.value as keyof Content)} className={`${inputCls} lg:hidden`}>
            {sections.map((s) => <option key={s.key} value={s.key}>{s.label}{changed(s.key) ? " •" : ""}</option>)}
          </select>
          <nav className="hidden gap-0.5 lg:grid">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`flex items-center justify-between rounded-[10px] px-3 py-2 text-left text-[14px] font-medium transition ${section === s.key ? "bg-white text-ink shadow-sm" : "text-mute hover:text-ink"}`}
              >
                {s.label}
                {changed(s.key) && <i className="size-2 rounded-full bg-[#f05a28]" title="Unsaved changes" />}
              </button>
            ))}
          </nav>
        </aside>

        <section className={card}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[#eef1f8] pb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{meta.label}</h2>
              {meta.note && <p className="mt-0.5 max-w-[560px] text-[13px] text-mute">{meta.note}</p>}
            </div>
            <div className="flex gap-2">
              <a href={viewHref} target="_blank" rel="noopener" className={`${btnGhost} !py-2`}><Icon name="external" className="size-4" />View</a>
              <button
                className={`${btnGhost} !py-2`}
                onClick={() => {
                  if (confirm(`Put "${meta.label}" back to the original website text? (Nothing is saved until you click Save.)`))
                    setContent({ ...content, [section]: defaultContent[section] });
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <Field
            k={section}
            path={section}
            value={content[section]}
            template={defaultContent[section]}
            onChange={(v) => setContent({ ...content, [section]: v } as Content)}
          />
        </section>
      </div>
      <SaveBar dirty={dirty} busy={busy} onSave={save} onDiscard={() => setContent(JSON.parse(saved))} />
    </div>
  );
}
