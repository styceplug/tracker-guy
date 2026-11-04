"use client";
import { useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { itemUnitCost, profitOf, today, totals, type Invoice } from "@/lib/invoice";
import { useAdmin } from "./store";
import { btnGhost, card, naira, PageHeader, Segmented } from "./ui";

type Period = "month" | "last" | "year" | "all";

const monthKey = (iso: string) => (iso || "").slice(0, 7); // YYYY-MM
const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return y && m ? new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "No date";
};

function inPeriod(inv: Invoice, p: Period) {
  if (p === "all") return true;
  const now = today();
  if (p === "year") return (inv.issueDate || "").slice(0, 4) === now.slice(0, 4);
  if (p === "month") return monthKey(inv.issueDate) === now.slice(0, 7);
  const d = new Date();
  const last = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  return monthKey(inv.issueDate) === `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}`;
}

const periodText: Record<Period, string> = { month: "this month", last: "last month", year: "this year", all: "all time" };

function Stat({ icon, label, value, sub, tone, onClick }: { icon: string; label: string; value: React.ReactNode; sub?: string; tone: string; onClick?: () => void }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={`${card} flex flex-col items-start gap-3 text-left max-sm:!p-4 sm:flex-row sm:gap-4 ${onClick ? "transition hover:-translate-y-0.5 hover:border-brand/40" : ""}`}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-[12px] sm:size-11 ${tone}`}><Icon name={icon} className="size-5 sm:size-[22px]" /></span>
      <div className="w-full min-w-0">
        <p className="text-[13px] font-medium text-mute">{label}</p>
        <p className="mt-0.5 truncate text-[20px] font-semibold leading-tight tracking-tight sm:text-[26px]">{value}</p>
        {sub && <p className="mt-0.5 text-[12px] text-mute sm:text-[13px]">{sub}</p>}
      </div>
    </Tag>
  );
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export default function Summary() {
  const { invoices, settings, tiers, loaded, nav } = useAdmin();
  const [period, setPeriod] = useState<Period>("month");

  const s = useMemo(() => {
    const list = invoices.filter((i) => inPeriod(i, period));
    const withProfit = list.map((i) => ({ inv: i, p: profitOf(i, settings, tiers) }));
    const paid = withProfit.filter((x) => x.inv.status === "Paid");
    const unpaid = withProfit.filter((x) => x.inv.status !== "Paid");
    const sum = (arr: typeof withProfit, k: "revenue" | "hardware" | "other" | "cost" | "profit") => arr.reduce((t, x) => t + x.p[k], 0);

    // tracker / item breakdown
    const items = new Map<string, { name: string; units: number; sales: number; cost: number }>();
    for (const { inv } of withProfit) {
      for (const it of inv.items) {
        const qty = Number(it.qty) || 0;
        if (!qty) continue;
        const name = (it.description || "Item").trim();
        const key = name.toLowerCase();
        const row = items.get(key) ?? { name, units: 0, sales: 0, cost: 0 };
        row.units += qty;
        row.sales += qty * (Number(it.unitPrice) || 0);
        row.cost += qty * (itemUnitCost(it, settings, tiers) ?? 0);
        items.set(key, row);
      }
    }

    // month breakdown
    const months = new Map<string, { key: string; jobs: number; made: number; outstanding: number; profit: number }>();
    for (const { inv, p } of withProfit) {
      const key = monthKey(inv.issueDate);
      const row = months.get(key) ?? { key, jobs: 0, made: 0, outstanding: 0, profit: 0 };
      row.jobs += 1;
      if (inv.status === "Paid") { row.made += p.revenue; row.profit += p.profit; }
      else row.outstanding += p.revenue;
      months.set(key, row);
    }

    const allUnpaid = invoices.filter((i) => i.status !== "Paid");
    return {
      count: list.length,
      made: sum(paid, "revenue"),
      paidCount: paid.length,
      outstanding: sum(unpaid, "revenue"),
      unpaidCount: unpaid.length,
      completed: list.filter((i) => i.orderStatus === "Fulfilled").length,
      pendingJobs: list.filter((i) => i.orderStatus !== "Fulfilled").length,
      hardware: sum(paid, "hardware"),
      other: sum(paid, "other"),
      profit: sum(paid, "profit"),
      expectedProfit: sum(withProfit, "profit"),
      missing: withProfit.filter((x) => x.p.missingCost).length,
      items: [...items.values()].sort((a, b) => b.sales - a.sales),
      months: [...months.values()].sort((a, b) => b.key.localeCompare(a.key)),
      allOutstanding: allUnpaid.reduce((t, i) => t + totals(i).total, 0),
      allUnpaidCount: allUnpaid.length,
      allPendingJobs: invoices.filter((i) => i.orderStatus !== "Fulfilled").length,
    };
  }, [invoices, settings, tiers, period]);

  if (!loaded) return <p className="text-mute">Loading...</p>;

  const margin = s.made > 0 ? Math.round((s.profit / s.made) * 100) : 0;
  const costShare = s.made > 0 ? Math.min(100, ((s.hardware + s.other) / s.made) * 100) : 0;
  const notAll = period !== "all";

  return (
    <div className="grid gap-5">
      <PageHeader title="Summary" sub={`Money and jobs for ${periodText[period]}, by invoice date.`} />

      <div className="max-w-full justify-self-start">
        <Segmented<Period>
          value={period}
          onChange={setPeriod}
          options={[{ v: "month", label: "This month" }, { v: "last", label: "Last month" }, { v: "year", label: "This year" }, { v: "all", label: "All time" }]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat icon="cash" label="Money made" value={naira(s.made)} sub={`${plural(s.paidCount, "paid invoice")}`} tone="bg-brand-l text-brand-d" />
        <Stat
          icon="clock"
          label="Still outside"
          value={naira(s.outstanding)}
          sub={`${plural(s.unpaidCount, "unpaid invoice")}${notAll && s.allOutstanding !== s.outstanding ? ` · ${naira(s.allOutstanding)} in total` : ""}`}
          tone="bg-[#fff1da] text-[#a56a00]"
          onClick={() => nav({ tab: "invoices" })}
        />
        <Stat icon="check" label="Completed jobs" value={s.completed} sub="Marked as fulfilled" tone="bg-[#e6eefc] text-[#2f5fb3]" />
        <Stat
          icon="wrench"
          label="Pending jobs"
          value={s.pendingJobs}
          sub={notAll && s.allPendingJobs !== s.pendingJobs ? `${s.allPendingJobs} pending in total` : "Not installed yet"}
          tone="bg-[#ffe9e0] text-[#c2410c]"
          onClick={() => nav({ tab: "invoices" })}
        />
      </div>

      {/* profit */}
      <section className={`${card} grid gap-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Actual profit</h2>
            <p className="text-[14px] text-mute">Paid invoices only, after hardware and other job costs.</p>
          </div>
          <div className="sm:text-right">
            <p className={`text-[30px] font-semibold leading-none tracking-tight ${s.profit < 0 ? "text-red-600" : "text-brand-d"}`}>{naira(s.profit)}</p>
            <p className="mt-1 text-[13px] text-mute">{s.made > 0 ? `${margin}% margin` : "No paid invoices yet"}</p>
          </div>
        </div>

        {s.made > 0 && (
          <div className="grid gap-2">
            <div className="flex h-3 overflow-hidden rounded-full bg-brand-l">
              <div className="h-full bg-[#f0b35a]" style={{ width: `${costShare}%` }} />
              <div className="h-full flex-1 bg-brand" />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-mute">
              <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-[#f0b35a]" />Costs</span>
              <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-brand" />Profit</span>
            </div>
          </div>
        )}

        <div className="grid gap-0 divide-y divide-[#eef1f8] text-[15px]">
          <div className="flex justify-between py-2.5"><span className="text-mute">Money made</span><span className="font-medium">{naira(s.made)}</span></div>
          <div className="flex justify-between py-2.5"><span className="text-mute">Hardware cost</span><span className="font-medium">-{naira(s.hardware)}</span></div>
          <div className="flex justify-between py-2.5"><span className="text-mute">Other job costs</span><span className="font-medium">-{naira(s.other)}</span></div>
          <div className="flex justify-between py-2.5 text-base font-semibold"><span>Profit</span><span className={s.profit < 0 ? "text-red-600" : ""}>{naira(s.profit)}</span></div>
        </div>

        {s.unpaidCount > 0 && (
          <p className="rounded-[10px] bg-lav px-4 py-3 text-[14px] text-mute">
            If the {plural(s.unpaidCount, "unpaid invoice")} {s.unpaidCount === 1 ? "gets" : "get"} paid, profit for {periodText[period]} goes to <b className="text-ink">{naira(s.expectedProfit)}</b>.
          </p>
        )}

        {s.missing > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] bg-[#fff6e6] px-4 py-3 text-[14px] text-[#a56a00]">
            <span>{plural(s.missing, "invoice")} {s.missing === 1 ? "has" : "have"} trackers with no hardware cost set, so profit looks higher than it is.</span>
            <button className={btnGhost} onClick={() => nav({ tab: "settings" })}>Set hardware costs</button>
          </div>
        )}
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className={card}>
          <h2 className="mb-1 text-lg font-semibold">By item</h2>
          <p className="mb-3 text-[13px] text-mute">All invoices in this period, paid or not. Before discounts.</p>
          {s.items.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-mute">Nothing sold {periodText[period]}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="text-[12px] uppercase tracking-wider text-mute">
                  <tr><th className="py-2 font-semibold">Item</th><th className="pl-3 text-right font-semibold"><span className="sm:hidden">Qty</span><span className="max-sm:hidden">Units</span></th><th className="pl-3 text-right font-semibold">Sales</th><th className="hidden pl-3 text-right font-semibold sm:table-cell">Cost</th><th className="pl-3 text-right font-semibold">Profit</th></tr>
                </thead>
                <tbody>
                  {s.items.map((r) => (
                    <tr key={r.name} className="border-t border-[#eef1f8]">
                      <td className="py-3 pr-2 font-medium">{r.name}</td>
                      <td className="pl-3 text-right">{r.units}</td>
                      <td className="pl-3 text-right">{naira(r.sales)}</td>
                      <td className="hidden pl-3 text-right text-mute sm:table-cell">{naira(r.cost)}</td>
                      <td className="pl-3 text-right font-medium">{naira(r.sales - r.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={card}>
          <h2 className="mb-1 text-lg font-semibold">By month</h2>
          <p className="mb-3 text-[13px] text-mute">Profit is from paid invoices only.</p>
          {s.months.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-mute">No invoices {periodText[period]}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="text-[12px] uppercase tracking-wider text-mute">
                  <tr><th className="py-2 font-semibold">Month</th><th className="pl-3 text-right font-semibold">Jobs</th><th className="pl-3 text-right font-semibold">Made</th><th className="hidden pl-3 text-right font-semibold sm:table-cell">Outside</th><th className="pl-3 text-right font-semibold">Profit</th></tr>
                </thead>
                <tbody>
                  {s.months.map((r) => (
                    <tr key={r.key} className="border-t border-[#eef1f8]">
                      <td className="py-3 font-medium">{monthLabel(r.key)}</td>
                      <td className="pl-3 text-right">{r.jobs}</td>
                      <td className="pl-3 text-right">{naira(r.made)}</td>
                      <td className="hidden pl-3 text-right text-[#a56a00] sm:table-cell">{r.outstanding ? naira(r.outstanding) : "-"}</td>
                      <td className={`text-right font-medium ${r.profit < 0 ? "text-red-600" : ""}`}>{naira(r.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
