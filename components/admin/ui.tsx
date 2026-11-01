"use client";
import { Icon } from "@/lib/icons";
// Small shared building blocks for the admin screens, styled like the public site.

export const inputCls =
  "w-full rounded-[10px] border border-[#e3e7ef] bg-white px-3.5 py-2.5 text-[15px] text-ink outline-2 outline-transparent focus:border-brand focus:outline-brand/30";
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-brand-d disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer whitespace-nowrap";
export const btnSoft =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-l px-4 py-2.5 text-[14px] font-medium text-brand-d transition hover:bg-brand hover:text-white disabled:opacity-50 cursor-pointer whitespace-nowrap";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#e3e7ef] bg-white px-4 py-2.5 text-[14px] font-medium text-ink transition hover:border-ink/30 disabled:opacity-50 cursor-pointer whitespace-nowrap";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border border-red-200 bg-white px-4 py-2.5 text-[14px] font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 cursor-pointer whitespace-nowrap";
export const card = "rounded-[16px] border border-[#eef1f8] bg-white p-5 shadow-[0_10px_30px_rgba(25,26,21,.04)] sm:p-6";

export function Label({ text, hint, children }: { text: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-[14px] font-medium text-ink">
      <span>{text}</span>
      {children}
      {hint && <span className="text-[12px] font-normal text-mute">{hint}</span>}
    </label>
  );
}

export function Status({ msg }: { msg: { type: "ok" | "err" | "info"; text: string } | null }) {
  if (!msg) return null;
  const c = msg.type === "ok" ? "bg-brand-l text-brand-d" : msg.type === "err" ? "bg-red-50 text-red-700" : "bg-[#fff6e6] text-[#a56a00]";
  return <p className={`rounded-[10px] px-4 py-2.5 text-[14px] font-medium ${c}`}>{msg.text}</p>;
}

export const naira = (n: number) =>
  "₦" + (Number.isFinite(n) ? n : 0).toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const firebaseError = (e: unknown) => {
  const code = (e as { code?: string })?.code || "";
  if (code.includes("permission-denied")) return "Permission denied. Check that firestore.rules has your admin email and is published.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "Wrong email or password.";
  if (code.includes("too-many-requests")) return "Too many attempts. Wait a few minutes and try again.";
  if (code.includes("unavailable") || code.includes("network")) return "Network problem. Check your connection and try again.";
  return (e as Error)?.message || "Something went wrong.";
};

// ---------- layout helpers ----------

export function PageHeader({ title, sub, onBack, actions }: { title: React.ReactNode; sub?: React.ReactNode; onBack?: () => void; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {onBack && (
          <button onClick={onBack} aria-label="Back" className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-[#e3e7ef] bg-white text-ink hover:border-ink/30">
            <Icon name="back" className="size-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {sub && <div className="mt-0.5 text-[14px] text-mute">{sub}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Empty({ icon, title, text, action }: { icon: string; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="grid justify-items-center gap-2 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-l text-brand-d"><Icon name={icon} className="size-6" /></span>
      <p className="mt-1 font-semibold">{title}</p>
      {text && <p className="max-w-[360px] text-[14px] text-mute">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

const pill = "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none";
export function PaymentPill({ status }: { status: string }) {
  return <span className={`${pill} ${status === "Paid" ? "bg-brand-l text-brand-d" : "bg-[#fff1da] text-[#a56a00]"}`}>{status === "Paid" ? "Paid" : "Pending payment"}</span>;
}
export function OrderPill({ status }: { status: string }) {
  return <span className={`${pill} ${status === "Fulfilled" ? "bg-[#e6eefc] text-[#2f5fb3]" : "bg-[#eef0f4] text-[#5b606b]"}`}>{status === "Fulfilled" ? "Fulfilled" : "Order pending"}</span>;
}
export function SubmissionPill({ status }: { status: string }) {
  return <span className={`${pill} ${status === "Converted" ? "bg-brand-l text-brand-d" : "bg-[#ffe9e0] text-[#c2410c]"}`}>{status === "Converted" ? "Converted" : "New"}</span>;
}

/** Row used for mobile cards and clickable lists. */
export function ListRow({ onClick, title, sub, right, meta }: { onClick: () => void; title: React.ReactNode; sub?: React.ReactNode; right?: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-t border-[#eef1f8] px-1 py-3.5 text-left first:border-t-0 hover:bg-lav/60">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold">{title}</div>
        {sub && <div className="truncate text-[13px] text-mute">{sub}</div>}
        {meta && <div className="mt-1.5 flex flex-wrap gap-1.5">{meta}</div>}
      </div>
      {right && <div className="shrink-0 text-right text-[14px] font-medium">{right}</div>}
      <Icon name="chevron" className="size-4 shrink-0 text-mute" />
    </button>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-[300px]">
      <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} !pl-10`} />
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-[10px] bg-lav p-1">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={`whitespace-nowrap rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition ${value === o.v ? "bg-white text-ink shadow-sm" : "text-mute hover:text-ink"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Save bar pinned to the bottom of the screen while there are unsaved changes. */
export function SaveBar({ dirty, busy, onSave, onDiscard, label = "Save changes" }: { dirty: boolean; busy: boolean; onSave: () => void; onDiscard?: () => void; label?: string }) {
  if (!dirty) return null;
  return (
    <div className="fixed inset-x-0 bottom-[68px] z-40 px-3 md:bottom-5 md:left-[248px] md:px-6">
      <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3 rounded-[14px] bg-night px-4 py-3 text-white shadow-[0_20px_50px_rgba(22,28,40,.35)]">
        <span className="text-[14px] font-medium">You have unsaved changes</span>
        <div className="flex gap-2">
          {onDiscard && <button onClick={onDiscard} className="rounded-[10px] px-3 py-2 text-[14px] text-[#aab1c0] hover:text-white">Discard</button>}
          <button onClick={onSave} disabled={busy} className={btn}>{busy ? "Saving..." : label}</button>
        </div>
      </div>
    </div>
  );
}
