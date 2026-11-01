"use client";
import { useState } from "react";
import { Icon } from "@/lib/icons";
import { findByNumber, formatDate, formatDateTime, newInvoice, totals } from "@/lib/invoice";
import { useAdmin } from "./store";
import { btn, btnGhost, card, inputCls, ListRow, naira, OrderPill, PaymentPill, SubmissionPill } from "./ui";

function Stat({ icon, label, value, sub, tone, onClick }: { icon: string; label: string; value: React.ReactNode; sub?: string; tone: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${card} group flex items-start gap-4 text-left transition hover:-translate-y-0.5 hover:border-brand/40`}>
      <span className={`grid size-11 shrink-0 place-items-center rounded-[12px] ${tone}`}><Icon name={icon} className="size-[22px]" /></span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-mute">{label}</p>
        <p className="mt-0.5 text-[26px] font-semibold leading-tight tracking-tight">{value}</p>
        {sub && <p className="mt-0.5 truncate text-[13px] text-mute">{sub}</p>}
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { invoices, customers, submissions, loaded, nav, startInvoice, toast } = useAdmin();
  const [lookup, setLookup] = useState("");

  const fresh = submissions.filter((s) => s.status === "New");
  const pending = invoices.filter((i) => i.status !== "Paid");
  const toFulfil = invoices.filter((i) => i.orderStatus !== "Fulfilled");
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  function find(e: React.FormEvent) {
    e.preventDefault();
    const hit = findByNumber(invoices, lookup);
    if (hit?.id) nav({ tab: "invoices", view: "order", id: hit.id });
    else toast(`No order found with number "${lookup.trim()}"`, "err");
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight sm:text-2xl">{hello}, Fawas</h1>
          <p className="mt-0.5 text-[14px] text-mute">{loaded ? "Here is what needs your attention." : "Loading your data..."}</p>
        </div>
        <button className={btn} onClick={() => startInvoice(newInvoice())}><Icon name="plus" className="size-4" />New invoice</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="inbox" label="New form submissions" value={fresh.length} sub={fresh.length ? "Waiting to be converted" : "All caught up"} tone="bg-[#ffe9e0] text-[#c2410c]" onClick={() => nav({ tab: "submissions" })} />
        <Stat icon="file" label="Pending payment" value={naira(pending.reduce((s, i) => s + totals(i).total, 0))} sub={`${pending.length} invoice${pending.length === 1 ? "" : "s"}`} tone="bg-[#fff1da] text-[#a56a00]" onClick={() => nav({ tab: "invoices" })} />
        <Stat icon="wrench" label="Orders to fulfil" value={toFulfil.length} sub="Not installed yet" tone="bg-[#e6eefc] text-[#2f5fb3]" onClick={() => nav({ tab: "invoices" })} />
        <Stat icon="users" label="Customers" value={customers.length} sub={`${invoices.length} invoice${invoices.length === 1 ? "" : "s"} in total`} tone="bg-brand-l text-brand-d" onClick={() => nav({ tab: "customers" })} />
      </div>

      <form onSubmit={find} className={`${card} flex flex-wrap items-center gap-3`}>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[10px] bg-lav text-ink"><Icon name="search" className="size-5" /></span>
          <p className="font-semibold">Look up an order</p>
        </div>
        <input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="Invoice number, e.g. INV-2026-001" className={`${inputCls} min-w-0 flex-1 basis-[220px] uppercase placeholder:normal-case`} />
        <button className={btnGhost} disabled={!lookup.trim()}>Find</button>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">New form submissions</h2>
            <button onClick={() => nav({ tab: "submissions" })} className="text-[13px] font-medium text-brand-d hover:text-brand">See all</button>
          </div>
          {fresh.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-mute">No new submissions. Share your /form link with clients to collect their details.</p>
          ) : (
            fresh.slice(0, 5).map((s) => (
              <ListRow key={s.id} onClick={() => nav({ tab: "submissions", view: "detail", id: s.id })} title={s.name} sub={`${s.vehicleMake}${s.plate ? " · " + s.plate : ""} · ${formatDateTime(s.createdAt)}`} meta={<SubmissionPill status={s.status} />} />
            ))
          )}
        </section>

        <section className={card}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent invoices</h2>
            <button onClick={() => nav({ tab: "invoices" })} className="text-[13px] font-medium text-brand-d hover:text-brand">See all</button>
          </div>
          {invoices.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-mute">No invoices yet.</p>
          ) : (
            invoices.slice(0, 5).map((i) => (
              <ListRow
                key={i.id}
                onClick={() => nav({ tab: "invoices", view: "order", id: i.id })}
                title={`${i.number} · ${i.customer?.name}`}
                sub={formatDate(i.issueDate)}
                right={naira(totals(i).total)}
                meta={<><PaymentPill status={i.status} /><OrderPill status={i.orderStatus} /></>}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
