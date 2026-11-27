import Link from "next/link";
import { societyLinks } from "@/lib/events";

const footerLinks = [
  { href: societyLinks.instagram, label: "Instagram" },
  { href: societyLinks.whatsapp, label: "WhatsApp" },
  { href: societyLinks.linkedin, label: "LinkedIn" },
  { href: societyLinks.university, label: "NIT Jalandhar" },
  { href: "/privacy-policy", label: "Privacy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="site-container flex flex-wrap items-start justify-between gap-5 py-7 text-[0.8125rem]">
        <div>
          <Link href="/" className="font-semibold hover:underline">MUNSoC NITJ</Link>
          <p className="mt-1 text-muted-foreground">Student Activity Cabin, NIT Jalandhar</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
          {footerLinks.map((link) => (
            link.href.startsWith("/")
              ? <Link key={link.href} href={link.href} className="hover:text-foreground hover:underline">{link.label}</Link>
              : <a key={link.href} href={link.href} className="hover:text-foreground hover:underline">{link.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
