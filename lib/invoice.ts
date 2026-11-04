// Invoice data, defaults and Firestore helpers.
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query,
  runTransaction, serverTimestamp, setDoc, updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { defaultContent } from "./content";

export type Customer = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  address: string;
};

export type Vehicle = { makeModel: string; registration: string };
/** unitCost is what one unit costs you (hardware). Admin only, never printed on the invoice. */
export type LineItem = { description: string; details: string; qty: number; unitPrice: number; unitCost?: number };
export type InvoiceStatus = "Pending payment" | "Paid";
export type OrderStatus = "Pending" | "Fulfilled";

export type Invoice = {
  id?: string;
  number: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;
  status: InvoiceStatus; // payment status
  orderStatus: OrderStatus;
  fulfilledDate: string; // YYYY-MM-DD, set when marked fulfilled
  customerId: string;
  customer: Customer;
  vehicles: Vehicle[];
  installLocation: string;
  items: LineItem[];
  discount: number;
  /** Other costs for this job (installer, transport...). Admin only, never printed. */
  otherCost: number;
  notes: string;
};

export type InvoiceSettings = {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  terms: string[];
  thankYou: string;
  prefix: string;
  /** What one tracker costs you, by plan id (e.g. standard, advanced). Used for profit. */
  hardwareCosts: Record<string, number>;
};

const b = defaultContent.business;

