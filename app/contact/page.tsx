import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/motion";
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import type { Metadata } from "next";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2a4 4 0 0 1 2-2z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MUNSoC NITJ. Reach out via email, social media, or visit our student activity cabin.",
  alternates: {
    canonical: "https://munsoc.opensourcenitj.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-4 bg-[#0a0a0a] overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 h-[300px] w-[500px] rounded-full bg-[#38bdf8]/8 blur-[120px] mun-glow"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
          <span
            className="font-heading font-bold text-white/[0.025] tracking-tighter whitespace-nowrap"
            style={{ fontSize: "clamp(5rem, 18vw, 13rem)" }}
            aria-hidden
          >
            CONTACT
          </span>
        </div>
        <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-block border border-[#38bdf8]/30 text-[#38bdf8] text-[10px] font-heading tracking-[0.2em] px-3 py-1 rounded-sm mb-5">
            GET IN TOUCH
          </div>
          <h1
            className="font-display text-white text-balance"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              letterSpacing: "0.04em",
            }}
          >
            CONNECT WITH MUNSOC
          </h1>
          <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-xl mx-auto text-pretty">
            Have questions regarding registrations, committees, portfolios, or partnerships? Reach out to us, and we will get back to you as soon as possible.
          </p>
        </Reveal>
      </section>

      {/* Contact Details Cards Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto bg-[#121212]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Email Card */}
          <Reveal delay={0.05} className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 hover:border-[#38bdf8]/30 transition-all duration-300">
            <div className="w-10 h-10 bg-[#38bdf8]/10 rounded-xl flex items-center justify-center mb-4 text-[#38bdf8]">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-bold text-white text-base tracking-wide mb-1">Email Us</h3>
            <p className="text-white/50 text-xs mb-4">For official inquiries and support</p>
            <a
              href="mailto:nitjmunsoc@gmail.com"
              className="text-[#38bdf8] hover:text-[#7dd3fc] font-heading font-bold text-sm tracking-wide transition-colors"
            >
              nitjmunsoc@gmail.com
            </a>
          </Reveal>

          {/* Location Card */}
          <Reveal delay={0.1} className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 hover:border-[#38bdf8]/30 transition-all duration-300">
            <div className="w-10 h-10 bg-[#38bdf8]/10 rounded-xl flex items-center justify-center mb-4 text-[#38bdf8]">
              <MapPin size={20} strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-bold text-white text-base tracking-wide mb-1">Our Location</h3>
            <p className="text-white/50 text-xs mb-4">Visit us on campus</p>
            <p className="text-white/70 text-xs leading-relaxed">
              Student Activity Cabin,<br />
              Student Activity Centre (SAC),<br />
              NIT Jalandhar, Punjab - 144008
            </p>
          </Reveal>

          {/* Social Channels Card */}
          <Reveal delay={0.15} className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 hover:border-[#38bdf8]/30 transition-all duration-300 md:col-span-2">
            <h3 className="font-heading font-bold text-white text-base tracking-wide mb-2">Connect Digitally</h3>
            <p className="text-white/50 text-xs mb-6">Stay updated with instant announcements via our social networks.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://instagram.com/nitjmunsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0a0a0a]/40 border border-white/5 rounded-xl p-3.5 hover:bg-[#38bdf8]/5 hover:border-[#38bdf8]/20 transition-all duration-300"
              >
                <span className="text-[#38bdf8]">
                  <InstagramIcon size={18} />
                </span>
                <div>
                  <span className="text-white text-xs font-semibold block">Instagram</span>
                  <span className="text-white/40 text-[10px]">@nitjmunsociety</span>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/company/munsoc-nitj"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0a0a0a]/40 border border-white/5 rounded-xl p-3.5 hover:bg-[#38bdf8]/5 hover:border-[#38bdf8]/20 transition-all duration-300"
              >
                <span className="text-[#38bdf8]">
                  <LinkedinIcon size={18} />
                </span>
                <div>
                  <span className="text-white text-xs font-semibold block">LinkedIn</span>
                  <span className="text-white/40 text-[10px]">MUNSoC NITJ</span>
                </div>
              </a>

              <a
                href="https://chat.whatsapp.com/IFbG2gOm3gvHSB5Vi4sIr5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0a0a0a]/40 border border-white/5 rounded-xl p-3.5 hover:bg-[#38bdf8]/5 hover:border-[#38bdf8]/20 transition-all duration-300"
              >
                <span className="text-[#38bdf8]">
                  <MessageCircle size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <span className="text-white text-xs font-semibold block">WhatsApp</span>
                  <span className="text-white/40 text-[10px]">Community Link</span>
                </div>
              </a>
            </div>
          </Reveal>

          {/* Working Hours / Response time Card */}
          <Reveal delay={0.2} className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 hover:border-[#38bdf8]/30 transition-all duration-300 md:col-span-2">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-[#38bdf8]/10 rounded-lg flex items-center justify-center text-[#38bdf8] shrink-0">
                <Clock size={16} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-sm tracking-wide mb-1">Response Time</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  We typical respond to all official emails within 24 to 48 hours. For urgent queries regarding registration or guidelines, we recommend reaching out to us through our Instagram handles or asking in the WhatsApp community.
                  </p>
                </div>
              </div>
            </Reveal>

          </div>
        </section>

      <Footer />
    </main>
  );
}
