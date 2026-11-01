"use client";
import { Icon } from "@/lib/icons";
import { useContent } from "@/lib/useContent";
import { d } from "@/lib/reveal";

export default function HowItWorks() {
  const { how } = useContent();
  const { steps, support } = how;
  return (
    <section id="how" className="bg-lav py-14 lg:py-20">
      <div className="wrap grid items-start gap-20 max-lg:grid-cols-1 max-lg:gap-12 lg:grid-cols-2">
        <div data-reveal>
          <h2 className="h2">{how.title}</h2>
          <p className="my-7 max-w-[560px] text-base text-mute">
            {how.text}
          </p>
          <ol className="grid gap-3.5">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-3.5 text-[17px] font-medium">
                <b className="grid size-[34px] shrink-0 place-items-center rounded-full bg-brand text-[15px] text-white">{i + 1}</b>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-9">
          {support.map((s, i) => (
            <article key={i} data-reveal style={d(i + 1, 120)} className="group flex gap-[22px]">
              <span className="tile"><Icon name={s.icon} className="size-7" /></span>
              <div>
                <h3 className="mb-2 text-[26px] font-semibold tracking-tight">{s.title}</h3>
                <p className="max-w-[430px] text-[15px] text-mute">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
