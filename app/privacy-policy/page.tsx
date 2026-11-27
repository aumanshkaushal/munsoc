import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for MUNSoC NITJ - how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "Information We Collect",
    content: `When you submit an application or contact form on this website, we collect personal information you voluntarily provide, including your name, university email address, year of study, department, and any information included in your statement of purpose or MUN experience fields.

We do not collect payment information, government identification, or any sensitive personal data.`,
  },
  {
    title: "How We Use Your Information",
    content: `Information you submit is used solely for the following purposes:

• To process your membership application for MUNSoC NITJ
• To communicate with you regarding your application status, events, and society updates
• To maintain internal records of society membership
• To send notifications about upcoming conferences, workshops, and MUNSoC activities

We will never sell, rent, or trade your personal information to any third party.`,
  },
  {
    title: "Data Storage and Security",
    content: `Application data submitted through this website is transmitted via a third-party email service provider, and delivered to MUNSoC NITJ's official email address. We take reasonable precautions to protect your information, but no internet transmission is 100% secure.

We retain your data only as long as is reasonably necessary for the purposes described in this policy.`,
  },
  {
    title: "Cookies and Analytics",
    content: `This website uses third-party analytics services to understand aggregate traffic and usage patterns. This service does not use cookies and does not collect personally identifiable information. No tracking cookies are placed on your device when you visit this site.`,
  },
  {
    title: "Third-Party Links",
    content: `This website contains links to external sites such as Instagram, WhatsApp, and the university portal. We are not responsible for the privacy practices of these external services and encourage you to review their respective privacy policies.`,
  },
  {
    title: "Your Rights",
    content: `You may request that we correct or delete any personal information we hold about you by contacting us at the email address below. We will respond to such requests within a reasonable timeframe.`,
  },
  {
    title: "Changes to This Policy",
    content: `MUNSoC NITJ reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Continued use of this website after any changes constitutes acceptance of the revised policy.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us:

MUNSoC - Model United Nations Society
Dr. B.R. Ambedkar National Institute of Technology Jalandhar
Student Activity Cabin, NIT Jalandhar, Punjab - 144008

Instagram: @nitjmunsociety`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="site-container page-flow">
      <div className="page-intro">
        <p className="editorial-label">Effective June 2026</p>
        <h1 className="editorial-title page-title">Privacy policy</h1>
        <p className="page-description">This policy describes how MUNSoC NITJ collects, uses, and protects information you provide when you use this website. By using this site, you agree to the terms of this policy.</p>
      </div>
      <div>
        {sections.map((section) => (
          <section key={section.title} className="border-t border-border py-6">
            <h2 className="editorial-title mb-3 text-3xl">{section.title}</h2>
            <p className="max-w-prose text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{section.content}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
