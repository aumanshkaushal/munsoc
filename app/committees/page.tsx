import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CommitteesGrid from "@/components/committees/committees-grid";
import { Reveal } from "@/components/motion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Committees",
  description: "Explore the simulated assemblies at MUNSoC NITJ.",
};

export default function CommitteesPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-36 pb-16 px-4 bg-[#0a0a0a] overflow-hidden">
        <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-block border border-[#38bdf8]/30 text-[#38bdf8] text-[10px] font-heading tracking-[0.2em] px-3 py-1 rounded-sm mb-5 uppercase">
            UPCOMING EVENT
          </div>
          <h1
            className="font-display text-white uppercase"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "0.04em",
            }}
          >
            COMMITTEES
          </h1>

        </Reveal>
      </section>

      <CommitteesGrid />
      <Footer />
    </main>
  );
}
