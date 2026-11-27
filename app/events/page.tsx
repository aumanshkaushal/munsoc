import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { eventArchive } from "@/lib/events";

export const metadata: Metadata = {
  title: "Event Archive",
  description: "Photos and records from past MUNSoC NITJ events, starting with Youth Parliament 2026.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <main className="site-container page-flow">
      <div className="page-intro">
        <p className="editorial-label">MUNSoC NITJ</p>
        <h1 className="editorial-title page-title">Event archive</h1>
        <p className="page-description">Photographs and notes from past society events.</p>
      </div>
      <ul className="border-t border-border">
        {eventArchive.map((event) => (
          <li key={event.href} className="border-b border-border">
            <Link href={event.href} className="archive-entry group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary sm:aspect-[5/3]">
                <Image src={event.cover.src} alt="" fill sizes="(max-width: 639px) 92vw, 290px" className="object-cover" />
              </div>
              <div>
                <p className="editorial-label"><time dateTime={event.date}>{event.dateLabel}</time></p>
                <h2 className="editorial-title mt-2 text-[clamp(2rem,5vw,3.4rem)]">{event.title} {event.year}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{event.photos.length} photos <span aria-hidden="true">&middot;</span> {event.venue}</p>
              </div>
              <ArrowUpRight className="hidden sm:block" size={24} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
