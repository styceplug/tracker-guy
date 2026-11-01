"use client";
import { forwardRef } from "react";
import { images } from "@/lib/content";
import { Icon } from "@/lib/icons";
import { formatDate, totals, type Invoice, type InvoiceSettings } from "@/lib/invoice";
import { naira } from "./ui";

/** A4 page at 96 dpi. */
export const PAGE_W = 794;
export const PAGE_H = 1123;

const label = "text-[10px] font-semibold uppercase tracking-[0.14em] text-mute";

const InvoiceDoc = forwardRef<HTMLDivElement, { inv: Invoice; settings: InvoiceSettings }>(function InvoiceDoc({ inv, settings: s }, ref) {
  const t = totals(inv);
  const c = inv.customer;
  const vehicles = inv.vehicles.filter((v) => v.makeModel || v.registration);
  const paid = inv.status === "Paid";
  const contact = [s.phone, s.email, s.website].filter(Boolean);
  const hasBank = s.bankName || s.accountName || s.accountNumber;
  const terms = s.terms.filter((x) => x.trim());

  return (
    <div ref={ref} style={{ width: PAGE_W, minHeight: PAGE_H }} className="relative flex flex-col overflow-hidden bg-white font-sans text-ink antialiased">
      {/* header */}
      <div className="relative bg-gradient-to-b from-[#e6f6f0] to-white px-14 pb-8 pt-12">
        <i aria-hidden className="absolute -right-24 -top-28 size-[320px] rounded-full bg-[#c9efe0] opacity-60 blur-[70px]" />
        <div className="relative flex items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images.logo} alt="" className="size-14 rounded-[12px]" />
              <div>
                <p className="text-[26px] font-semibold leading-none tracking-tight text-brand">
                  {s.businessName === "The Tracker Guy" ? (
                    <><span className="text-ink">The </span>Tracker<span className="text-ink"> Guy</span></>
                  ) : (
                    <span className="text-ink">{s.businessName}</span>
                  )}
                </p>
                {s.tagline && <p className="mt-1.5 text-[12px] text-mute">{s.tagline}</p>}
              </div>
            </div>
            <div className="mt-5 grid gap-0.5 text-[12px] text-[#4a4c45]">
              {contact.map((x) => <span key={x}>{x}</span>)}
              {s.address && <span>{s.address}</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[44px] font-semibold leading-none tracking-tight">Invoice</p>
            <svg className="ml-auto mt-1.5 h-[12px] w-[150px]" viewBox="0 0 150 12" preserveAspectRatio="none" aria-hidden>
              <path d="M2 9C30 3 80 0 148 7" fill="none" stroke="#54bd95" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className={`mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${paid ? "bg-brand text-white" : "bg-[#fff1da] text-[#a56a00]"}`}>
              {inv.status}
            </span>
          </div>
        </div>

        {/* meta row */}
        <div className="relative mt-8 grid grid-cols-4 overflow-hidden rounded-[14px] border border-[#e3efe9] bg-white">
          {[
            ["Invoice number", inv.number || "Not saved yet"],
            ["Date issued", formatDate(inv.issueDate)],
            ["Due date", formatDate(inv.dueDate)],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-[#e3efe9] px-4 py-3.5">
              <p className={label}>{k}</p>
              <p className="mt-1 text-[14px] font-semibold">{v}</p>
            </div>
          ))}
          <div className="bg-brand px-4 py-3.5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">{paid ? "Amount paid" : "Amount due"}</p>
            <p className="mt-1 text-[16px] font-semibold">{naira(t.total)}</p>
          </div>
        </div>
      </div>

      {/* parties */}
      <div className="grid grid-cols-2 gap-6 px-14">
        <div className="rounded-[14px] bg-lav p-5">
          <p className={label}>Bill to</p>
          <p className="mt-2 text-[16px] font-semibold">{c.name || "Client name"}</p>
          {c.company && <p className="text-[13px] text-[#4a4c45]">{c.company}</p>}
          <div className="mt-1.5 grid gap-0.5 text-[12.5px] text-[#4a4c45]">
            {c.phone && <span>{c.phone}</span>}
            {c.email && <span>{c.email}</span>}
            {c.address && <span>{c.address}</span>}
          </div>
        </div>
        <div className="rounded-[14px] bg-lav p-5">
          <p className={label}>Vehicle information</p>
          {vehicles.length ? (
            <div className="mt-2 grid gap-2">
              {vehicles.map((v, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-brand-l text-brand-d"><Icon name="car" className="size-4" /></span>
                  <div className="leading-tight">
                    <p className="text-[13.5px] font-semibold">{v.makeModel || "Vehicle"}</p>
                    {v.registration && <p className="text-[12px] text-mute">Reg. {v.registration}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-mute">No vehicle added</p>
          )}
          {inv.installLocation && (
            <p className="mt-3 flex items-center gap-1.5 text-[12.5px] text-[#4a4c45]">
              <Icon name="pin" className="size-3.5 text-brand-d" />Installation: {inv.installLocation}
            </p>
          )}
        </div>
      </div>

      {/* items */}
      <div className="px-14 pt-7">
        <div className="grid grid-cols-[28px_1fr_50px_120px_120px] gap-3 rounded-[10px] bg-night px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white">
          <span>#</span><span>Description</span><span className="text-center">Qty</span><span className="text-right">Unit price</span><span className="text-right">Amount</span>
        </div>
        {inv.items.length === 0 && <p className="px-4 py-5 text-[13px] text-mute">No items added</p>}
        {inv.items.map((it, i) => (
          <div key={i} className="grid grid-cols-[28px_1fr_50px_120px_120px] items-start gap-3 border-b border-[#eef1f8] px-4 py-3.5 text-[13.5px]">
            <span className="text-mute">{i + 1}</span>
            <div>
              <p className="font-semibold">{it.description}</p>
              {it.details && <p className="mt-0.5 text-[12px] leading-snug text-mute">{it.details}</p>}
            </div>
            <span className="text-center">{it.qty}</span>
            <span className="text-right">{naira(Number(it.unitPrice) || 0)}</span>
            <span className="text-right font-semibold">{naira((Number(it.qty) || 0) * (Number(it.unitPrice) || 0))}</span>
          </div>
        ))}

        <div className="ml-auto mt-5 grid w-[300px] gap-2 text-[13.5px]">
          <div className="flex justify-between px-1"><span className="text-mute">Subtotal</span><span className="font-medium">{naira(t.subtotal)}</span></div>
          {t.discount > 0 && (
            <div className="flex justify-between px-1"><span className="text-mute">Discount</span><span className="font-medium">-{naira(t.discount)}</span></div>
          )}
          <div className="mt-1 flex items-center justify-between rounded-[12px] bg-brand-l px-4 py-3.5 text-brand-d">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">{paid ? "Total paid" : "Total due"}</span>
            <span className="text-[22px] font-semibold tracking-tight">{naira(t.total)}</span>
          </div>
        </div>
      </div>

      {/* payment, terms, notes */}
      <div className="grid grid-cols-2 gap-6 px-14 pt-8">
        <div>
          <p className={label}>Payment information</p>
          {hasBank ? (
            <div className="mt-2.5 grid gap-1.5 rounded-[14px] border border-[#e3efe9] p-4 text-[13px]">
              {s.bankName && <div className="flex justify-between gap-3"><span className="text-mute">Bank</span><b className="text-right font-semibold">{s.bankName}</b></div>}
              {s.accountName && <div className="flex justify-between gap-3"><span className="text-mute">Account name</span><b className="text-right font-semibold">{s.accountName}</b></div>}
              {s.accountNumber && <div className="flex justify-between gap-3"><span className="text-mute">Account number</span><b className="text-right font-semibold tracking-wide">{s.accountNumber}</b></div>}
            </div>
          ) : (
            <p className="mt-2.5 text-[12.5px] text-mute">Add bank details in Invoice settings.</p>
          )}
          {inv.notes && (
            <>
              <p className={`${label} mt-5`}>Notes</p>
              <p className="mt-1.5 whitespace-pre-line text-[12.5px] leading-relaxed text-[#4a4c45]">{inv.notes}</p>
            </>
          )}
        </div>
        {terms.length > 0 && (
          <div>
            <p className={label}>Terms & conditions</p>
            <ul className="mt-2.5 grid gap-2">
              {terms.map((x, i) => (
                <li key={i} className="flex gap-2 text-[12px] leading-snug text-[#4a4c45]">
                  <i className="mt-[5px] size-1.5 shrink-0 rounded-full bg-brand" />{x}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="mt-auto pt-10">
        <div className="flex items-center justify-between gap-6 bg-night px-14 py-5 text-white">
          <p className="text-[14px] font-medium">{s.thankYou}</p>
          <p className="flex shrink-0 flex-col items-end text-[11.5px] leading-relaxed text-[#aab1c0]">
            {contact.map((x) => <span key={x} className="whitespace-nowrap">{x}</span>)}
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceDoc;
