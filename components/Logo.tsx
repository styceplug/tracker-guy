export default function Logo({ dark = false }: { dark?: boolean }) {
  const ink = dark ? "text-white" : "text-ink";
  return (
    <a href="#top" className="group flex items-center gap-2.5 whitespace-nowrap text-xl font-semibold tracking-tight text-brand sm:text-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" width={44} height={44} className="size-10 rounded-[10px] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 sm:size-11" />
      <span>
        <span className={ink}>The </span>Tracker<span className={ink}> Guy</span>
      </span>
    </a>
  );
}
