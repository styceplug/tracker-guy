"use client";
import { Icon } from "@/lib/icons";
import Check from "./Check";
import { d } from "@/lib/reveal";
import { images } from "@/lib/content";
import { useContent } from "@/lib/useContent";

export default function Benefits() {
  const { benefits: b } = useContent();
  const { items, rows } = b;
  return (
    <section className="wrap grid items-center gap-10 pb-14 pt-14 lg:gap-[60px] lg:pb-[100px] lg:pt-[90px] max-lg:grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      <div data-reveal>
        <h2 className="h2">{b.title}</h2>
        <ul className="mt-8 grid gap-6 lg:mt-11 lg:gap-[30px]">
          {items.map((t, i) => (
            <li key={i} data-reveal style={d(i + 1, 90)} className="flex items-center gap-5 text-lg font-medium max-sm:text-base"><Check />{t}</li>
          ))}
        </ul>
      </div>
      <div aria-hidden data-reveal="scale" className="relative min-h-[500px] lg:min-h-[540px]">
        <div className="absolute inset-y-0 right-[30px] w-[min(450px,86%)] rounded-[20px] bg-gradient-to-br from-[#cdeedf] to-brand max-sm:right-0 max-sm:w-[92%]">
          <div className="absolute left-1/2 top-[110px] grid w-[260px] -translate-x-1/2 gap-2.5 rounded-[28px] bg-white px-4 py-[22px] shadow-[0_30px_60px_-20px_rgba(22,28,40,.35)]">
            <div className="flex items-baseline justify-between px-1.5 pb-2"><b className="text-[17px]">{b.listTitle}</b><small className="text-xs font-semibold text-brand-d">{b.listTag}</small></div>
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[14px] bg-lav p-3">
                <Icon name={r.icon} className="size-9 shrink-0 rounded-[10px] bg-brand-l p-2 text-brand-d" />
                <div className="flex-1 leading-snug"><b className="block text-sm">{r.name}</b><small className="text-xs text-mute">{r.sub}</small></div>
                <em className={`size-2.5 rounded-full ${r.on ? "bg-brand" : "bg-[#cfd2d9]"}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="float left-0 top-[30px] flex animate-float w-[300px] items-center gap-3 px-3.5 py-3 max-sm:w-[250px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.logo} alt="" className="size-[46px] rounded-full" />
          <div className="flex-1"><b className="block text-sm">{b.cardTitle}</b><small className="text-xs text-mute">{b.cardSub}</small></div>
          <span className="grid size-9 place-items-center rounded-full bg-brand-l text-brand-d"><Icon name="phone" className="size-[17px]" /></span>
        </div>
        <div className="float bottom-[30px] left-[30px] flex animate-float [animation-delay:-3s] items-center gap-3 px-5 py-4 text-sm font-medium"><Icon name="shield" className="size-[22px] text-brand" />{b.badge}</div>
      </div>
    </section>
  );
}
