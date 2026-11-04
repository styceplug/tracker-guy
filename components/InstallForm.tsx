"use client";
import { useState } from "react";
import { useContent } from "@/lib/useContent";
import { Icon } from "@/lib/icons";

type Key = "name" | "address" | "email" | "vehicleMake" | "phone" | "plate";
const empty: Record<Key, string> = { name: "", address: "", email: "", vehicleMake: "", phone: "", plate: "" };
const MAX = 200;

const input =
  "w-full rounded-[10px] border border-[#e3e7ef] bg-white px-4 py-3 text-[15px] text-ink outline-2 outline-transparent transition focus:border-brand focus:outline-brand/30";

export default function InstallForm() {
  const { installForm: f, business, footer } = useContent();
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [trap, setTrap] = useState(""); // hidden field; real people leave it empty

  const fields: { k: Key; label: string; required: boolean; type?: string; auto?: string }[] = [
    { k: "name", label: f.nameLabel, required: true, auto: "name" },
    { k: "address", label: f.addressLabel, required: true, auto: "street-address" },
    { k: "email", label: f.emailLabel, required: true, type: "email", auto: "email" },
    { k: "vehicleMake", label: f.vehicleLabel, required: true },
    { k: "phone", label: f.phoneLabel, required: true, type: "tel", auto: "tel" },
    { k: "plate", label: f.plateLabel, required: false },
  ];

  function validate() {
    const e: Partial<Record<Key, string>> = {};
    for (const x of fields) if (x.required && !v[x.k].trim()) e[x.k] = f.requiredError;
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = f.emailError;
    setErrors(e);
    // Jump to the first problem so it's not hidden above the fold (mobile especially).
    const first = fields.find((x) => e[x.k]);
    if (first) {
      const el = document.getElementById(`f-${first.k}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    }
    return Object.keys(e).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (trap) return setState("done");
    setState("sending");
    try {
      const { submitInstallForm } = await import("@/lib/invoice");
      const clean = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x.trim().slice(0, MAX)])) as Record<Key, string>;
      await submitInstallForm(clean);
      setState("done");
    } catch (err) {
      console.error("Install form submit failed:", err);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-[640px] overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(25,26,21,.08)]">
        <div className="h-2.5 bg-brand" />
        <div className="grid justify-items-start gap-4 p-7 sm:p-9">
          <span className="grid size-14 place-items-center rounded-full bg-brand-l text-brand-d"><Icon name="check" className="size-7" strokeWidth={2.5} /></span>
          <h1 className="text-[clamp(26px,4vw,34px)] font-semibold leading-tight tracking-tight">{f.title}</h1>
          <p className="text-base text-[#4a4c45]">{f.successText}</p>
          <button onClick={() => { setV(empty); setState("idle"); }} className="text-[15px] font-medium text-brand-d underline underline-offset-4 hover:text-brand">
            {f.anotherLink}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto grid max-w-[640px] gap-4">
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(25,26,21,.08)]">
        <div className="h-2.5 bg-brand" />
        <div className="p-7 sm:p-9">
          <h1 className="text-[clamp(26px,4vw,34px)] font-semibold leading-tight tracking-tight">{f.title}</h1>
          <p className="mt-3 text-base text-[#4a4c45]">{f.description}</p>
          <p className="mt-5 border-t border-[#eef1f8] pt-4 text-[13px] text-red-600">{f.requiredNote}</p>
        </div>
      </div>

      {fields.map((x) => (
        <label key={x.k} className={`grid gap-3 rounded-[20px] border bg-white p-6 shadow-[0_10px_30px_rgba(25,26,21,.04)] sm:p-7 ${errors[x.k] ? "border-red-300" : "border-transparent"}`}>
          <span className="text-base font-medium">
            {x.label} {x.required && <span className="text-red-600">*</span>}
          </span>
          <input
            id={`f-${x.k}`}
            type={x.type || "text"}
            autoComplete={x.auto}
            value={v[x.k]}
            maxLength={MAX}
            onChange={(e) => { setV({ ...v, [x.k]: e.target.value }); if (errors[x.k]) setErrors({ ...errors, [x.k]: undefined }); }}
            className={input}
          />
          {errors[x.k] && <span className="flex items-center gap-1.5 text-[13px] text-red-600"><Icon name="x" className="size-3.5" strokeWidth={3} />{errors[x.k]}</span>}
        </label>
      ))}

      {/* spam trap: hidden from people, bots tend to fill it.
          The name must NOT look like a real field (company, website, url...) or browser autofill fills it
          and real submissions get silently dropped. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden opacity-0">
        <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} name="tg_hp_x7" id="tg_hp_x7" />
      </div>

      {state === "error" && (
        <p className="rounded-[12px] bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
          {f.errorText}
          <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener" className="mt-1 block underline underline-offset-4">{footer.whatsappButton}</a>
        </p>
      )}

      <div className="flex items-center justify-between gap-4 pt-1">
        <button type="submit" disabled={state === "sending"} className="btn !rounded-[10px] !px-8 !py-3.5 disabled:opacity-60">
          {state === "sending" ? f.sendingText : f.submitButton}
        </button>
        <button type="button" onClick={() => { setV(empty); setErrors({}); setState("idle"); }} className="text-[14px] font-medium text-brand-d hover:text-brand">
          {f.clearButton}
        </button>
      </div>
    </form>
  );
}
