"use client";
import { Icon } from "@/lib/icons";
import { commonFeatures, simNote, site, tiers } from "@/lib/site";
import { d } from "@/lib/reveal";
import Check from "./Check";

export default function Plans() {
  const pick = (plan: string) => window.dispatchEvent(new CustomEvent("plan-select", { detail: plan }));
  return (
    <section id="plans" className="wrap pb-14 pt-6 lg:pb-[110px] lg:pt-10">
      <h2 data-reveal className="h2 text-center">Two trackers. Simple prices.</h2>
      <p data-reveal style={d(1)} className="mx-auto mt-4 max-w-[560px] text-center text-base text-mute">
        Both trackers do the same tracking. The Advanced tracker adds audio monitoring.
      </p>

      <div className="mx-auto mt-10 grid max-w-[980px] items-stretch gap-7 md:grid-cols-2 lg:mt-14">
        {tiers.map((t, i) => {
          const pro = t.id === "advanced";
          return (
            <article
              key={t.id}
              data-reveal
              style={d(i, 130)}
              className={`relative flex flex-col rounded-[20px] p-7 sm:p-9 ${pro ? "border-2 border-brand bg-white shadow-[0_30px_70px_-25px_rgba(84,189,149,.55)]" : "border border-[#e8ecf4] bg-white shadow-[0_20px_60px_rgba(25,26,21,.06)]"}`}
            >
              {t.badge && (
                <span className="absolute -top-3.5 left-7 rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white sm:left-9">{t.badge}</span>
              )}
              <h3 className="text-[22px] font-semibold tracking-tight">{t.name}</h3>
              <p className="mt-1 text-sm text-mute">{t.blurb}</p>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <b className="text-[42px] font-semibold leading-none tracking-tight sm:text-5xl">{t.price}</b>
                <small className="whitespace-nowrap text-sm text-mute">{t.tag}</small>
              </div>

              <ul className="mt-7 grid gap-4">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-3.5 text-[15px] font-medium"><span className="mt-0.5"><Check small /></span>{p}</li>
                ))}
                {t.missing && (
                  <li className="flex items-start gap-3.5 text-[15px] text-mute">
                    <i className="mt-0.5 grid size-[26px] shrink-0 place-items-center rounded-full bg-[#eef0f4] text-[#9aa0ab]"><Icon name="x" className="size-3.5" strokeWidth={3} /></i>
                    {t.missing}
                  </li>
                )}
              </ul>

              <p className={`mt-7 rounded-xl px-4 py-3 text-sm font-semibold ${pro ? "bg-brand-l text-brand-d" : "bg-[#fff6e6] text-[#a56a00]"}`}>{t.fee}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-mute">{t.note}</p>

              <div className="mt-auto pt-8">
                <a href="#quote" onClick={() => pick(t.plan)} className={`btn w-full ${pro ? "" : "btn-soft"}`}>
                  Get the {t.name.split(" ")[0]} tracker
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <p data-reveal className="mx-auto mt-8 flex max-w-[980px] items-start justify-center gap-2.5 rounded-xl bg-[#fff6e6] px-5 py-3.5 text-[15px] font-medium text-[#a56a00]">
        <Icon name="bell" className="mt-0.5 size-5 shrink-0" />
        {simNote}
      </p>

      <p data-reveal className="mx-auto mt-6 max-w-[980px] text-center text-[15px] text-mute">
        Tracking a fleet? Fleet pricing is quoted separately.{" "}
        <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello, I would like a fleet tracking quote.")}`} target="_blank" rel="noopener" className="font-semibold text-brand-d underline underline-offset-4 hover:text-brand">
          Message us for a quote
        </a>
      </p>

      <div data-reveal className="mx-auto mt-8 max-w-[980px] rounded-[20px] bg-lav p-7 sm:p-9">
        <h3 className="text-xl font-semibold tracking-tight">Both trackers include</h3>
        <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {commonFeatures.map((f) => (
            <li key={f} className="flex items-center gap-3 text-[15px] font-medium"><Check small />{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
