"use client";
import { Icon } from "@/lib/icons";
import { d } from "@/lib/reveal";
import { useContent } from "@/lib/useContent";

const art = "relative h-[350px] overflow-hidden rounded-[20px] border border-[#eef1f8] bg-gradient-to-br from-[#f5fafa] to-[#eef0fb]";
const chip = "absolute inset-x-[26px] flex items-center gap-3 rounded-[14px] bg-white p-3.5 shadow-[0_10px_30px_rgba(25,26,21,.08)]";

function Alert({ icon, title, time, warn, cls = "", i }: { icon: string; title: string; time: string; warn?: boolean; cls?: string; i: number }) {
  return (
    <div style={{ "--i": i } as React.CSSProperties} className={`slide flex items-center gap-3 rounded-[14px] bg-white p-3.5 shadow-[0_10px_30px_rgba(25,26,21,.06)] ${cls}`}>
      <span className={`grid size-10 place-items-center rounded-xl ${warn ? "bg-[#fff1da] text-[#d78a0a]" : "bg-brand-l text-brand-d"}`}><Icon name={icon} className="size-5" /></span>
      <div><b className="block text-[15px]">{title}</b><small className="text-xs text-mute">{time}</small></div>
    </div>
  );
}

export default function Features() {
  const { features: f } = useContent();
  return (
    <section id="features" className="wrap pb-10 pt-6 lg:pb-[60px] lg:pt-[40px]">
      <div data-reveal className="grid items-center gap-6 max-lg:grid-cols-1 lg:grid-cols-[1fr_1.1fr_auto] lg:gap-12">
        <h2 className="h2">{f.title}</h2>
        <p className="text-base text-mute">{f.text}</p>
        <a href="#quote" className="btn justify-self-start">{f.cta}</a>
      </div>
      <div className="mt-10 grid gap-10 md:gap-[30px] lg:mt-[70px] md:grid-cols-2 lg:grid-cols-3">
        <article data-reveal>
          <div aria-hidden className={art}>
            <div className="absolute inset-x-[26px] bottom-[90px] top-[26px] rounded-[14px] bg-[#dff1ea]" style={{ backgroundImage: "linear-gradient(90deg,transparent 48%,#fff 48% 52%,transparent 52%),linear-gradient(transparent 48%,#fff 48% 52%,transparent 52%)", backgroundSize: "90px 90px" }}>
              <i className="absolute left-[12%] top-[70%] h-[3px] w-[70%] origin-left -rotate-[24deg] rounded bg-brand" />
              <Icon name="pin" className="absolute left-[66%] top-[16%] size-10 fill-white text-brand-d" />
            </div>
            <div className={`${chip} bottom-[26px]`}>
              <Icon name="car" className="size-9 rounded-[10px] bg-brand-l p-2 text-brand-d" />
              <div><b className="block text-[15px]">{f.live.chipTitle}</b><small className="text-xs text-mute">{f.live.chipSub}</small></div>
            </div>
          </div>
          <h3 className="mb-2 mt-6 text-2xl font-semibold tracking-tight">{f.live.title}</h3>
          <p className="max-w-[320px] text-[15px] text-mute">{f.live.text}</p>
        </article>
        <article data-reveal style={d(1, 130)}>
          <div aria-hidden className={`${art} grid content-center gap-3.5 px-[26px] py-[34px]`}>
            {f.alerts.items.map((a, i) => (
              <Alert key={i} icon={a.icon} title={a.title} time={a.time} warn={a.warn} cls={["", "ml-6 -mr-1.5", "mr-6"][i % 3]} i={i} />
            ))}
          </div>
          <h3 className="mb-2 mt-6 text-2xl font-semibold tracking-tight">{f.alerts.title}</h3>
          <p className="max-w-[320px] text-[15px] text-mute">{f.alerts.text}</p>
        </article>
        <article data-reveal style={d(2, 130)}>
          <div aria-hidden className={`${art} flex items-end gap-3.5 px-[30px] pb-[34px] pt-[110px]`}>
            {[40, 72, 55, 90, 35, 65, 48].map((h, i) => (
              <i key={i} style={{ height: `${h}%`, "--i": i } as React.CSSProperties} className={`bar flex-1 rounded-lg ${i % 2 ? "bg-brand" : "bg-[#bfe6d6]"}`} />
            ))}
            <div className={`${chip} top-[26px]`}>
              <Icon name="route" className="size-9 rounded-[10px] bg-brand-l p-2 text-brand-d" />
              <div><b className="block text-[15px]">{f.trips.chipTitle}</b><small className="text-xs text-mute">{f.trips.chipSub}</small></div>
            </div>
          </div>
          <h3 className="mb-2 mt-6 text-2xl font-semibold tracking-tight">{f.trips.title}</h3>
          <p className="max-w-[320px] text-[15px] text-mute">{f.trips.text}</p>
        </article>
      </div>
    </section>
  );
}
