"use client";
import { Icon } from "@/lib/icons";
import { useContent } from "@/lib/useContent";
import { d } from "@/lib/reveal";

export default function Vehicles() {
  const { vehicles } = useContent();
  return (
    <section className="wrap pb-12 pt-4 lg:pb-[90px] lg:pt-8">
      <h2 data-reveal className="text-center text-[clamp(26px,3.2vw,40px)] font-semibold tracking-tight">{vehicles.title}</h2>
      <ul className="mx-auto mt-8 flex lg:mt-[50px] max-w-[1000px] flex-wrap justify-between gap-x-6 gap-y-4 max-lg:justify-center max-lg:gap-x-8">
        {vehicles.items.map((v, i) => (
          <li key={v.label} data-reveal style={d(i, 70)} className="flex items-center gap-3 text-[26px] font-semibold tracking-tight text-[#c3c3c3] max-sm:text-xl">
            <Icon name={v.icon} className="size-[34px]" />
            {v.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
