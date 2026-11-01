"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/lib/icons";
import { useContent } from "@/lib/useContent";
import { d } from "@/lib/reveal";

const input = "w-full rounded-[10px] bg-white px-[18px] py-3.5 text-[15px] text-ink outline-2 outline-transparent focus:outline-brand";

export default function FaqQuote() {
  const { faq, quote: q, business: site } = useContent();
  const faqs = faq.items;
  const [note, setNote] = useState<string | null>(null);
  const [bad, setBad] = useState<{ name?: boolean; phone?: boolean }>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const h = (e: Event) => setMsg(q.planMessage.replace("{plan}", String((e as CustomEvent).detail)));
    window.addEventListener("plan-select", h);
    return () => window.removeEventListener("plan-select", h);
  }, [q.planMessage]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    const next = { name: !name, phone: !phone };
    setBad(next);
    if (next.name || next.phone) return setNote(q.errorNote);
    const text =
      `${q.whatsappIntro}\nName: ${name}\nPhone: ${phone}\nVehicle: ${f.get("vehicle")}` +
      (msg.trim() ? `\nMessage: ${msg.trim()}` : "");
    setNote(q.sendingNote);
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <section id="faq" className="bg-night py-14 text-white lg:py-[90px]">
      <div className="wrap grid items-start gap-20 max-lg:grid-cols-1 max-lg:gap-12 lg:grid-cols-2">
        <div data-reveal>
          <h2 className="h2">{faq.title}</h2>
          <p className="mb-8 mt-5 text-base text-[#aab1c0]">{faq.text}</p>
          {faqs.map((f, i) => (
            <details key={i} open={i === 0} className="group border-b border-[#2c3446] py-5">
              <summary className="flex cursor-pointer list-none justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-2xl leading-none text-brand group-open:hidden">+</span>
                <span className="hidden text-2xl leading-none text-brand group-open:inline">–</span>
              </summary>
              <p className="mt-3 max-w-[480px] text-[15px] text-[#aab1c0]">{f.a}</p>
            </details>
          ))}
        </div>

        <form id="quote" data-reveal style={d(1, 150)} noValidate onSubmit={submit} className="grid gap-[18px] rounded-[20px] bg-night2 p-11 max-sm:px-5 max-sm:py-7">
          <div className="mx-auto grid size-16 place-items-center rounded-[18px] bg-brand"><Icon name="pin" className="size-[30px]" /></div>
          <h3 className="mb-1.5 text-center text-[26px] font-semibold tracking-tight text-brand">{q.title}</h3>
          <label className="grid gap-2 text-[15px] font-medium">{q.nameLabel}
            <input name="name" autoComplete="name" placeholder={q.namePlaceholder} className={`${input} ${bad.name ? "!outline-red-400" : ""}`} />
          </label>
          <label className="grid gap-2 text-[15px] font-medium">{q.phoneLabel}
            <input name="phone" type="tel" autoComplete="tel" placeholder={q.phonePlaceholder} className={`${input} ${bad.phone ? "!outline-red-400" : ""}`} />
          </label>
          <label className="grid gap-2 text-[15px] font-medium">{q.vehicleLabel}
            <select name="vehicle" className={input}>
              {q.vehicleOptions.map((v, i) => <option key={i}>{v}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-[15px] font-medium"><span>{q.messageLabel} <span className="font-normal text-[#8b93a5]">{q.optionalLabel}</span></span>
            <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={q.messagePlaceholder} className={`${input} resize-y`} />
          </label>
          <button type="submit" className="btn !w-full !rounded-[10px] !py-[18px]">{q.button}</button>
          <p className="text-center text-[13px] text-[#8b93a5]">{note ?? q.note}</p>
        </form>
      </div>
    </section>
  );
}
