"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="site-container site-nav">
        <Link href="/" className="flex min-h-9 items-center gap-2.5">
          <Image src="/munsoc-black-blue.svg" alt="" width={32} height={32} className="size-8 object-contain" />
          <span className="text-sm font-semibold tracking-tight">MUNSoC NITJ</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-x-5 sm:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : link.href === "/events" && pathname.startsWith("/events/") ? "location" : undefined}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
