"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, type User } from "firebase/auth";
import { adminEmail, firebaseApp, firebaseReady } from "@/lib/firebase";
import { images } from "@/lib/content";
import { btn, btnGhost, card, firebaseError, inputCls, Label, Status } from "./ui";
import { Icon } from "@/lib/icons";
import ContentEditor from "./ContentEditor";
import Invoices from "./Invoices";
import Customers from "./Customers";
import InvoiceSettingsForm from "./InvoiceSettings";
import Dashboard from "./Dashboard";
import Submissions from "./Submissions";
import Summary from "./Summary";
import { AdminStore, useAdmin, type Tab } from "./store";

const tabs: { id: Tab; label: string; short: string; icon: string }[] = [
  { id: "home", label: "Dashboard", short: "Home", icon: "home" },
  { id: "summary", label: "Summary", short: "Summary", icon: "chart" },
  { id: "submissions", label: "Form submissions", short: "Forms", icon: "inbox" },
  { id: "invoices", label: "Invoices & orders", short: "Invoices", icon: "file" },
  { id: "customers", label: "Customers", short: "Customers", icon: "users" },
  { id: "content", label: "Website content", short: "Website", icon: "layout" },
  { id: "settings", label: "Invoice settings", short: "Settings", icon: "gear" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-[17px] font-semibold tracking-tight text-brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images.logo} alt="" className="size-9 rounded-[9px]" />
      <span><span className="text-ink">The </span>Tracker<span className="text-ink"> Guy</span></span>
      <span className="rounded-full bg-brand-l px-2 py-0.5 text-[11px] font-semibold text-brand-d">Admin</span>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await signInWithEmailAndPassword(getAuth(firebaseApp()), email.trim(), password);
    } catch (err) {
      setMsg({ type: "err", text: firebaseError(err) });
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!email.trim()) return setMsg({ type: "info", text: "Type your email first, then click Forgot password." });
    try {
      await sendPasswordResetEmail(getAuth(firebaseApp()), email.trim());
      setMsg({ type: "ok", text: "Password reset email sent." });
    } catch (err) {
      setMsg({ type: "err", text: firebaseError(err) });
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className={`${card} grid w-full max-w-[400px] gap-4`}>
        <Brand />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <Label text="Email">
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
        </Label>
        <Label text="Password">
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
        </Label>
        <Status msg={msg} />
        <button className={btn} disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <button type="button" onClick={reset} className="text-[13px] text-mute hover:text-ink">Forgot password?</button>
      </form>
    </div>
  );
}

function Shell({ email }: { email: string }) {
  const { route, nav, submissions } = useAdmin();
  const fresh = submissions.filter((s) => s.status === "New").length;
  const badge = (id: Tab) =>
    id === "submissions" && fresh > 0 ? (
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#f05a28] px-1.5 text-[11px] font-semibold leading-none text-white">{fresh}</span>
    ) : null;

  return (
    <div className="min-h-screen md:pl-[248px]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[#eef1f8] bg-white px-4 py-5 md:flex">
        <Brand />
        <nav className="mt-8 grid gap-1">
          {tabs.map((t) => {
            const on = route.tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => nav({ tab: t.id })}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-medium transition ${on ? "bg-brand-l text-brand-d" : "text-mute hover:bg-lav hover:text-ink"}`}
              >
                <Icon name={t.icon} className="size-[18px]" />
                <span className="flex-1">{t.label}</span>
                {badge(t.id)}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto grid gap-1 border-t border-[#eef1f8] pt-4">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-medium text-mute hover:bg-lav hover:text-ink">
            <Icon name="external" className="size-[18px]" />View website
          </a>
          <button onClick={() => signOut(getAuth(firebaseApp()))} className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-medium text-mute hover:bg-lav hover:text-ink">
            <Icon name="logout" className="size-[18px]" />Sign out
          </button>
          <p className="truncate px-3 pt-2 text-[12px] text-mute">{email}</p>
        </div>
      </aside>

      {/* phone top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#eef1f8] bg-white/90 px-4 py-2.5 backdrop-blur-xl md:hidden">
        <Brand />
        <div className="flex gap-1">
          <a href="/" target="_blank" rel="noopener" aria-label="View website" className="grid size-10 place-items-center rounded-[10px] text-mute hover:bg-lav"><Icon name="external" className="size-5" /></a>
          <button onClick={() => signOut(getAuth(firebaseApp()))} aria-label="Sign out" className="grid size-10 place-items-center rounded-[10px] text-mute hover:bg-lav"><Icon name="logout" className="size-5" /></button>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 pb-32 pt-5 sm:px-6 md:pb-16 md:pt-8 [&_.grid>*]:min-w-0">
        {route.tab === "home" && <Dashboard />}
        {route.tab === "summary" && <Summary />}
        {route.tab === "submissions" && <Submissions />}
        {route.tab === "invoices" && <Invoices />}
        {route.tab === "customers" && <Customers />}
        {route.tab === "content" && <ContentEditor />}
        {route.tab === "settings" && <InvoiceSettingsForm />}
      </main>

      {/* phone bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-7 border-t border-[#eef1f8] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        {tabs.map((t) => {
          const on = route.tab === t.id;
          return (
            <button key={t.id} onClick={() => nav({ tab: t.id })} className={`relative grid justify-items-center gap-1 py-2.5 text-[10px] font-medium ${on ? "text-brand-d" : "text-mute"}`}>
              <span className={`grid h-7 w-10 place-items-center rounded-full transition ${on ? "bg-brand-l" : ""}`}><Icon name={t.icon} className="size-[19px]" /></span>
              {t.short}
              {t.id === "submissions" && fresh > 0 && (
                <span className="absolute right-[calc(50%-20px)] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#f05a28] px-1 text-[10px] font-semibold leading-none text-white">{fresh}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!firebaseReady) return;
    return onAuthStateChanged(getAuth(firebaseApp()), setUser);
  }, []);

  if (!firebaseReady) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className={`${card} max-w-[520px]`}>
          <Brand />
          <h1 className="mt-4 text-xl font-semibold">Firebase is not set up yet</h1>
          <p className="mt-2 text-[15px] text-mute">
            Add the NEXT_PUBLIC_FIREBASE_... and NEXT_PUBLIC_ADMIN_EMAIL variables (see .env.example) to .env.local and to your
            hosting project settings, then rebuild.
          </p>
        </div>
      </div>
    );
  }

  if (user === undefined) return <div className="grid min-h-screen place-items-center text-mute">Loading...</div>;
  if (!user) return <Login />;

  const allowed = !adminEmail || (user.email || "").toLowerCase() === adminEmail;
  if (!allowed) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className={`${card} max-w-[460px] text-center`}>
          <h1 className="text-xl font-semibold">This account is not the admin</h1>
          <p className="mt-2 text-[15px] text-mute">Signed in as {user.email}.</p>
          <button onClick={() => signOut(getAuth(firebaseApp()))} className={`${btnGhost} mt-5`}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <AdminStore>
      <Shell email={user.email || ""} />
    </AdminStore>
  );
}
