import { Icon } from "@/lib/icons";
import { meet, site } from "@/lib/site";
import { d } from "@/lib/reveal";

export default function Meet() {
  return (
    <section id="about" className="bg-lav py-14 lg:py-[90px]">
      <div className="wrap">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* photo */}
          <div data-reveal="scale" className="relative mx-auto w-full max-w-[460px] lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0e1b2e] to-[#1b3050] shadow-[0_30px_70px_-30px_rgba(14,27,46,.6)]">
              {meet.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meet.photo} alt={meet.photoAlt} className="size-full object-cover object-[center_15%]" />
              ) : (
                <div className="grid size-full place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="" className="size-[46%] rounded-[22%] opacity-95" />
                </div>
              )}
            </div>
            <div className="float -bottom-5 left-4 flex animate-float items-center gap-3 px-4 py-3 text-sm font-medium sm:-left-6 sm:text-[15px]">
              <span className="grid size-9 place-items-center rounded-lg bg-brand-l text-brand-d"><Icon name="shield" className="size-5" /></span>
              {meet.badges[0]}
            </div>
            <div className="float -top-4 right-4 flex animate-float items-center gap-3 px-4 py-3 text-sm font-medium [animation-delay:-3s] sm:-right-6 sm:text-[15px]">
              <span className="grid size-9 place-items-center rounded-lg bg-[#fff1da] text-[#d78a0a]"><Icon name="pin" className="size-5" /></span>
              {meet.badges[1]}
            </div>
          </div>

          {/* story */}
          <div data-reveal style={d(1, 120)}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-d">{meet.eyebrow}</p>
            <h2 className="h2">{meet.title}</h2>
            <div className="mt-6 grid gap-4 text-base leading-relaxed text-[#4a4c45]">
              {meet.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>

            <h3 className="mb-4 mt-9 text-xl font-semibold tracking-tight">{meet.stepsTitle}</h3>
            <ol className="grid gap-3">
              {meet.steps.map((t, i) => (
                <li key={t} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(25,26,21,.05)]">
                  <b className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm text-white">{i + 1}</b>
                  <span className="pt-0.5 text-[15px] font-medium sm:text-base">{t}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-night p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="text-[15px] font-medium sm:max-w-[320px] sm:text-base">{meet.promise}</p>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" className="btn shrink-0 !px-6 !py-3 !text-[15px]">
                Message Fawas
              </a>
            </div>
          </div>
        </div>

        {/* coverage */}
        <div className="mt-12 grid gap-6 lg:mt-20 lg:grid-cols-2">
          <div data-reveal className="rounded-[20px] bg-white p-7 shadow-[0_20px_60px_rgba(25,26,21,.05)] sm:p-8">
            <h3 className="text-xl font-semibold tracking-tight">What we fit</h3>
            <p className="mt-1 text-sm text-mute">Trackers for every kind of vehicle, across selected states in Nigeria.</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {meet.fits.map((f) => (
                <li key={f.label} className="inline-flex items-center gap-2 rounded-full bg-lav px-4 py-2.5 text-[15px] font-medium">
                  <Icon name={f.icon} className="size-5 text-brand-d" />{f.label}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={d(1, 120)} className="rounded-[20px] bg-white p-7 shadow-[0_20px_60px_rgba(25,26,21,.05)] sm:p-8">
            <h3 className="text-xl font-semibold tracking-tight">Where we install</h3>
            <p className="mt-1 text-sm text-mute">We come to you.</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-d">Same day</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {meet.sameDay.map((c) => (
                <li key={c} className="rounded-full bg-brand-l px-4 py-2 text-[15px] font-medium text-brand-d">{c}</li>
              ))}
            </ul>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-mute">Other states: {meet.otherDays.toLowerCase()}</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {meet.otherStates.map((c) => (
                <li key={c} className="rounded-full bg-lav px-4 py-2 text-[15px] font-medium">{c}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-mute">Not on the list? Message us and we will tell you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
