import { Icon } from "@/lib/icons";
import { services } from "@/lib/site";
import { d } from "@/lib/reveal";

export default function Services() {
  return (
    <section id="services" className="wrap py-14 lg:py-[100px]">
      <div data-reveal className="mx-auto max-w-[640px] text-center">
        <h2 className="h2">Our services</h2>
        <p className="mt-4 text-base text-mute">Everything you need to install, follow and protect your vehicle.</p>
      </div>
      <div className="mt-10 grid lg:mt-14 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <article key={s.title} data-reveal style={d(i % 3, 110)} className="group rounded-[20px] border border-[#eef1f8] bg-white p-6 shadow-[0_20px_60px_rgba(25,26,21,.05)] sm:p-8 transition hover:-translate-y-1 hover:border-brand/40">
            <span className="tile transition group-hover:bg-brand group-hover:text-white"><Icon name={s.icon} className="size-7" /></span>
            <h3 className="mb-2 mt-6 text-[22px] font-semibold tracking-tight">{s.title}</h3>
            <p className="text-[15px] text-mute">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
