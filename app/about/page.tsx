import type { Metadata } from "next";
import OrganizingCommittee from "@/components/about/organizing-committee";
import CommitteeMembers from "@/components/about/committee-members";

export const metadata: Metadata = {
  title: "About Us",
  description: "The people and history behind the Model United Nations Society at NIT Jalandhar.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="site-container page-flow">
      <div className="page-intro">
        <p className="editorial-label">NIT Jalandhar / Est. 2024</p>
        <h1 className="editorial-title page-title">About the society</h1>
        <p className="page-description">We&apos;re the student society for Model United Nations, debate, and public speaking at NIT Jalandhar.</p>
      </div>
      <section aria-labelledby="society-history" className="grid gap-5 border-t border-border py-8 sm:grid-cols-[1fr_2fr] sm:gap-8">
        <h2 id="society-history" className="editorial-title text-4xl">Our history</h2>
        <p className="max-w-prose leading-relaxed text-muted-foreground">Students from the batches of 2025 and 2026 founded the society in 2024 and held a Youth Parliament in its first year. After a pause, a new team revived it as MUNSoC NITJ.</p>
      </section>
      <OrganizingCommittee />
      <CommitteeMembers />
    </main>
  );
}
