"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/lib/icons";
import { priceToNumber } from "@/lib/content";
import {
  deleteInvoice, emptyCustomer, findByNumber, formatDate, newInvoice, normalizeInvoice,
  saveInvoice, setInvoiceStatus, setOrderStatus, today, totals, type Customer, type Invoice,
} from "@/lib/invoice";
import { exportPdf, exportPng } from "@/lib/exportInvoice";
import InvoiceDoc, { PAGE_H, PAGE_W } from "./InvoiceDoc";
import { useAdmin } from "./store";
import {
  btn, btnDanger, btnGhost, btnSoft, card, Empty, inputCls, Label, ListRow, naira, OrderPill, PageHeader, PaymentPill, SearchBox, Segmented,
} from "./ui";

const fileName = (i: Invoice) => `${i.number}${i.customer.name ? " - " + i.customer.name : ""}`.replace(/[\\/:*?"<>|]/g, "");

export default function Invoices() {
  const { invoices, loaded, route, nav, draft, startInvoice, toast } = useAdmin();
  const [search, setSearch] = useState("");
  const [lookup, setLookup] = useState("");
  const [pay, setPay] = useState<"All" | Invoice["status"]>("All");
  const [order, setOrder] = useState<"All" | Invoice["orderStatus"]>("All");

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter(
      (i) =>
        (pay === "All" || i.status === pay) &&
        (order === "All" || i.orderStatus === order) &&
        (!q || [i.number, i.customer?.name, i.customer?.phone, i.customer?.company].some((x) => (x || "").toLowerCase().includes(q))),
    );
  }, [invoices, search, pay, order]);

  if (route.view === "new") {
    if (!draft) { nav({ tab: "invoices" }); return null; }
    return <InvoiceEditor key="new" initial={draft} />;
  }
  if (route.view === "edit" || route.view === "order") {
    const inv = invoices.find((i) => i.id === route.id);
    if (!inv) return <p className="text-mute">{loaded ? "This invoice no longer exists." : "Loading..."}</p>;
    return route.view === "edit" ? <InvoiceEditor key={inv.id} initial={normalizeInvoice(inv)} /> : <OrderView inv={inv} />;
  }

  function find(e: React.FormEvent) {
    e.preventDefault();
    const hit = findByNumber(invoices, lookup);
    if (hit?.id) nav({ tab: "invoices", view: "order", id: hit.id });
    else toast(`No order found with number "${lookup.trim()}"`, "err");
  }

  const pending = invoices.filter((i) => i.status !== "Paid");
  const toFulfil = invoices.filter((i) => i.orderStatus !== "Fulfilled");

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Invoices & orders"
        sub={`${invoices.length} total · ${pending.length} pending payment (${naira(pending.reduce((s, i) => s + totals(i).total, 0))}) · ${toFulfil.length} not yet fulfilled`}
        actions={<button className={btn} onClick={() => startInvoice(newInvoice())}><Icon name="plus" className="size-4" />New invoice</button>}
      />

      <form onSubmit={find} className={`${card} flex flex-wrap items-center gap-3`}>
        <span className="font-semibold">Look up an order</span>
        <input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="Invoice number, e.g. INV-2026-001" className={`${inputCls} min-w-0 flex-1 basis-[220px] uppercase placeholder:normal-case`} />
        <button className={btnGhost} disabled={!lookup.trim()}>Find order</button>
      </form>

      <div className={card}>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <SearchBox value={search} onChange={setSearch} placeholder="Search number, name, phone" />
          <Segmented value={pay} onChange={setPay} options={[{ v: "All", label: "Any payment" }, { v: "Pending payment", label: "Pending payment" }, { v: "Paid", label: "Paid" }]} />
          <Segmented value={order} onChange={setOrder} options={[{ v: "All", label: "Any order" }, { v: "Pending", label: "Order pending" }, { v: "Fulfilled", label: "Fulfilled" }]} />
        </div>
        {!loaded ? (
          <p className="py-8 text-center text-mute">Loading...</p>
        ) : shown.length === 0 ? (
          <Empty icon="file" title={invoices.length ? "No invoices match" : "No invoices yet"} text={invoices.length ? "Try a different filter or search." : "Create your first invoice, or convert a form submission."} />
        ) : (
          <>
            {/* phone */}
            <div className="md:hidden">
              {shown.map((i) => (
                <ListRow
                  key={i.id}
                  onClick={() => nav({ tab: "invoices", view: "order", id: i.id })}
                  title={i.number}
                  sub={`${i.customer?.name} · ${formatDate(i.issueDate)}`}
                  right={naira(totals(i).total)}
                  meta={<><PaymentPill status={i.status} /><OrderPill status={i.orderStatus} /></>}
                />
              ))}
            </div>
            {/* desktop */}
            <table className="hidden w-full text-left text-[14px] md:table">
              <thead className="text-[12px] uppercase tracking-wider text-mute">
                <tr><th className="py-2 font-semibold">Number</th><th className="font-semibold">Customer</th><th className="font-semibold">Issued</th><th className="text-right font-semibold">Total</th><th className="pl-5 font-semibold">Payment</th><th className="font-semibold">Order</th><th /></tr>
              </thead>
              <tbody>
                {shown.map((i) => (
                  <tr key={i.id} className="cursor-pointer border-t border-[#eef1f8] hover:bg-lav/60" onClick={() => nav({ tab: "invoices", view: "order", id: i.id })}>
                    <td className="py-3.5 font-semibold">{i.number}</td>
                    <td>{i.customer?.name}<span className="block text-[12px] text-mute">{i.customer?.phone}</span></td>
                    <td>{formatDate(i.issueDate)}</td>
                    <td className="text-right font-medium">{naira(totals(i).total)}</td>
                    <td className="pl-5"><PaymentPill status={i.status} /></td>
                    <td><OrderPill status={i.orderStatus} /></td>
                    <td className="text-right text-mute"><Icon name="chevron" className="ml-auto size-4" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

function OrderView({ inv }: { inv: Invoice }) {
  const { settings, nav, reload, toast, fail } = useAdmin();
  const [busy, setBusy] = useState("");
  const docRef = useRef<HTMLDivElement>(null);
  const t = totals(inv);
  const c = inv.customer;
  const vehicles = inv.vehicles.filter((v) => v.makeModel || v.registration);

  async function run(key: string, fn: () => Promise<unknown>, ok: string) {
    setBusy(key);
    try { await fn(); await reload(); toast(ok); }
    catch (e) { fail(e); }
    finally { setBusy(""); }
  }

  async function doExport(kind: "pdf" | "png") {
    if (!docRef.current) return;
    setBusy(kind);
    try {
      if (kind === "pdf") await exportPdf(docRef.current, fileName(inv));
      else await exportPng(docRef.current, fileName(inv));
      toast(`${kind.toUpperCase()} downloaded.`);
    } catch (e) {
      toast("Export failed: " + ((e as Error)?.message || "unknown error"), "err");
    } finally { setBusy(""); }
  }

  const paid = inv.status === "Paid";
  const done = inv.orderStatus === "Fulfilled";
  const row = "flex justify-between gap-4 py-2.5 text-[14px]";

  return (
    <div className="grid gap-5">
      <PageHeader
        onBack={() => nav({ tab: "invoices" })}
        title={`Order ${inv.number}`}
        sub={<span className="flex flex-wrap gap-1.5"><PaymentPill status={inv.status} /><OrderPill status={inv.orderStatus} /></span>}
        actions={
          <>
            <button className={btnGhost} disabled={!!busy} onClick={() => doExport("png")}><Icon name="download" className="size-4" />{busy === "png" ? "Exporting..." : "PNG"}</button>
            <button className={btnGhost} disabled={!!busy} onClick={() => doExport("pdf")}><Icon name="download" className="size-4" />{busy === "pdf" ? "Exporting..." : "PDF"}</button>
            <button className={btnSoft} onClick={() => nav({ tab: "invoices", view: "edit", id: inv.id })}>Edit invoice</button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`${card} grid gap-3`}>
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Payment</h2><PaymentPill status={inv.status} /></div>
          <p className="text-[14px] text-mute">{paid ? `${naira(t.total)} received.` : `Waiting for ${naira(t.total)}. Due ${formatDate(inv.dueDate)}.`}</p>
          <button className={paid ? btnGhost : btn} disabled={!!busy} onClick={() => run("pay", () => setInvoiceStatus(inv.id!, paid ? "Pending payment" : "Paid"), paid ? "Marked as pending payment." : "Marked as paid.")}>
            {busy === "pay" ? "Saving..." : paid ? "Mark as pending payment" : "Mark as paid"}
          </button>
        </div>
        <div className={`${card} grid gap-3`}>
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Order</h2><OrderPill status={inv.orderStatus} /></div>
          <p className="text-[14px] text-mute">{done ? `Fulfilled${inv.fulfilledDate ? " on " + formatDate(inv.fulfilledDate) : ""}.` : "Not fulfilled yet."}</p>
          <button className={done ? btnGhost : btn} disabled={!!busy} onClick={() => run("order", () => setOrderStatus(inv.id!, done ? "Pending" : "Fulfilled"), done ? "Marked as order pending." : "Marked as fulfilled.")}>
            {busy === "order" ? "Saving..." : done ? "Mark as order pending" : "Mark as fulfilled"}
          </button>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className={card}>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Client</h2>
            {inv.customerId && <button onClick={() => nav({ tab: "customers", view: "detail", id: inv.customerId })} className="text-[13px] font-medium text-brand-d hover:text-brand">Customer record</button>}
          </div>
          <div className="divide-y divide-[#eef1f8]">
            <div className={row}><span className="text-mute">Name</span><b className="text-right font-medium">{c.name}</b></div>
            {c.company && <div className={row}><span className="text-mute">Company</span><span className="text-right">{c.company}</span></div>}
            {c.phone && <div className={row}><span className="text-mute">Phone</span><a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="text-right text-brand-d hover:underline">{c.phone}</a></div>}
            {c.email && <div className={row}><span className="text-mute">Email</span><a href={`mailto:${c.email}`} className="break-all text-right text-brand-d hover:underline">{c.email}</a></div>}
            {c.address && <div className={row}><span className="text-mute">Address</span><span className="text-right">{c.address}</span></div>}
          </div>
        </div>
        <div className={card}>
          <h2 className="mb-1 text-lg font-semibold">Vehicles & installation</h2>
          <div className="divide-y divide-[#eef1f8]">
            {vehicles.length === 0 && <p className="py-2.5 text-[14px] text-mute">No vehicle added.</p>}
            {vehicles.map((v, i) => (
              <div key={i} className={row}><span className="font-medium">{v.makeModel || "Vehicle"}</span><span className="text-mute">{v.registration}</span></div>
            ))}
            {inv.installLocation && <div className={row}><span className="text-mute">Location</span><span className="text-right">{inv.installLocation}</span></div>}
          </div>
        </div>
      </div>

      <div className={card}>
        <h2 className="mb-1 text-lg font-semibold">Items</h2>
        <div className="divide-y divide-[#eef1f8]">
          {inv.items.map((it, i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-3 text-[14px]">
              <div>
                <p className="font-medium">{it.description}</p>
                <p className="text-[13px] text-mute">{it.qty} × {naira(Number(it.unitPrice) || 0)}{it.details ? ` · ${it.details}` : ""}</p>
              </div>
              <span className="font-medium">{naira((Number(it.qty) || 0) * (Number(it.unitPrice) || 0))}</span>
            </div>
          ))}
        </div>
        <div className="ml-auto mt-2 grid w-full max-w-[300px] gap-1.5 border-t border-[#eef1f8] pt-3 text-[14px]">
          <div className="flex justify-between"><span className="text-mute">Subtotal</span><span>{naira(t.subtotal)}</span></div>
          {t.discount > 0 && <div className="flex justify-between"><span className="text-mute">Discount</span><span>-{naira(t.discount)}</span></div>}
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{naira(t.total)}</span></div>
        </div>
      </div>

      <div className={`${card} grid grid-cols-3 gap-2 text-[14px]`}>
        <div><p className="text-mute">Issued</p><p className="font-medium">{formatDate(inv.issueDate)}</p></div>
        <div><p className="text-mute">Due</p><p className="font-medium">{formatDate(inv.dueDate)}</p></div>
        <div><p className="text-mute">Fulfilled</p><p className="font-medium">{inv.fulfilledDate ? formatDate(inv.fulfilledDate) : "-"}</p></div>
        {inv.notes && <div className="col-span-3"><p className="text-mute">Notes</p><p className="whitespace-pre-line">{inv.notes}</p></div>}
      </div>

      {/* full-size invoice kept off screen for export */}
      <div aria-hidden style={{ position: "fixed", left: -10000, top: 0, width: PAGE_W }}>
        <InvoiceDoc ref={docRef} inv={inv} settings={settings} />
      </div>
    </div>
  );
}

function InvoiceEditor({ initial }: { initial: Invoice }) {
  const { customers, settings, tiers, nav, reload, toast, fail, setGuard } = useAdmin();
  const [inv, setInv] = useState<Invoice>(initial);
  const [savedJson, setSavedJson] = useState(initial.id ? JSON.stringify(initial) : "");
  const [busy, setBusy] = useState<string>("");
  const docRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [docH, setDocH] = useState(PAGE_H);
  const dirty = JSON.stringify(inv) !== savedJson;

  useEffect(() => { setGuard(() => dirty); return () => setGuard(null); }, [dirty, setGuard]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / PAGE_W));
      if (docRef.current) setDocH(docRef.current.offsetHeight);
    });
    ro.observe(el);
    if (docRef.current) ro.observe(docRef.current);
    return () => ro.disconnect();
  }, []);

  const set = <K extends keyof Invoice>(k: K, v: Invoice[K]) => setInv((p) => ({ ...p, [k]: v }));
  const setCust = (k: keyof Customer, v: string) => setInv((p) => ({ ...p, customer: { ...p.customer, [k]: v } }));
  const vehicleCount = Math.max(1, inv.vehicles.filter((v) => v.makeModel || v.registration).length);

  async function save(): Promise<Invoice | null> {
    if (!inv.customer.name.trim()) {
      toast("Add the client's name first.", "err");
      return null;
    }
    setBusy("save");
    try {
      const saved = await saveInvoice(inv, settings.prefix);
      setInv(saved);
      setSavedJson(JSON.stringify(saved));
      toast(`Saved as ${saved.number}.`);
      reload();
      return saved;
    } catch (e) {
      fail(e);
      return null;
    } finally {
      setBusy("");
    }
  }

  async function doExport(kind: "pdf" | "png") {
    let cur: Invoice | null = inv;
    if (dirty || !inv.id) {
      cur = await save();
      if (!cur) return;
      await new Promise((r) => setTimeout(r, 150)); // let the saved number render
    }
    if (!docRef.current) return;
    setBusy(kind);
    try {
      if (kind === "pdf") await exportPdf(docRef.current, fileName(cur));
      else await exportPng(docRef.current, fileName(cur));
      toast(`${kind.toUpperCase()} downloaded.`);
    } catch (e) {
      toast("Export failed: " + ((e as Error)?.message || "unknown error"), "err");
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    if (!inv.id || !confirm(`Delete invoice ${inv.number}? This cannot be undone.`)) return;
    try { await deleteInvoice(inv.id); setGuard(null); await reload(); toast("Invoice deleted."); nav({ tab: "invoices" }); } catch (e) { fail(e); }
  }

  const item = (i: number, k: "description" | "details" | "qty" | "unitPrice", v: string) =>
    set("items", inv.items.map((it, j) => (j === i ? { ...it, [k]: k === "qty" || k === "unitPrice" ? Number(v) : v } : it)));

  return (
    <div className="grid gap-5">
      <PageHeader
        onBack={() => nav(inv.id ? { tab: "invoices", view: "order", id: inv.id } : { tab: "invoices" })}
        title={inv.number ? `Edit ${inv.number}` : "New invoice"}
        sub={dirty ? <span className="text-[#a56a00]">Unsaved changes</span> : "Saved"}
        actions={
          <>
            {inv.id && <button className={btnDanger} onClick={remove}><Icon name="trash" className="size-4" /><span className="max-sm:hidden">Delete</span></button>}
            <button className={btnGhost} disabled={!!busy} onClick={() => doExport("png")}><Icon name="download" className="size-4" />{busy === "png" ? "Exporting..." : "PNG"}</button>
            <button className={btnSoft} disabled={!!busy} onClick={() => doExport("pdf")}><Icon name="download" className="size-4" />{busy === "pdf" ? "Exporting..." : "PDF"}</button>
            <button className={btn} disabled={!!busy || (!dirty && !!inv.id)} onClick={save}>{busy === "save" ? "Saving..." : "Save"}</button>
          </>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* form */}
        <div className="grid gap-5">
          <div className={`${card} grid gap-4 sm:grid-cols-2`}>
            <Label text="Date issued"><input type="date" value={inv.issueDate} onChange={(e) => set("issueDate", e.target.value)} className={inputCls} /></Label>
            <Label text="Due date"><input type="date" value={inv.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={inputCls} /></Label>
            <Label text="Payment">
              <select value={inv.status} onChange={(e) => set("status", e.target.value as Invoice["status"])} className={inputCls}>
                <option>Pending payment</option><option>Paid</option>
              </select>
            </Label>
            <Label text="Order" hint={inv.orderStatus === "Fulfilled" && inv.fulfilledDate ? `Fulfilled on ${formatDate(inv.fulfilledDate)}` : undefined}>
              <select
                value={inv.orderStatus}
                onChange={(e) => {
                  const v = e.target.value as Invoice["orderStatus"];
                  setInv((p) => ({ ...p, orderStatus: v, fulfilledDate: v === "Fulfilled" ? p.fulfilledDate || today() : "" }));
                }}
                className={inputCls}
              >
                <option value="Pending">Order pending</option><option value="Fulfilled">Fulfilled</option>
              </select>
            </Label>
          </div>

          <div className={`${card} grid gap-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Client</h3>
              <select
                value={inv.customerId}
                onChange={(e) => {
                  const c = customers.find((x) => x.id === e.target.value);
                  setInv((p) => ({ ...p, customerId: c?.id || "", customer: c ? { ...emptyCustomer(), ...c } : emptyCustomer() }));
                }}
                className={`${inputCls} max-w-[260px]`}
              >
                <option value="">New client</option>
                {inv.customerId && !customers.some((c) => c.id === inv.customerId) && <option value={inv.customerId}>{inv.customer.name}</option>}
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}{c.phone ? ` (${c.phone})` : ""}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label text="Name *"><input value={inv.customer.name} onChange={(e) => setCust("name", e.target.value)} className={inputCls} /></Label>
              <Label text="Phone"><input value={inv.customer.phone} onChange={(e) => setCust("phone", e.target.value)} className={inputCls} /></Label>
              <Label text="Email"><input value={inv.customer.email} onChange={(e) => setCust("email", e.target.value)} className={inputCls} /></Label>
              <Label text="Company"><input value={inv.customer.company} onChange={(e) => setCust("company", e.target.value)} className={inputCls} /></Label>
            </div>
            <Label text="Address"><input value={inv.customer.address} onChange={(e) => setCust("address", e.target.value)} className={inputCls} /></Label>
            <p className="text-[12px] text-mute">The client is saved to Customers when you save the invoice{inv.customerId ? ", and changes here update their record" : ""}.</p>
          </div>

          <div className={`${card} grid gap-4`}>
            <h3 className="text-lg font-semibold">Vehicles</h3>
            {inv.vehicles.map((v, i) => (
              <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Label text="Make and model"><input placeholder="e.g. Toyota Camry" value={v.makeModel} onChange={(e) => set("vehicles", inv.vehicles.map((x, j) => (j === i ? { ...x, makeModel: e.target.value } : x)))} className={inputCls} /></Label>
                <Label text="Registration number"><input value={v.registration} onChange={(e) => set("vehicles", inv.vehicles.map((x, j) => (j === i ? { ...x, registration: e.target.value } : x)))} className={inputCls} /></Label>
                <button className={btnGhost} onClick={() => set("vehicles", inv.vehicles.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
            <button className={`${btnGhost} justify-self-start`} onClick={() => set("vehicles", [...inv.vehicles, { makeModel: "", registration: "" }])}>+ Add vehicle</button>
            <Label text="Installation location"><input placeholder="e.g. Lekki, Lagos" value={inv.installLocation} onChange={(e) => set("installLocation", e.target.value)} className={inputCls} /></Label>
          </div>

          <div className={`${card} grid gap-4`}>
            <h3 className="text-lg font-semibold">Items</h3>
            <div className="flex flex-wrap gap-2">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  className={btnSoft}
                  onClick={() => set("items", [...inv.items, { description: t.name, details: t.blurb, qty: vehicleCount, unitPrice: priceToNumber(t.price) }])}
                >
                  + {t.name} ({t.price})
                </button>
              ))}
              <button className={btnGhost} onClick={() => set("items", [...inv.items, { description: "", details: "", qty: 1, unitPrice: 0 }])}>+ Custom item</button>
            </div>
            {inv.items.map((it, i) => (
              <div key={i} className="grid gap-3 rounded-[12px] border border-[#eef1f8] bg-lav/60 p-3.5">
                <div className="grid gap-3 sm:grid-cols-[1fr_90px_140px]">
                  <Label text="Description"><input value={it.description} onChange={(e) => item(i, "description", e.target.value)} className={inputCls} /></Label>
                  <Label text="Qty"><input type="number" min={0} value={it.qty} onChange={(e) => item(i, "qty", e.target.value)} className={inputCls} /></Label>
                  <Label text="Unit price (₦)"><input type="number" min={0} value={it.unitPrice} onChange={(e) => item(i, "unitPrice", e.target.value)} className={inputCls} /></Label>
                </div>
                <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
                  <Label text="Details (optional)"><input value={it.details} onChange={(e) => item(i, "details", e.target.value)} className={inputCls} /></Label>
                  <button className={btnGhost} onClick={() => set("items", inv.items.filter((_, j) => j !== i))}>Remove</button>
                </div>
              </div>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              <Label text="Discount (₦)" hint="Leave at 0 for no discount.">
                <input type="number" min={0} value={inv.discount} onChange={(e) => set("discount", Number(e.target.value))} className={inputCls} />
              </Label>
              <div className="rounded-[12px] bg-brand-l p-4 text-brand-d">
                <p className="text-[12px] font-semibold uppercase tracking-wider">Total</p>
                <p className="text-2xl font-semibold">{naira(totals(inv).total)}</p>
              </div>
            </div>
          </div>

          <div className={card}>
            <Label text="Notes (optional)" hint="Printed on this invoice only. Terms and bank details are set in Invoice settings.">
              <textarea rows={3} value={inv.notes} onChange={(e) => set("notes", e.target.value)} className={`${inputCls} resize-y`} />
            </Label>
          </div>
        </div>

        {/* preview */}
        <div className="xl:sticky xl:top-6">
          <p className="mb-2 text-[13px] font-medium text-mute">Preview</p>
          <div ref={boxRef} className="w-full">
            <div style={{ height: docH * scale }} className="overflow-hidden rounded-[12px] shadow-[0_20px_60px_rgba(25,26,21,.12)]">
              <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: PAGE_W }}>
                <InvoiceDoc ref={docRef} inv={inv} settings={settings} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
