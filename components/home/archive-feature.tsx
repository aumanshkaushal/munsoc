import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { youthParliament2026 as event } from "@/lib/events";

const featuredPhotos = event.photos.slice(0, 3);
const photoSizes = [
  "(max-width: 639px) 92vw, (max-width: 899px) 93vw, (max-width: 1279px) 44vw, 552px",
  "(max-width: 899px) 45vw, (max-width: 1279px) 22vw, 274px",
  "(max-width: 899px) 45vw, (max-width: 1279px) 25vw, 316px",
];

export default function ArchiveFeature() {
  return (
    <section aria-labelledby="featured-event" className="archive-feature border-t border-border">
      <div className="archive-feature-heading">
        <div>
          <p className="editorial-label">01 / From the archive</p>
          <h2 id="featured-event" className="editorial-title feature-title">{event.title}{" "}<span>{event.year}</span></h2>
          <p className="mt-3 text-sm text-muted-foreground">
            <time dateTime={event.date}>{event.dateLabel}</time> <span className="mx-1" aria-hidden="true">&middot;</span> {event.venue}
          </p>
        </div>
        <Link href={event.href} className="outline-link shrink-0">
          View photo album <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="feature-photos">
        {featuredPhotos.map((photo, index) => (
          <figure className="min-w-0" key={photo.src}>
            <div className="feature-photo relative overflow-hidden bg-secondary">
              <Image src={photo.src} alt={photo.alt} fill sizes={photoSizes[index]} className="object-cover" loading={index === 0 ? "eager" : undefined} />
            </div>
            <figcaption className="photo-caption">
              <span aria-hidden="true">0{index + 1}</span> {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
