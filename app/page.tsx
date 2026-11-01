import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Vehicles from "@/components/Vehicles";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Features from "@/components/Features";
import Meet from "@/components/Meet";
import Benefits from "@/components/Benefits";
import Plans from "@/components/Plans";
import FaqQuote from "@/components/FaqQuote";
import Footer from "@/components/Footer";
import RevealInit from "@/components/RevealInit";

export default function Page() {
  return (
    <>
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[1000px] overflow-hidden bg-gradient-to-b from-[#e6f6f0] to-white">
        <i className="absolute -left-52 -top-60 size-[634px] rounded-full bg-[#c9efe0] opacity-55 blur-[110px]" />
        <i className="absolute -right-32 top-16 size-[634px] rounded-full bg-[#d9e8ff] opacity-55 blur-[110px]" />
        <i className="absolute left-[40%] top-[340px] size-[634px] rounded-full bg-[#ffe9e0] opacity-40 blur-[110px]" />
      </div>
      <div id="top" />
      <RevealInit />
      <Nav />
      <main>
        <Hero />
        <Vehicles />
        <HowItWorks />
        <Services />
        <Features />
        <Meet />
        <Benefits />
        <Plans />
        <FaqQuote />
      </main>
      <Footer />
    </>
  );
}
