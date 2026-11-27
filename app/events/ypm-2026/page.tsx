import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PhotoAlbum from "@/components/events/photo-album";
import { youthParliament2026 as event } from "@/lib/events";

const title = `${event.title} ${event.year}`;
const description = `Photographs from Youth Parliament at NIT Jalandhar on ${event.dateLabel}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: event.href },
  openGraph: { title, description, url: event.href, images: [{ url: event.cover.src, alt: event.cover.alt }] },
};

export default function YouthParliamentPage() {
  return (
    <main className="site-container page-flow">
      <div className="page-intro">
        <Link href="/events" className="text-link mb-8"><ArrowLeft size={15} aria-hidden="true" /> Event archive</Link>
        <p className="editorial-label"><time dateTime={event.date}>{event.dateLabel}</time> / {event.venue}</p>
        <h1 className="editorial-title page-title">{title}</h1>
        <p className="page-description">
          Delegates in the {event.committee} debated reforms to the Indian examination system.
        </p>
        <a href="/guidebook.pdf" className="text-link mt-4" type="application/pdf">
          Event guidebook (PDF) <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <PhotoAlbum photos={event.photos} />
    </main>
  );
}
