"use client";
import { useEffect, useState } from "react";
import { newInvoice, saveSettings, type InvoiceSettings } from "@/lib/invoice";
import { useAdmin } from "./store";
import InvoiceDoc, { PAGE_W } from "./InvoiceDoc";
import { btnGhost, card, inputCls, Label, PageHeader, SaveBar } from "./ui";

const fields: { k: Exclude<keyof InvoiceSettings, "terms">; label: string; hint?: string }[] = [
  { k: "businessName", label: "Business name" },
  { k: "tagline", label: "Tagline" },
  { k: "phone", label: "Phone" },
  { k: "email", label: "Email" },
  { k: "website", label: "Website" },
  { k: "address", label: "Address" },
  { k: "bankName", label: "Bank name" },
  { k: "accountName", label: "Account name" },
  { k: "accountNumber", label: "Account number" },
  { k: "thankYou", label: "Thank-you line (bottom of invoice)" },
  { k: "prefix", label: "Invoice number prefix", hint: "Numbers look like PREFIX-2026-001. Changing it only affects new invoices." },
];

const sample = { ...newInvoice(), number: "INV-2026-001", customer: { name: "Client name", phone: "", email: "", company: "", address: "" } };

export default function InvoiceSettingsForm() {
  const { settings, loaded, reload, toast, fail, setGuard } = useAdmin();
  const [s, setS] = useState<InvoiceSettings>(settings);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setS(settings); }, [settings]);
  const dirty = JSON.stringify(s) !== JSON.stringify(settings);
  useEffect(() => { setGuard(() => dirty); return () => setGuard(null); }, [dirty, setGuard]);

  async function save() {
    setBusy(true);
    try {
      await saveSettings({ ...s, terms: s.terms.filter((t) => t.trim()) });
      await reload();
      toast("Invoice settings saved.");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  if (!loaded) return <p className="text-mute">Loading...</p>;
  const scale = 0.5;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_auto]">
      <div className="grid gap-5">
        <PageHeader title="Invoice settings" sub="Business details, bank details and terms shown on every invoice." />
        <div className={`${card} grid gap-4 sm:grid-cols-2`}>
          {fields.map((f) => (
            <Label key={f.k} text={f.label} hint={f.hint}>
              <input value={s[f.k]} onChange={(e) => setS({ ...s, [f.k]: e.target.value })} className={inputCls} />
            </Label>
          ))}
        </div>
        <div className={`${card} grid gap-3`}>
          <h3 className="text-lg font-semibold">Terms & conditions</h3>
          {s.terms.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea rows={2} value={t} onChange={(e) => setS({ ...s, terms: s.terms.map((x, j) => (j === i ? e.target.value : x)) })} className={`${inputCls} resize-y`} />
              <button className={btnGhost} onClick={() => setS({ ...s, terms: s.terms.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          ))}
          <button className={`${btnGhost} justify-self-start`} onClick={() => setS({ ...s, terms: [...s.terms, ""] })}>+ Add term</button>
        </div>
      </div>
      <SaveBar dirty={dirty} busy={busy} onSave={save} onDiscard={() => setS(settings)} label="Save settings" />
      <div className="xl:sticky xl:top-6">
        <p className="mb-2 text-[13px] font-medium text-mute">Preview</p>
        <div style={{ width: PAGE_W * scale, height: 1123 * scale }} className="overflow-hidden rounded-[12px] shadow-[0_20px_60px_rgba(25,26,21,.12)] max-sm:hidden">
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: PAGE_W }}>
            <InvoiceDoc inv={sample} settings={s} />
          </div>
        </div>
      </div>
    </div>
  );
}
