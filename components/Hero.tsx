import { Icon } from "@/lib/icons";

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero() {
  return (
    <section className="wrap grid items-center gap-6 pb-14 pt-4 lg:grid-cols-2 lg:gap-10 lg:pb-[90px] lg:pt-[60px]">
      <div className="lg:order-1">
        <h1 style={rise(100)} className="max-w-[560px] animate-rise text-balance text-[clamp(38px,6vw,76px)] font-semibold leading-[1.08] tracking-tight">
          Always know where your vehicle is
        </h1>
        <svg className="mb-7 mt-3 h-[26px] w-[min(479px,100%)] lg:mb-9 lg:mt-3.5" viewBox="0 0 479 26" preserveAspectRatio="none" aria-hidden>
          <path pathLength={1} strokeDasharray={1} className="animate-draw" d="M2 20C90 4 260 -4 477 18" fill="none" stroke="#54bd95" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <p style={rise(300)} className="max-w-[470px] animate-rise text-base text-[#33352e]">
          We install GPS trackers in cars, bikes, trucks and fleets. Follow your vehicle live from your phone, get instant alerts and review every trip.
        </p>
        <div style={rise(450)} className="mt-8 flex animate-rise flex-wrap items-center gap-x-8 gap-y-5 lg:mt-10">
          <a href="#quote" className="btn">Get a free quote</a>
          <a href="#services" className="group inline-flex items-center gap-3.5 text-base font-medium">
            <Icon name="play" className="size-10 text-brand transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
            See our services
          </a>
        </div>
      </div>

      <div aria-hidden style={rise(0)} className="relative mx-auto h-[420px] w-full max-w-[560px] animate-rise max-lg:order-first sm:h-[520px] lg:order-2 lg:ml-auto lg:h-[560px]">
        <div className="absolute right-[6%] top-0 h-[390px] w-[min(410px,76%)] overflow-hidden rounded-[20px] bg-brand shadow-[0_30px_60px_-30px_rgba(84,189,149,.6)] sm:right-5 sm:h-[490px] lg:h-[526px] lg:w-[min(410px,80%)]">
          <svg viewBox="0 0 410 526" preserveAspectRatio="xMidYMid slice" className="size-full">
            <g stroke="#fff" strokeOpacity=".22" strokeWidth="2" fill="none">
              <path d="M-20 90H430M-20 200H430M-20 330H430M-20 440H430" />
              <path d="M70 -10V540M190 -10V540M310 -10V540" />
            </g>
            <path d="M30 470C90 400 80 330 160 300S250 330 280 240 330 130 390 70" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 14" />
            <path pathLength={1} strokeDasharray={1} className="animate-draw" style={{ animationDuration: "2.4s", animationDelay: ".6s" }} d="M30 470C90 400 80 330 160 300S250 330 280 240" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <div className="absolute left-[62%] top-[44%] grid size-14 animate-pop place-items-center rounded-full bg-white text-brand-d shadow-[0_10px_24px_rgba(0,0,0,.18)] [animation-delay:2.4s]">
            <Icon name="car" className="size-[26px]" />
            <span className="absolute -inset-3.5 animate-pulse-ring rounded-full border-2 border-white/70" />
          </div>
        </div>
        <div style={rise(600)} className="absolute left-0 top-6 animate-rise sm:top-10">
          <div className="float relative w-[190px] animate-float px-4 py-3 sm:w-[230px] sm:px-5 sm:py-4">
            <small className="block text-xs text-mute">Vehicle status</small>
            <b className="mt-0.5 block text-[15px] sm:text-base">Moving, 62 km/h</b>
            <span className="absolute right-3 top-3 rounded-full bg-brand-l px-2 py-0.5 text-[11px] font-semibold text-brand-d">Live</span>
          </div>
        </div>
        <div style={rise(800)} className="absolute right-0 top-2 animate-rise sm:top-[30px]">
          <div className="float relative grid size-12 animate-float place-items-center rounded-xl bg-[#fbc75e] text-white [animation-delay:-2s] sm:size-[50px]"><Icon name="bell" /></div>
        </div>
        <div style={rise(900)} className="absolute left-[34px] top-[190px] animate-rise max-sm:hidden">
          <div className="float relative grid size-10 animate-float place-items-center rounded-xl bg-[#4535af] text-white [animation-delay:-4s]"><Icon name="shield" className="size-5" /></div>
        </div>
        <div style={rise(1000)} className="absolute bottom-[70px] right-0 animate-rise sm:bottom-[110px]">
          <div className="float relative h-[96px] w-[150px] animate-float -rotate-12 rounded-[14px] bg-gradient-to-br from-[#2a3142] to-[#0f131c] p-3 text-white [animation-delay:-1s] sm:h-[120px] sm:w-[200px] sm:p-[18px]">
            <i className="mb-2 block h-5 w-7 rounded-[5px] bg-gradient-to-br from-[#f3d27a] to-[#c99a2e] sm:mb-3 sm:h-[22px] sm:w-8" />
            <b className="text-sm sm:text-[15px]">GPS tracker</b>
            <small className="block text-xs text-[#9aa3b5]">Signal strong</small>
            <div className="mt-2 flex gap-1.5">{[0, 1, 2, 3].map((i) => <s key={i} className="size-1.5 rounded-full bg-brand" />)}</div>
          </div>
        </div>
        <div style={rise(1100)} className="absolute bottom-6 left-2 animate-rise sm:bottom-[60px] sm:left-[60px]">
          <div className="float relative w-[140px] animate-float px-4 py-3 [animation-delay:-3s] sm:w-[150px] sm:px-[18px] sm:py-3.5">
            <small className="block text-xs text-mute">Today&apos;s distance</small>
            <b className="text-xl text-brand-d sm:text-[22px]">48.2 km</b>
          </div>
        </div>
      </div>
    </section>
  );
}
