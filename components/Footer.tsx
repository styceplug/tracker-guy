import { Icon } from "@/lib/icons";
import { nav, site, socials } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  const link = "block mb-3.5 text-[15px] text-[#aab1c0] hover:text-white";
  return (
    <footer className="border-t border-night2 bg-night pt-[70px] text-white">
      <div className="wrap flex flex-wrap justify-between gap-[60px]">
        <div>
          <Logo dark />
          <p className="mb-7 mt-[18px] text-base text-[#aab1c0]">Vehicle tracker installation and support.</p>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" className="inline-flex items-center gap-2.5 rounded-full bg-night2 px-[22px] py-3.5 text-[15px] font-medium hover:bg-[#2b3447]">
            <Icon name="arrow" className="size-5 text-brand" />Chat on WhatsApp
          </a>
        </div>
        <div className="flex flex-wrap gap-[90px] max-sm:gap-12">
          <div>
            <h4 className="mb-5 text-base font-semibold">Company</h4>
            {nav.slice(1).map((n) => <a key={n.href} href={n.href} className={link}>{n.label}</a>)}
          </div>
          <div>
            <h4 className="mb-5 text-base font-semibold">Contact</h4>
            <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className={link}>{site.phone}</a>
            <a href={`mailto:${site.email}`} className={link}>{site.email}</a>
            <span className="block text-[15px] text-[#aab1c0]">{site.location}</span>
          </div>
          <div>
            <h4 className="mb-5 text-base font-semibold">Follow us</h4>
            {socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer me" className={link}>{s.label}</a>)}
          </div>
        </div>
      </div>
      <div className="wrap mt-[50px] border-t border-night2 py-[26px] text-sm text-[#8b93a5]">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
