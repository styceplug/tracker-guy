"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { deleteCustomer, emptyCustomer, emptyVehicle, formatDate, formatDateTime, newInvoice, saveCustomer, today, totals, type Customer, type CustomerVehicle } from "@/lib/invoice";
import { useAdmin } from "./store";
import { btn, btnDanger, btnGhost, card, Empty, inputCls, Label, ListRow, naira, OrderPill, PageHeader, PaymentPill, SearchBox } from "./ui";

export default function Customers() {
  const { customers, invoices, loaded, route, nav } = useAdmin();
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return customers.filter(
      (c) =>
        !s ||
        [c.name, c.phone, c.email, c.company, ...(c.vehicles || []).flatMap((v) => [v.plate, v.simNumber, v.makeModel])].some((x) => (x || "").toLowerCase().includes(s)),
    );
  }, [customers, q]);

  if (route.view === "new") return <CustomerForm initial={{ ...emptyCustomer(), vehicles: [{ ...emptyVehicle(), installDate: today() }] }} />;
  if (route.view === "detail") {
    const c = customers.find((x) => x.id === route.id);
    if (!c) return <p className="text-mute">{loaded ? "This customer no longer exists." : "Loading..."}</p>;
    return <Detail c={c} />;
  }

  const stats = (id?: string) => {
    const mine = invoices.filter((i) => i.customerId === id);
    return { count: mine.length, owed: mine.filter((i) => i.status !== "Paid").reduce((s, i) => s + totals(i).total, 0) };
  };

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Customers"
        sub={`${customers.length} customer${customers.length === 1 ? "" : "s"}`}
        actions={<button className={btn} onClick={() => nav({ tab: "customers", view: "new" })}><Icon name="plus" className="size-4" />New customer</button>}
      />
      <div className={card}>
        <div className="mb-3"><SearchBox value={q} onChange={setQ} placeholder="Search name, phone, plate, SIM" /></div>
        {!loaded ? (
          <p className="py-8 text-center text-mute">Loading...</p>
        ) : shown.length === 0 ? (
          <Empty icon="users" title="No customers yet" text="Customers are added when you save an invoice or convert a form submission." />
        ) : (
          shown.map((c) => {
            const s = stats(c.id);
            return (
              <ListRow
                key={c.id}
                onClick={() => nav({ tab: "customers", view: "detail", id: c.id })}
                title={c.name}
                sub={[c.phone, c.company, ...(c.vehicles || []).map((v) => v.plate)].filter(Boolean).join(" · ") || c.email}
                right={
                  <>
                    <span className="block text-[13px] text-mute">{s.count} order{s.count === 1 ? "" : "s"}</span>
                    {s.owed > 0 && <span className="block text-[13px] text-[#a56a00]">{naira(s.owed)} owed</span>}
                  </>
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function Detail({ c }: { c: Customer }) {
  const { invoices, submissions, nav, startInvoice, reload, toast, fail } = useAdmin();
  const [editing, setEditing] = useState(false);
  const orders = invoices.filter((i) => i.customerId === c.id);
  const forms = submissions.filter((s) => s.customerId === c.id);
  const billed = orders.reduce((s, i) => s + totals(i).total, 0);
  const owed = orders.filter((i) => i.status !== "Paid").reduce((s, i) => s + totals(i).total, 0);
  const open = orders.filter((i) => i.orderStatus !== "Fulfilled").length;

  async function remove() {
    if (!confirm(`Delete ${c.name}? Their invoices are kept.`)) return;
    try {
      await deleteCustomer(c.id!);
      await reload();
      toast("Customer deleted.");
      nav({ tab: "customers" });
    } catch (e) {
      fail(e);
    }
  }

  if (editing) return <CustomerForm initial={c} onDone={() => setEditing(false)} />;

  return (
    <div className="grid gap-5">
      <PageHeader
        onBack={() => nav({ tab: "customers" })}
        title={c.name}
        sub={c.company || undefined}
        actions={
          <>
            <button className={btnGhost} onClick={() => setEditing(true)}>Edit</button>
            <button className={btnDanger} onClick={remove}><Icon name="trash" className="size-4" />Delete</button>
            <button className={btn} onClick={() => startInvoice({ ...newInvoice(), customerId: c.id!, customer: { ...emptyCustomer(), ...c } })}>
              <Icon name="plus" className="size-4" />New invoice
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total billed", naira(billed), `${orders.length} order${orders.length === 1 ? "" : "s"}`],
          ["Pending payment", naira(owed), owed ? "Still to be paid" : "Nothing owed"],
          ["Orders to fulfil", String(open), open ? "Not installed yet" : "All fulfilled"],
        ].map(([k, v, sub]) => (
          <div key={k} className={card}>
            <p className="text-[13px] font-medium text-mute">{k}</p>
            <p className="mt-0.5 text-[24px] font-semibold tracking-tight">{v}</p>
            <p className="text-[13px] text-mute">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.6fr]">
        <div className={card}>
          <h2 className="mb-1 text-lg font-semibold">Contact</h2>
          <div className="divide-y divide-[#eef1f8] text-[14px]">
            {c.phone && <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 py-3 text-brand-d"><Icon name="phone" className="size-4" />{c.phone}</a>}
            {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-3 break-all py-3 text-brand-d"><Icon name="mail" className="size-4 shrink-0" />{c.email}</a>}
            {c.address && <p className="flex items-start gap-3 py-3"><Icon name="pin" className="mt-0.5 size-4 shrink-0 text-mute" />{c.address}</p>}
            {!c.phone && !c.email && !c.address && <p className="py-3 text-mute">No contact details.</p>}
          </div>
          <h2 className="mb-1 mt-5 text-lg font-semibold">Vehicles & trackers</h2>
          {(c.vehicles || []).length === 0 ? (
            <p className="py-2 text-[14px] text-mute">None added. Click Edit to add their vehicle, plate, tracker SIM and install date.</p>
          ) : (
            <div className="divide-y divide-[#eef1f8] text-[14px]">
              {(c.vehicles || []).map((v, i) => (
                <div key={i} className="grid gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="car" className="size-4 shrink-0 text-mute" />
                    <span className="font-semibold">{v.makeModel || "Vehicle"}</span>
                    {v.plate && <span className="rounded-[6px] bg-lav px-2 py-0.5 text-[12px] font-semibold tracking-wide">{v.plate}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 pl-6 text-[13px] text-mute">
                    <span>SIM: {v.simNumber ? <a href={`tel:${v.simNumber.replace(/[^\d+]/g, "")}`} className="text-brand-d hover:underline">{v.simNumber}</a> : "-"}</span>
                    <span>Installed: {v.installDate ? formatDate(v.installDate) : "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {forms.length > 0 && (
            <div className="mt-4 rounded-[12px] bg-lav p-3.5 text-[13px]">
              <p className="font-semibold">From the installation form</p>
              {forms.map((f) => (
                <button key={f.id} onClick={() => nav({ tab: "submissions", view: "detail", id: f.id })} className="mt-1 block text-left text-brand-d hover:underline">
                  {f.vehicleMake}{f.plate ? ` · ${f.plate}` : ""} · {formatDateTime(f.createdAt)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={card}>
          <h2 className="mb-1 text-lg font-semibold">Order records</h2>
          {orders.length === 0 ? (
            <Empty icon="file" title="No orders yet" text="Invoices you create for this customer show up here." />
          ) : (
            orders.map((i) => (
              <ListRow
                key={i.id}
                onClick={() => nav({ tab: "invoices", view: "order", id: i.id })}
                title={i.number}
                sub={`${formatDate(i.issueDate)} · ${i.items.map((x) => x.description).filter(Boolean).join(", ") || "No items"}`}
                right={naira(totals(i).total)}
                meta={<><PaymentPill status={i.status} /><OrderPill status={i.orderStatus} /></>}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerForm({ initial, onDone }: { initial: Customer; onDone?: () => void }) {
  const { nav, reload, toast, fail, setGuard } = useAdmin();
  const [c, setC] = useState<Customer>({ ...initial, vehicles: initial.vehicles?.length ? initial.vehicles : [emptyVehicle()] });
  const setV = (i: number, k: keyof CustomerVehicle, v: string) =>
    setC((p) => ({ ...p, vehicles: (p.vehicles || []).map((x, j) => (j === i ? { ...x, [k]: v } : x)) }));
  const [busy, setBusy] = useState(false);
  const [start] = useState(() => JSON.stringify(c));
  const dirty = JSON.stringify(c) !== start;

  useEffect(() => { setGuard(() => dirty); return () => setGuard(null); }, [dirty, setGuard]);

  async function save() {
    if (!c.name.trim()) return toast("Name is required.", "err");
    setBusy(true);
    try {
      const id = await saveCustomer(c);
      await reload();
      toast("Customer saved.");
      setGuard(null);
      if (onDone) onDone();
      else nav({ tab: "customers", view: "detail", id });
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  const cancel = () => (onDone ? onDone() : nav({ tab: "customers" }));
  return (
    <div className="grid gap-5">
      <PageHeader onBack={cancel} title={initial.id ? `Edit ${initial.name}` : "New customer"} />
      <div className={`${card} grid gap-4`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label text="Name *"><input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className={inputCls} /></Label>
          <Label text="Phone"><input type="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} className={inputCls} /></Label>
          <Label text="Email"><input type="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} className={inputCls} /></Label>
          <Label text="Company"><input value={c.company} onChange={(e) => setC({ ...c, company: e.target.value })} className={inputCls} /></Label>
        </div>
        <Label text="Address"><input value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} className={inputCls} /></Label>
      </div>

      <div className={`${card} grid gap-4`}>
        <div>
          <h3 className="text-lg font-semibold">Vehicles & trackers</h3>
          <p className="text-[13px] text-mute">One row per vehicle. Add more for fleet customers.</p>
        </div>
        {(c.vehicles || []).map((v, i) => (
          <div key={i} className="grid gap-3 rounded-[12px] border border-[#eef1f8] bg-lav/60 p-3.5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Label text="Vehicle make / model"><input placeholder="e.g. Toyota Corolla" value={v.makeModel} onChange={(e) => setV(i, "makeModel", e.target.value)} className={inputCls} /></Label>
              <Label text="Plate number"><input placeholder="e.g. LND 123 AB" value={v.plate} onChange={(e) => setV(i, "plate", e.target.value.toUpperCase())} className={inputCls} /></Label>
              <Label text="Tracker SIM number"><input type="tel" placeholder="e.g. 0803 000 0000" value={v.simNumber} onChange={(e) => setV(i, "simNumber", e.target.value)} className={inputCls} /></Label>
              <Label text="Date of installation"><input type="date" value={v.installDate} onChange={(e) => setV(i, "installDate", e.target.value)} className={inputCls} /></Label>
            </div>
            {(c.vehicles || []).length > 1 && (
              <button className={`${btnGhost} justify-self-start`} onClick={() => setC((p) => ({ ...p, vehicles: (p.vehicles || []).filter((_, j) => j !== i) }))}>Remove vehicle</button>
            )}
          </div>
        ))}
        <button className={`${btnGhost} justify-self-start`} onClick={() => setC((p) => ({ ...p, vehicles: [...(p.vehicles || []), { ...emptyVehicle(), installDate: today() }] }))}>+ Add vehicle</button>
      </div>

      <div className="flex gap-2">
          <button className={btn} onClick={save} disabled={busy}>{busy ? "Saving..." : "Save customer"}</button>
          <button className={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}