// Starting values come from what the website already says. Bank details are left blank to be filled in.
export const defaultSettings: InvoiceSettings = {
  businessName: b.name,
  tagline: defaultContent.footer.tagline,
  phone: b.phone,
  email: b.email,
  website: b.url.replace(/^https?:\/\//, ""),
  address: b.location,
  bankName: "",
  accountName: "",
  accountNumber: "",
  terms: [
    defaultContent.plans.simNote,
    "Standard tracker: " + defaultContent.plans.tiers[0].fee + ". " + defaultContent.plans.tiers[0].note,
  ],
  thankYou: "Thank you for choosing The Tracker Guy.",
  prefix: "INV",
  hardwareCosts: {},
};

export const emptyCustomer = (): Customer => ({ name: "", phone: "", email: "", company: "", address: "" });

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const newInvoice = (): Invoice => ({
  number: "",
  issueDate: today(),
  dueDate: today(),
  status: "Pending payment",
  orderStatus: "Pending",
  fulfilledDate: "",
  customerId: "",
  customer: emptyCustomer(),
  vehicles: [{ makeModel: "", registration: "" }],
  installLocation: "",
  items: [],
  discount: 0,
  otherCost: 0,
  notes: "",
});

export function totals(inv: Pick<Invoice, "items" | "discount">) {
  const subtotal = inv.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
  const discount = Math.min(Math.max(Number(inv.discount) || 0, 0), subtotal);
  return { subtotal, discount, total: subtotal - discount };
}

export const formatDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// ---------- Firestore ----------
const db = () => getFirestore(firebaseApp());

export async function loadSettings(): Promise<InvoiceSettings> {
  const snap = await getDoc(doc(db(), "settings", "invoice"));
  return { ...defaultSettings, ...(snap.exists() ? (snap.data() as Partial<InvoiceSettings>) : {}) };
}
export const saveSettings = (s: InvoiceSettings) => setDoc(doc(db(), "settings", "invoice"), s);

export async function listCustomers(): Promise<Customer[]> {
  const snap = await getDocs(query(collection(db(), "customers"), orderBy("name")));
  return snap.docs.map((d) => ({ ...(d.data() as Customer), id: d.id }));
}

export async function saveCustomer(c: Customer): Promise<string> {
  const { id, ...data } = c;
  if (id) {
    await updateDoc(doc(db(), "customers", id), { ...data, updatedAt: serverTimestamp() });
    return id;
  }
  const ref = await addDoc(collection(db(), "customers"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}
export const deleteCustomer = (id: string) => deleteDoc(doc(db(), "customers", id));

export async function listInvoices(): Promise<Invoice[]> {
  const snap = await getDocs(query(collection(db(), "invoices"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => normalizeInvoice({ ...(d.data() as Invoice), id: d.id }));
}

/** Fills in fields that older saved invoices may not have. */
export function normalizeInvoice(i: Invoice): Invoice {
  return {
    ...newInvoice(),
    ...i,
    status: i.status === "Paid" ? "Paid" : "Pending payment",
    orderStatus: i.orderStatus === "Fulfilled" ? "Fulfilled" : "Pending",
    fulfilledDate: i.fulfilledDate || "",
    otherCost: Number(i.otherCost) || 0,
  };
}

// ---------- Profit ----------
type Tier = { id: string; name: string };

/** Default cost for an item, from Invoice settings, matched by plan name. */
export function defaultUnitCost(description: string, settings: Pick<InvoiceSettings, "hardwareCosts">, tiers: Tier[]): number | undefined {
  const t = tiers.find((x) => x.name.trim().toLowerCase() === (description || "").trim().toLowerCase());
  const c = t ? settings.hardwareCosts?.[t.id] : undefined;
  return c === undefined || c === null ? undefined : Number(c) || 0;
}

/** Cost per unit for one item: the cost saved on the item, or the default from settings. */
export function itemUnitCost(it: LineItem, settings: Pick<InvoiceSettings, "hardwareCosts">, tiers: Tier[]) {
  if (it.unitCost !== undefined && it.unitCost !== null && String(it.unitCost) !== "") return Number(it.unitCost) || 0;
  return defaultUnitCost(it.description, settings, tiers);
}

/** Revenue, costs and profit for one invoice. missingCost = a tracker item has no cost set anywhere. */
export function profitOf(inv: Invoice, settings: Pick<InvoiceSettings, "hardwareCosts">, tiers: Tier[]) {
  const { total } = totals(inv);
  let hardware = 0;
  let missingCost = false;
  for (const it of inv.items) {
    const qty = Number(it.qty) || 0;
    const c = itemUnitCost(it, settings, tiers);
    if (c === undefined) {
      if (tiers.some((t) => t.name.trim().toLowerCase() === (it.description || "").trim().toLowerCase()) && qty > 0) missingCost = true;
      continue;
    }
    hardware += qty * c;
  }
  const other = Number(inv.otherCost) || 0;
  const cost = hardware + other;
  return { revenue: total, hardware, other, cost, profit: total - cost, missingCost };
}

/** Finds an invoice by number. Accepts "INV-2026-001", "inv-2026-001" or just "2026-001". */
export function findByNumber(list: Invoice[], input: string): Invoice | undefined {
  const q = input.trim().toUpperCase().replace(/\s+/g, "");
  if (!q) return undefined;
  return list.find((i) => (i.number || "").toUpperCase() === q) ?? list.find((i) => (i.number || "").toUpperCase().endsWith("-" + q));
}

/** Next number like INV-2026-001. The counter restarts at 001 each year. */
async function nextNumber(prefix: string): Promise<string> {
  const year = new Date().getFullYear();
  const ref = doc(db(), "counters", "invoices");
  const seq = await runTransaction(db(), async (tx) => {
    const snap = await tx.get(ref);
    const cur = snap.exists() ? (snap.data() as { year: number; seq: number }) : { year, seq: 0 };
    const n = cur.year === year ? cur.seq + 1 : 1;
    tx.set(ref, { year, seq: n });
    return n;
  });
  return `${prefix || "INV"}-${year}-${String(seq).padStart(3, "0")}`;
}

/** Saves the invoice (and its customer). Returns the saved invoice with id and number. */
export async function saveInvoice(inv: Invoice, prefix: string): Promise<Invoice> {
  const customerId = await saveCustomer({ ...inv.customer, id: inv.customerId || undefined });
  const t = totals(inv);
  const base = { ...inv, customerId, customer: { ...inv.customer, id: customerId } };
  delete (base as Partial<Invoice>).id;
  const data = { ...base, subtotal: t.subtotal, total: t.total };
  if (inv.id) {
    await updateDoc(doc(db(), "invoices", inv.id), { ...data, updatedAt: serverTimestamp() });
    return { ...base, id: inv.id };
  }
  const number = await nextNumber(prefix);
  const ref = await addDoc(collection(db(), "invoices"), { ...data, number, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return { ...base, number, id: ref.id };
}

export const setInvoiceStatus = (id: string, status: InvoiceStatus) =>
  updateDoc(doc(db(), "invoices", id), { status, updatedAt: serverTimestamp() });
export const setOrderStatus = (id: string, orderStatus: OrderStatus) =>
  updateDoc(doc(db(), "invoices", id), {
    orderStatus,
    fulfilledDate: orderStatus === "Fulfilled" ? today() : "",
    updatedAt: serverTimestamp(),
  });
export const deleteInvoice = (id: string) => deleteDoc(doc(db(), "invoices", id));

// ---------- Installation form submissions ----------
export type SubmissionStatus = "New" | "Converted";
export type Submission = {
  id?: string;
  name: string;
  address: string;
  email: string;
  vehicleMake: string;
  phone: string;
  plate: string;
  status: SubmissionStatus;
  createdAt?: number;
  customerId?: string;
  convertedAt?: number;
};

/** Firestore timestamps come back as objects; turn them into milliseconds. */
export const toMillis = (v: unknown): number => {
  if (!v) return 0;
  if (typeof v === "number") return v;
  const t = v as { toMillis?: () => number; seconds?: number };
  return t.toMillis ? t.toMillis() : (t.seconds || 0) * 1000;
};

export const formatDateTime = (ms?: number) =>
  ms ? new Date(ms).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

/** Public: used by the /form page. Only "create" is allowed by the rules. */
export async function submitInstallForm(data: Omit<Submission, "id" | "status" | "createdAt" | "customerId" | "convertedAt">) {
  await addDoc(collection(db(), "submissions"), { ...data, status: "New", createdAt: serverTimestamp() });
}

export async function listSubmissions(): Promise<Submission[]> {
  const snap = await getDocs(query(collection(db(), "submissions"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => {
    const v = d.data() as Submission;
    return { ...v, id: d.id, createdAt: toMillis(v.createdAt), convertedAt: toMillis(v.convertedAt) };
  });
}

export const deleteSubmission = (id: string) => deleteDoc(doc(db(), "submissions", id));

const digits = (x: string) => (x || "").replace(/\D/g, "").replace(/^234/, "0");

/** An existing customer with the same phone number or email, if any. */
export function matchCustomer(list: Customer[], s: Pick<Submission, "phone" | "email">) {
  const p = digits(s.phone);
  const e = (s.email || "").trim().toLowerCase();
  return list.find((c) => (p && digits(c.phone) === p) || (e && (c.email || "").trim().toLowerCase() === e));
}

/** Creates the customer (or uses the existing one) and marks the submission as converted. */
export async function convertSubmission(s: Submission, existing?: Customer): Promise<Customer> {
  const customer: Customer = existing ?? { name: s.name, phone: s.phone, email: s.email, company: "", address: s.address };
  const id = existing?.id ?? (await saveCustomer(customer));
  await updateDoc(doc(db(), "submissions", s.id!), { status: "Converted", customerId: id, convertedAt: serverTimestamp() });
  return { ...customer, id };
}

/** A new invoice already filled in from a submission. */
export function invoiceFromSubmission(s: Submission, c: Customer): Invoice {
  return {
    ...newInvoice(),
    customerId: c.id || "",
    customer: { ...emptyCustomer(), ...c },
    vehicles: [{ makeModel: s.vehicleMake, registration: s.plate }],
  };
}
