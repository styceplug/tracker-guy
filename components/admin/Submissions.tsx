"use client";
import { useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { convertSubmission, deleteSubmission, formatDateTime, invoiceFromSubmission, matchCustomer, type Customer, type Submission } from "@/lib/invoice";
import { useAdmin } from "./store";
import { btn, btnDanger, btnGhost, btnSoft, card, Empty, ListRow, PageHeader, SearchBox, Segmented, SubmissionPill } from "./ui";

type Filter = "New" | "Converted" | "All";

export default function Submissions() {
  const { submissions, loaded, route, nav } = useAdmin();
  const [filter, setFilter] = useState<Filter>("New");
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return submissions.filter(
      (x) => (filter === "All" || x.status === filter) && (!s || [x.name, x.phone, x.email, x.vehicleMake, x.plate].some((v) => (v || "").toLowerCase().includes(s))),
    );
  }, [submissions, filter, q]);

  if (route.view === "detail") {
    const sub = submissions.find((s) => s.id === route.id);
    if (!sub) return <p className="text-mute">{loaded ? "This submission no longer exists." : "Loading..."}</p>;
    return <Detail s={sub} />;
  }

  const fresh = submissions.filter((s) => s.status === "New").length;
  return (
    <div className="grid gap-5">
      <PageHeader
        title="Form submissions"
        sub={<>From your installation form at <a href="/form" target="_blank" rel="noopener" className="font-medium text-brand-d underline-offset-4 hover:underline">/form</a> · {fresh} new</>}
      />
      <div className={card}>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <SearchBox value={q} onChange={setQ} placeholder="Search name, phone, vehicle" />
          <Segmented<Filter> value={filter} onChange={setFilter} options={[{ v: "New", label: `New (${fresh})` }, { v: "Converted", label: "Converted" }, { v: "All", label: "All" }]} />
        </div>
        {!loaded ? (
          <p className="py-8 text-center text-mute">Loading...</p>
        ) : shown.length === 0 ? (
          <Empty icon="inbox" title={filter === "New" ? "No new submissions" : "Nothing here"} text="When someone fills in your installation form, it shows up here." />
        ) : (
          shown.map((s) => (
            <ListRow
              key={s.id}
              onClick={() => nav({ tab: "submissions", view: "detail", id: s.id })}
              title={s.name}
              sub={`${s.vehicleMake}${s.plate ? " · " + s.plate : ""} · ${s.phone}`}
              right={<span className="text-[12px] font-normal text-mute">{formatDateTime(s.createdAt)}</span>}
              meta={<SubmissionPill status={s.status} />}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Detail({ s }: { s: Submission }) {
  const { customers, nav, reload, startInvoice, toast, fail } = useAdmin();
  const [busy, setBusy] = useState("");
  const match = s.status === "New" ? matchCustomer(customers, s) : undefined;
  const linked = s.customerId ? customers.find((c) => c.id === s.customerId) : undefined;

  async function convert(existing?: Customer) {
    setBusy(existing ? "existing" : "new");
    try {
      const c = await convertSubmission(s, existing);
      await reload();
      toast(existing ? `Linked to ${c.name}. Fill in the invoice.` : `${c.name} added to customers. Fill in the invoice.`);
      startInvoice(invoiceFromSubmission(s, c));
    } catch (e) {
      fail(e);
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    if (!confirm(`Delete the submission from ${s.name}? This cannot be undone.`)) return;
    try {
      await deleteSubmission(s.id!);
      await reload();
      toast("Submission deleted.");
      nav({ tab: "submissions" });
    } catch (e) {
      fail(e);
    }
  }

  const rows: [string, string, string?][] = [
    ["Name", s.name],
    ["Address", s.address],
    ["Email Address", s.email, `mailto:${s.email}`],
    ["Vehicle make", s.vehicleMake],
    ["Phone number", s.phone, `tel:${s.phone.replace(/[^\d+]/g, "")}`],
    ["Plate Number", s.plate || "-"],
  ];

  return (
    <div className="grid gap-5">
      <PageHeader
        onBack={() => nav({ tab: "submissions" })}
        title={s.name}
        sub={<span className="flex flex-wrap items-center gap-2"><SubmissionPill status={s.status} />Sent {formatDateTime(s.createdAt)}</span>}
        actions={<button className={btnDanger} onClick={remove}><Icon name="trash" className="size-4" />Delete</button>}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className={card}>
          <h2 className="mb-1 text-lg font-semibold">Submitted details</h2>
          <div className="divide-y divide-[#eef1f8]">
            {rows.map(([k, v, href]) => (
              <div key={k} className="grid gap-0.5 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
                <span className="text-[13px] text-mute sm:text-[14px]">{k}</span>
                {href && v ? <a href={href} className="break-words font-medium text-brand-d underline-offset-4 hover:underline">{v}</a> : <span className="break-words font-medium">{v}</span>}
              </div>
            ))}
          </div>
          <a
            href={`https://wa.me/${s.phone.replace(/\D/g, "").replace(/^0/, "234")}`}
            target="_blank"
            rel="noopener"
            className={`${btnGhost} mt-4`}
          >
            <Icon name="phone" className="size-4" />Message on WhatsApp
          </a>
        </div>

        <div className={`${card} grid gap-3`}>
          {s.status === "Converted" ? (
            <>
              <h2 className="text-lg font-semibold">Converted</h2>
              <p className="text-[14px] text-mute">
                {linked ? <>This person is now the customer <b className="text-ink">{linked.name}</b>.</> : "This person was added to your customers."}
                {s.convertedAt ? ` (${formatDateTime(s.convertedAt)})` : ""}
              </p>
              {linked && <button className={btnSoft} onClick={() => nav({ tab: "customers", view: "detail", id: linked.id })}>Open customer</button>}
              {linked && <button className={btnGhost} onClick={() => startInvoice(invoiceFromSubmission(s, linked))}>New invoice from this form</button>}
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Make them a customer</h2>
              <p className="text-[14px] text-mute">Saves their name, phone, email and address to Customers, then opens a new invoice with their vehicle filled in.</p>
              {match ? (
                <>
                  <p className="rounded-[10px] bg-[#fff6e6] px-4 py-3 text-[14px] text-[#a56a00]">
                    You already have a customer with this phone number or email: <b>{match.name}</b>{match.phone ? ` (${match.phone})` : ""}.
                  </p>
                  <button className={btn} disabled={!!busy} onClick={() => convert(match)}>{busy === "existing" ? "Working..." : `Use ${match.name}`}</button>
                  <button className={btnGhost} disabled={!!busy} onClick={() => convert()}>{busy === "new" ? "Working..." : "Create a new customer anyway"}</button>
                </>
              ) : (
                <button className={btn} disabled={!!busy} onClick={() => convert()}>{busy ? "Working..." : "Convert to customer + start invoice"}</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
