import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { societyLinks } from "@/lib/events";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with MUNSoC NITJ by email or find us on campus.",
  alternates: { canonical: "/contact" },
};

const socialLinks = [
  { href: societyLinks.instagram, label: "Instagram" },
  { href: societyLinks.whatsapp, label: "WhatsApp community" },
  { href: societyLinks.linkedin, label: "LinkedIn" },
];

export default function ContactPage() {
  return (
    <main className="site-container page-flow">
      <div className="page-intro">
        <p className="editorial-label">MUNSoC NITJ</p>
        <h1 className="editorial-title page-title">Contact</h1>
        <p className="page-description">Questions about the society, an event, or working together? Send us a note.</p>
      </div>
      <div className="grid gap-7 border-t border-border py-8 sm:grid-cols-2 lg:grid-cols-3">
        <section>
          <h2 className="editorial-label mb-3">Email</h2>
          <a href={`mailto:${societyLinks.email}`} className="text-link">{societyLinks.email}</a>
        </section>
        <section>
          <h2 className="editorial-label mb-3">On campus</h2>
          <address className="text-sm leading-relaxed text-muted-foreground not-italic">
            Student Activity Cabin<br />
            Student Activity Centre (SAC)<br />
            NIT Jalandhar, Punjab 144008
          </address>
        </section>
        <section>
          <h2 className="editorial-label mb-3">Elsewhere</h2>
          <ul className="flex flex-col gap-2">
            {socialLinks.map(({ href, label }) => (
              <li key={href}><a href={href} className="text-link">{label} <ArrowUpRight size={14} aria-hidden="true" /></a></li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
