"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { adjustStock, deleteInventoryItem, emptyInventoryItem, saveInventoryItem, saveSettings, type InventoryItem } from "@/lib/invoice";
import { useAdmin } from "./store";
import { btn, btnDanger, btnGhost, card, Empty, inputCls, Label, naira, PageHeader, SearchBox } from "./ui";

export const isLow = (i: InventoryItem) => (Number(i.quantity) || 0) <= (Number(i.reorderAt) || 0);

export default function Inventory() {
  const { inventory, tiers, loaded, route, nav, reload, fail } = useAdmin();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState("");

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return inventory.filter((i) => !s || [i.name, i.supplier, i.notes].some((x) => (x || "").toLowerCase().includes(s)));
  }, [inventory, q]);

  if (route.view === "new") return <ItemForm initial={emptyInventoryItem()} />;
  if (route.view === "edit") {
    const item = inventory.find((i) => i.id === route.id);
    if (!item) return <p className="text-mute">{loaded ? "This item no longer exists." : "Loading..."}</p>;
    return <ItemForm key={item.id} initial={item} />;
  }

  const units = inventory.reduce((s, i) => s + Math.max(0, Number(i.quantity) || 0), 0);
  const value = inventory.reduce((s, i) => s + Math.max(0, Number(i.quantity) || 0) * (Number(i.unitCost) || 0), 0);
  const low = inventory.filter(isLow);
  const planName = (id: string) => tiers.find((t) => t.id === id)?.name;

  async function bump(i: InventoryItem, delta: number) {
    setBusy(i.id! + delta);
    try { await adjustStock(i.id!, delta); await reload(); }
    catch (e) { fail(e); }
    finally { setBusy(""); }
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Inventory"
        sub="Trackers, SIMs and anything else you keep in stock."
        actions={<button className={btn} onClick={() => nav({ tab: "inventory", view: "new" })}><Icon name="plus" className="size-4" />Add item</button>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <div className={`${card} max-sm:!p-4`}>
          <p className="text-[13px] font-medium text-mute">In stock</p>
          <p className="mt-0.5 text-[22px] font-semibold tracking-tight sm:text-[26px]">{units}</p>
          <p className="text-[12px] text-mute sm:text-[13px]">{inventory.length} item type{inventory.length === 1 ? "" : "s"}</p>
        </div>
        <div className={`${card} max-sm:!p-4`}>
          <p className="text-[13px] font-medium text-mute">Stock value</p>
          <p className="mt-0.5 truncate text-[22px] font-semibold tracking-tight sm:text-[26px]">{naira(value)}</p>
          <p className="text-[12px] text-mute sm:text-[13px]">At what you paid</p>
        </div>
        <div className={`${card} max-sm:col-span-2 max-sm:!p-4 ${low.length ? "!border-[#f5d9a8] !bg-[#fffaf0]" : ""}`}>
          <p className="text-[13px] font-medium text-mute">Running low</p>
          <p className={`mt-0.5 text-[22px] font-semibold tracking-tight sm:text-[26px] ${low.length ? "text-[#a56a00]" : ""}`}>{low.length}</p>
          <p className="truncate text-[12px] text-mute sm:text-[13px]">{low.length ? low.map((i) => i.name).join(", ") : "All good"}</p>
        </div>
      </div>

      <div className={card}>
        <div className="mb-3"><SearchBox value={q} onChange={setQ} placeholder="Search items, supplier" /></div>
        {!loaded ? (
          <p className="py-8 text-center text-mute">Loading...</p>
        ) : shown.length === 0 ? (
          <Empty
            icon="box"
            title={inventory.length ? "Nothing matches" : "No stock added yet"}
            text={inventory.length ? "Try a different search." : "Add your trackers and link each one to its plan. Fulfilled orders then take them out of stock on their own."}
            action={!inventory.length && <button className={btn} onClick={() => nav({ tab: "inventory", view: "new" })}>Add your first item</button>}
          />
        ) : (
          shown.map((i) => {
            const qty = Number(i.quantity) || 0;
            return (
              <div key={i.id} className="flex flex-wrap items-center gap-3 border-t border-[#eef1f8] py-3.5 first:border-t-0">
                <button onClick={() => nav({ tab: "inventory", view: "edit", id: i.id })} className="min-w-0 flex-1 basis-[200px] text-left">
                  <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold">
                    {i.name}
                    {planName(i.plan) && <span className="rounded-full bg-brand-l px-2 py-0.5 text-[11px] font-semibold text-brand-d">{planName(i.plan)}</span>}
                    {isLow(i) && <span className="rounded-full bg-[#fff1da] px-2 py-0.5 text-[11px] font-semibold text-[#a56a00]">{qty <= 0 ? "Out of stock" : "Low"}</span>}
                  </p>
                  <p className="truncate text-[13px] text-mute">
                    {naira(Number(i.unitCost) || 0)} each · {naira(Math.max(0, qty) * (Number(i.unitCost) || 0))} in stock{i.supplier ? ` · ${i.supplier}` : ""}
                  </p>
                </button>
                <div className="flex items-center gap-1.5">
                  <button aria-label={`One less ${i.name}`} disabled={!!busy} onClick={() => bump(i, -1)} className="grid size-9 place-items-center rounded-[10px] border border-[#e3e7ef] bg-white text-lg font-medium hover:border-ink/30 disabled:opacity-50">−</button>
                  <span className={`min-w-12 text-center text-[17px] font-semibold ${qty < 0 ? "text-red-600" : ""}`}>{qty}</span>
                  <button aria-label={`One more ${i.name}`} disabled={!!busy} onClick={() => bump(i, 1)} className="grid size-9 place-items-center rounded-[10px] border border-[#e3e7ef] bg-white text-lg font-medium hover:border-ink/30 disabled:opacity-50">+</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {inventory.length > 0 && (
        <p className="text-[13px] text-mute">
          Stock linked to a tracker plan goes down when you mark an order as fulfilled, and goes back up if you undo it or delete the invoice.
        </p>
      )}
    </div>
  );
}

function ItemForm({ initial }: { initial: InventoryItem }) {
  const { tiers, settings, nav, reload, toast, fail, setGuard } = useAdmin();
  const [it, setIt] = useState<InventoryItem>(initial);
  const [restock, setRestock] = useState("");
  const [useCost, setUseCost] = useState(true);
  const [busy, setBusy] = useState("");
  const dirty = JSON.stringify(it) !== JSON.stringify(initial) || !!restock;
  useEffect(() => { setGuard(() => dirty); return () => setGuard(null); }, [dirty, setGuard]);

  const plan = tiers.find((t) => t.id === it.plan);
  const currentCost = plan ? settings.hardwareCosts?.[plan.id] : undefined;
  const costDiffers = !!plan && Number(it.unitCost) > 0 && Number(currentCost) !== Number(it.unitCost);
  const set = <K extends keyof InventoryItem>(k: K, v: InventoryItem[K]) => setIt((p) => ({ ...p, [k]: v }));
  const back = () => nav({ tab: "inventory" });

  async function save() {
    if (!it.name.trim()) return toast("Give the item a name.", "err");
    setBusy("save");
    try {
      const quantity = (Number(it.quantity) || 0) + (Number(restock) || 0);
      await saveInventoryItem({ ...it, quantity });
      if (plan && costDiffers && useCost) {
        await saveSettings({ ...settings, hardwareCosts: { ...(settings.hardwareCosts || {}), [plan.id]: Number(it.unitCost) } });
      }
      setGuard(null);
      await reload();
      toast(`${it.name.trim()} saved.`);
      back();
    } catch (e) {
      fail(e);
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    if (!it.id || !confirm(`Delete ${it.name}? This cannot be undone.`)) return;
    try { await deleteInventoryItem(it.id); setGuard(null); await reload(); toast("Item deleted."); back(); }
    catch (e) { fail(e); }
  }

  return (
    <div className="grid max-w-[760px] gap-5">
      <PageHeader
        onBack={back}
        title={initial.id ? initial.name : "Add stock item"}
        actions={initial.id && <button className={btnDanger} onClick={remove}><Icon name="trash" className="size-4" />Delete</button>}
      />
      <div className={`${card} grid gap-4`}>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <Label text="Item name *"><input placeholder="e.g. Standard tracker device" value={it.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Label>
          <Label text="Used for" hint="Linked stock goes down when an order with that tracker is fulfilled.">
            <select value={it.plan} onChange={(e) => set("plan", e.target.value)} className={inputCls}>
              <option value="">Not linked (SIMs, cables, other)</option>
              {tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Label>
          <Label text={initial.id ? "Quantity in stock now" : "Quantity in stock"}>
            <input type="number" value={it.quantity} onChange={(e) => set("quantity", Number(e.target.value))} className={inputCls} />
          </Label>
          {initial.id ? (
            <Label text="Restock: add new units" hint={restock ? `Stock becomes ${(Number(it.quantity) || 0) + (Number(restock) || 0)} when you save.` : "Just bought more? Type how many."}>
              <input type="number" min={0} placeholder="0" value={restock} onChange={(e) => setRestock(e.target.value)} className={inputCls} />
            </Label>
          ) : (
            <div className="max-sm:hidden" />
          )}
          <Label text="Cost per unit (₦)" hint="What you pay for one.">
            <input type="number" min={0} value={it.unitCost} onChange={(e) => set("unitCost", Number(e.target.value))} className={inputCls} />
          </Label>
          <Label text="Warn me when stock is at or below">
            <input type="number" min={0} value={it.reorderAt} onChange={(e) => set("reorderAt", Number(e.target.value))} className={inputCls} />
          </Label>
          <Label text="Supplier (optional)"><input value={it.supplier} onChange={(e) => set("supplier", e.target.value)} className={inputCls} /></Label>
        </div>
        <Label text="Notes (optional)"><textarea rows={2} value={it.notes} onChange={(e) => set("notes", e.target.value)} className={`${inputCls} resize-y`} /></Label>

        {costDiffers && (
          <label className="flex items-start gap-3 rounded-[10px] bg-brand-l/60 px-4 py-3 text-[14px]">
            <input type="checkbox" checked={useCost} onChange={(e) => setUseCost(e.target.checked)} className="mt-1 size-4 accent-[#54bd95]" />
            <span>
              Use {naira(Number(it.unitCost))} as the hardware cost for <b>{plan!.name}</b> in profit
              {currentCost !== undefined ? <span className="text-mute"> (now {naira(Number(currentCost))})</span> : <span className="text-mute"> (not set yet)</span>}.
              <span className="block text-[12px] text-mute">Affects new invoices and older ones that have no cost of their own.</span>
            </span>
          </label>
        )}

        <div className="flex gap-2">
          <button className={btn} onClick={save} disabled={!!busy}>{busy ? "Saving..." : "Save item"}</button>
          <button className={btnGhost} onClick={back}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
