"use client";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const y = window.scrollY + 140;
      let cur = nav[0].href;
      for (const n of nav) {
        const el = n.href === "#top" ? document.body : document.querySelector(n.href);
        if (el && (n.href === "#top" ? 0 : (el as HTMLElement).offsetTop) <= y) cur = n.href;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${scrolled ? "bg-white/90 shadow-[0_8px_30px_rgba(25,26,21,.06)]" : "bg-white/60"}`}>
      <div className="wrap flex h-[72px] items-center justify-between gap-3 sm:gap-6 lg:h-20">
        <Logo />
        <nav
          aria-label="Main"
          className={
            open
              ? "absolute inset-x-0 top-[72px] flex flex-col bg-white px-6 pb-6 pt-3 shadow-xl"
              : "hidden gap-10 text-[15px] text-mute lg:flex"
          }
        >
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`transition hover:text-ink max-lg:border-b max-lg:border-neutral-100 max-lg:py-3.5 max-lg:text-[17px] ${active === n.href ? "font-medium text-ink" : ""}`}
            >
              {n.label}
            </a>
          ))}
          <a href="#quote" onClick={() => setOpen(false)} className="btn mt-5 lg:hidden">Get a quote</a>
        </nav>
        <div className="hidden items-center gap-5 text-[15px] text-mute lg:flex">
          <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="hover:text-ink max-lg:hidden">Call us</a>
          <a href="#quote" className="btn !rounded-[10px] !px-5 !py-2.5 !text-[15px]">Get a quote</a>
        </div>
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="relative size-10 shrink-0 lg:hidden"
        >
          <span className={`absolute left-[9px] right-[9px] h-0.5 bg-ink transition-all ${open ? "top-[19px] rotate-45" : "top-[15px]"}`} />
          <span className={`absolute left-[9px] right-[9px] h-0.5 bg-ink transition-all ${open ? "top-[19px] -rotate-45" : "top-[23px]"}`} />
        </button>
      </div>
    </header>
  );
}
