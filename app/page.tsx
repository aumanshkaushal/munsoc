import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ArchiveFeature from "@/components/home/archive-feature";
import { societyLinks } from "@/lib/events";

export default function HomePage() {
  return (
    <main className="site-container">
      <section aria-labelledby="society-heading" className="home-intro">
        <div>
          <p className="editorial-label home-kicker">NIT Jalandhar <span aria-hidden="true">/</span> Est. 2024</p>
          <h1 id="society-heading" className="editorial-title home-title">MUNSoC NITJ</h1>
          <p className="mt-4 max-w-md text-[clamp(1rem,2vw,1.175rem)] leading-relaxed text-muted-foreground">The Model United Nations Society at NIT Jalandhar.</p>
        </div>
        <aside className="next-event" aria-labelledby="next-event-heading">
          <h2 id="next-event-heading" className="editorial-label flex items-center gap-2.5"><span className="next-event-dot" aria-hidden="true" /> Next event</h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed">No date announced yet.</p>
          <a href={societyLinks.instagram} className="text-link mt-2.5">Instagram updates <ArrowUpRight size={14} aria-hidden="true" /></a>
        </aside>
      </section>
      <ArchiveFeature />
      <div className="archive-bottom">
        <Link href="/events" className="text-link">Browse the event archive <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
