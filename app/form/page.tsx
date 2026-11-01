import type { Metadata } from "next";
import InstallForm from "@/components/InstallForm";
import Logo from "@/components/Logo";
import { ContentProvider } from "@/lib/useContent";
import { loadContent } from "@/lib/loadContent";

export async function generateMetadata(): Promise<Metadata> {
  const c = await loadContent();
  return {
    title: `${c.installForm.title} | ${c.business.name}`,
    description: c.installForm.description,
    // Shared by link only, so keep it out of search results.
    robots: { index: false, follow: false },
    alternates: { canonical: "/form" },
  };
}

export default async function FormPage() {
  const content = await loadContent();
  return (
    <ContentProvider initial={content}>
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[600px] overflow-hidden bg-gradient-to-b from-[#e6f6f0] to-white">
        <i className="absolute -left-52 -top-60 size-[634px] rounded-full bg-[#c9efe0] opacity-55 blur-[110px]" />
        <i className="absolute -right-32 top-16 size-[634px] rounded-full bg-[#d9e8ff] opacity-55 blur-[110px]" />
      </div>
      <header className="wrap flex h-[72px] items-center lg:h-20">
        <Logo href="/" />
      </header>
      <main className="wrap pb-16 pt-4 lg:pt-8">
        <InstallForm />
      </main>
    </ContentProvider>
  );
}
